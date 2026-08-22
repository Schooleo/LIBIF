#!/usr/bin/env python3
"""Regression tests for workflow result email construction."""

from __future__ import annotations

import importlib.util
import os
import pathlib
import unittest
from unittest import mock


SCRIPT = pathlib.Path(__file__).with_name("send-ci-result-email.py")
SPEC = importlib.util.spec_from_file_location("send_workflow_result_email", SCRIPT)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class CdNotificationTests(unittest.TestCase):
    def test_normalize_access_url_adds_https_and_extracts_domain(self) -> None:
        self.assertEqual(
            MODULE.normalize_access_url("libif.example.com/"),
            ("https://libif.example.com", "libif.example.com"),
        )

    def test_cd_email_contains_environment_domain_and_failure_warning(self) -> None:
        workflow_run = {
            "name": "Production",
            "display_title": "Release v1.0.1",
            "head_branch": "v1.0.1",
            "head_sha": "1234567890abcdef",
            "conclusion": "failure",
            "html_url": "https://github.example/actions/runs/1",
        }
        sent: dict[str, str] = {}

        def capture(recipient: str, subject: str, body: str) -> None:
            sent.update(recipient=recipient, subject=subject, body=body)

        environment = {
            "GITHUB_REPOSITORY": "Schooleo/LIBIF",
            "CD_NOTIFICATION_EMAIL": "ops@example.com",
            "PRODUCTION_ACCESS_URL": "https://libif.example.com",
        }
        with mock.patch.dict(os.environ, environment, clear=True), mock.patch.object(
            MODULE, "load_workflow_run", return_value=workflow_run
        ), mock.patch.object(
            MODULE, "associated_pull_request", return_value=None
        ), mock.patch.object(MODULE, "send_email", side_effect=capture):
            self.assertEqual(MODULE.send_cd_result(), 0)

        self.assertEqual(sent["recipient"], "ops@example.com")
        self.assertIn("Production CD FAILURE", sent["subject"])
        self.assertIn("Access domain: libif.example.com", sent["body"])
        self.assertIn("previous successful release", sent["body"])

    def test_cd_email_prefers_associated_pr_author_over_operations_fallback(self) -> None:
        workflow_run = {
            "name": "Staging Images",
            "display_title": "Merge pull request #39",
            "head_branch": "main",
            "head_sha": "1234567890abcdef",
            "conclusion": "success",
            "html_url": "https://github.example/actions/runs/2",
        }
        pull_request = {
            "number": 39,
            "title": "Release notification fix",
            "user": {"login": "contributor"},
        }
        sent: dict[str, str] = {}

        def capture(recipient: str, subject: str, body: str) -> None:
            sent.update(recipient=recipient, subject=subject, body=body)

        environment = {
            "GITHUB_REPOSITORY": "Schooleo/LIBIF",
            "CD_NOTIFICATION_EMAIL": "ops@example.com",
            "STAGING_ACCESS_URL": "https://staging.example.com",
        }
        with mock.patch.dict(os.environ, environment, clear=True), mock.patch.object(
            MODULE, "load_workflow_run", return_value=workflow_run
        ), mock.patch.object(
            MODULE, "associated_pull_request", return_value=pull_request
        ), mock.patch.object(
            MODULE,
            "resolve_pr_author_recipient",
            return_value=("contributor@example.com", "PR commit author email"),
            create=True,
        ), mock.patch.object(MODULE, "send_email", side_effect=capture):
            self.assertEqual(MODULE.send_cd_result(), 0)

        self.assertEqual(sent["recipient"], "contributor@example.com")
        self.assertIn("Pull request: #39 - Release notification fix", sent["body"])
        self.assertIn("Release owner: @contributor", sent["body"])

    def test_cd_recipient_falls_back_to_smtp_username(self) -> None:
        with mock.patch.dict(
            os.environ,
            {"SMTP_USERNAME": "sender@example.com"},
            clear=True,
        ):
            self.assertEqual(
                MODULE.resolve_cd_recipient("", {}),
                ("sender@example.com", "SMTP_USERNAME", None),
            )


if __name__ == "__main__":
    unittest.main()
