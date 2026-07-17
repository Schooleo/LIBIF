#!/usr/bin/env python3
"""Send a completed GitHub Actions CI result to the pull request author.

This script is intended to run from a privileged `workflow_run` workflow. It does
not check out or execute pull-request code. PR metadata is fetched from the
GitHub API, and the recipient is resolved from the author's public profile email
or from their non-noreply commit author email.
"""

from __future__ import annotations

import json
import os
import re
import smtplib
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from email.message import EmailMessage
from typing import Any

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
NOREPLY_DOMAINS = ("@users.noreply.github.com",)
NOREPLY_EXACT = {"noreply@github.com"}


def log(level: str, message: str) -> None:
    print(f"::{level}::{message}")


def clean_header(value: str) -> str:
    return " ".join(value.replace("\r", " ").replace("\n", " ").split())


def is_deliverable_email(value: str | None) -> bool:
    if not value:
        return False
    email = value.strip().lower()
    if not EMAIL_RE.match(email):
        return False
    if email in NOREPLY_EXACT:
        return False
    return not email.endswith(NOREPLY_DOMAINS)


def required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def github_api(path: str) -> Any:
    token = required_env("GITHUB_TOKEN")
    api_url = os.getenv("GITHUB_API_URL", "https://api.github.com").rstrip("/")
    url = f"{api_url}{path}"
    request = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "libif-ci-email-notifier",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"GitHub API request failed ({error.code}) for {path}: {detail}") from error


def load_workflow_run() -> dict[str, Any]:
    event_path = required_env("GITHUB_EVENT_PATH")
    with open(event_path, "r", encoding="utf-8") as event_file:
        payload = json.load(event_file)
    return payload["workflow_run"]


def associated_pull_request(repository: str, workflow_run: dict[str, Any]) -> dict[str, Any] | None:
    pull_requests = workflow_run.get("pull_requests") or []
    if pull_requests:
        number = pull_requests[0]["number"]
        return github_api(f"/repos/{repository}/pulls/{number}")

    head_sha = workflow_run.get("head_sha")
    if not head_sha:
        return None

    encoded_sha = urllib.parse.quote(head_sha, safe="")
    pulls = github_api(f"/repos/{repository}/commits/{encoded_sha}/pulls")
    if not pulls:
        return None
    return github_api(f"/repos/{repository}/pulls/{pulls[0]['number']}")


def resolve_recipient(repository: str, pr: dict[str, Any]) -> tuple[str | None, str]:
    author = pr.get("user") or {}
    login = author.get("login", "")
    if login:
        public_email = (github_api(f"/users/{urllib.parse.quote(login, safe='')}") or {}).get("email")
        if is_deliverable_email(public_email):
            return public_email.strip(), "GitHub public profile email"

    commits_url = f"/repos/{repository}/pulls/{pr['number']}/commits?per_page=100"
    for commit in reversed(github_api(commits_url) or []):
        commit_author = commit.get("author") or {}
        commit_author_login = commit_author.get("login")
        if login and commit_author_login and commit_author_login != login:
            continue
        email = ((commit.get("commit") or {}).get("author") or {}).get("email")
        if is_deliverable_email(email):
            return email.strip(), "PR commit author email"

    fallback = os.getenv("CI_RESULTS_FALLBACK_EMAIL", "").strip()
    if is_deliverable_email(fallback):
        return fallback, "CI_RESULTS_FALLBACK_EMAIL"

    return None, "no public or non-noreply author email available"


def smtp_configured() -> bool:
    required = ["SMTP_HOST", "SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_FROM"]
    missing = [name for name in required if not os.getenv(name)]
    if missing:
        log("warning", f"Skipping CI result email because SMTP secrets are missing: {', '.join(missing)}")
        return False
    return True


def send_email(recipient: str, subject: str, body: str) -> None:
    host = required_env("SMTP_HOST")
    port = int(os.getenv("SMTP_PORT") or "587")
    username = required_env("SMTP_USERNAME")
    password = required_env("SMTP_PASSWORD")
    sender = required_env("SMTP_FROM")
    secure = (os.getenv("SMTP_SECURE") or ("ssl" if port == 465 else "starttls")).lower()

    message = EmailMessage()
    message["From"] = sender
    message["To"] = recipient
    message["Subject"] = clean_header(subject)
    message.set_content(body)

    if secure == "ssl":
        with smtplib.SMTP_SSL(host, port, context=ssl.create_default_context(), timeout=30) as smtp:
            smtp.login(username, password)
            smtp.send_message(message)
    else:
        with smtplib.SMTP(host, port, timeout=30) as smtp:
            smtp.ehlo()
            if secure != "none":
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
            smtp.login(username, password)
            smtp.send_message(message)


def main() -> int:
    if not smtp_configured():
        return 0

    workflow_run = load_workflow_run()
    repository = os.getenv("GITHUB_REPOSITORY") or ""
    if not repository:
        log("warning", "Skipping CI result email because GITHUB_REPOSITORY is unavailable.")
        return 0

    pr = associated_pull_request(repository, workflow_run)
    if not pr:
        log("warning", "Skipping CI result email because no pull request is associated with this workflow run.")
        return 0

    recipient, source = resolve_recipient(repository, pr)
    author_login = (pr.get("user") or {}).get("login", "PR author")
    if not recipient:
        log("warning", f"Skipping CI result email for @{author_login}: {source}.")
        return 0

    conclusion = workflow_run.get("conclusion") or "completed"
    status = conclusion.upper()
    pr_number = pr["number"]
    pr_title = pr.get("title") or "Untitled PR"
    short_sha = (workflow_run.get("head_sha") or "")[:12]
    run_url = workflow_run.get("html_url") or ""
    branch = workflow_run.get("head_branch") or pr.get("head", {}).get("ref") or "unknown"

    subject = f"[{repository}] CI {status} for PR #{pr_number}"
    body = f"""Hello @{author_login},

The CI workflow for your pull request has completed.

Repository: {repository}
Pull request: #{pr_number} - {pr_title}
Branch: {branch}
Commit: {short_sha}
Result: {status}
Workflow run: {run_url}

Checks included: build and test.

This message was sent automatically by GitHub Actions.
"""

    send_email(recipient, subject, body)
    log("notice", f"Sent CI result email for PR #{pr_number} to @{author_login} using {source}.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # Keep notification failures visible without hiding the CI result.
        log("error", str(exc))
        raise
