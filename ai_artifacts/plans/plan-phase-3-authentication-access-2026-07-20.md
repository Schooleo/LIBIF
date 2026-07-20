# Phase 3 Plan — Authentication / Access

Created: 2026-07-20  
Mode: `$plan`  
Canonical artifact: `ai_artifacts/plans/plan-phase-3-authentication-access-2026-07-20.md`  
OMX mirror: `.omx/plans/plan-phase-3-authentication-access-2026-07-20.md`

## 1. Requirements Summary

Phase 3 should replace the Phase 2 development-header authentication boundary with production-ready email/password authentication, session persistence, password reset flows, and frontend auth routes while preserving the role/permission primitives introduced in Phase 1–2.

The implementation should:

- Add real reader registration, sign-in, sign-out, session lookup, password-reset request, and password-reset completion APIs.
- Persist revocable sessions in PostgreSQL and expose the current session through the existing `GET /api/auth/session` contract.
- Set and clear secure HTTP-only cookies from the API boundary.
- Keep development-header auth available only as an explicit non-production fallback for local/dev workflows.
- Add the missing auth screens listed in `ai_artifacts/docs/screen-matrix.md`.
- Update OpenAPI, generated frontend types, and centralized docs after implementation.
- Avoid introducing new native dependencies unless explicitly approved; use Node built-ins where feasible.

## 2. Current-State Evidence

Repo anchors inspected for this plan:

- `apps/api/src/modules/auth/auth.service.ts` currently resolves sessions through dev headers only outside production.
- `apps/api/src/modules/auth/auth.controller.ts` currently exposes only `GET /auth/session`.
- `apps/api/src/modules/auth/dto/session.dto.ts` defines role and permission DTO primitives.
- `apps/api/src/modules/auth/roles.guard.ts` already protects staff routes from the current session boundary.
- `apps/api/prisma/schema.prisma` has `User` and `UserRole`, but no persisted sessions or reset-token model.
- `apps/web/app/(admin)/layout.tsx` already gates staff UI through `fetchSession` and redirects to `/access-denied`.
- `apps/web/app/(auth)/access-denied/page.tsx` and `apps/web/app/(auth)/session-expired/page.tsx` exist as Phase 2 boundary pages.
- `apps/web/lib/api-server.ts` currently fetches `GET /api/auth/session` without a production cookie-forwarding strategy.
- `apps/web/lib/api-browser.ts` currently supports browser API calls and development auth headers.
- `apps/web/lib/auth/session.ts` keeps dev headers opt-in and disabled in production.
- `ai_artifacts/docs/api-contracts.md` already reserves Phase 3 auth endpoints.
- `ai_artifacts/docs/screen-matrix.md` marks `sign_in`, `sign_in_validation_error`, `reader_registration`, `forgot_password`, `reset_password`, and `password_reset_completed` as not implemented.
- `ai_artifacts/docs/workflow-state-machines.md` defines the target auth and password-reset states.
- `ai_artifacts/docs/architecture-alignment.md` identifies production auth as the next major deferred boundary.

External reference direction checked for this plan:

- Next.js authentication guidance recommends server-managed sessions and secure cookie settings such as `HttpOnly`, `Secure`, `SameSite`, expiration, and path.
- Next.js `cookies` API documentation confirms Server Components can read cookies, while write/delete behavior belongs in Server Actions or Route Handlers.
- NestJS authentication guidance supports keeping auth concerns in an `AuthModule`/`AuthService`/`AuthController` boundary.
- OWASP guidance supports strong password hashing, uniform forgot-password responses, random single-use reset tokens, and revocable/session-aware reauthentication practices.

## 3. Scope

### In Scope

1. Backend auth APIs
   - `POST /api/auth/register`
   - `POST /api/auth/sign-in`
   - `POST /api/auth/sign-out`
   - `GET /api/auth/session`
   - `POST /api/auth/password-reset-requests`
   - `POST /api/auth/password-resets`

2. Backend persistence
   - Persisted session table with hashed session tokens.
   - Persisted password-reset token table with hashed single-use tokens.
   - Minimal user metadata needed for sign-in/reset observability.

3. Security primitives
   - Password hashing with a replaceable service boundary.
   - Constant-time hash/token comparisons where applicable.
   - HTTP-only cookie session transport.
   - Uniform password-reset request response for existing and non-existing emails.
   - Session revocation on sign-out.

4. Frontend auth flows
   - `/sign-in`
   - `/register`
   - `/forgot-password`
   - `/reset-password`
   - `/reset-password/completed`
   - Updated `/access-denied` and `/session-expired` copy so they no longer read as Phase 2 placeholders.

5. Integration contracts
   - OpenAPI regeneration.
   - Generated frontend API type update.
   - API/browser/server adapters updated for cookie credentials.

6. Documentation
   - Update `ai_artifacts/prompts/Agent_Prompt.md` Phase 3 status and handoff guidance.
   - Update `ai_artifacts/docs/api-contracts.md` endpoint statuses.
   - Update `ai_artifacts/docs/screen-matrix.md` implementation statuses.
   - Update `ai_artifacts/docs/workflow-state-machines.md` with final auth transitions.
   - Update `ai_artifacts/docs/architecture-alignment.md` auth/access boundary notes.

### Out of Scope

- OAuth/social login.
- MFA/passkeys.
- Production email-provider integration beyond a port/interface and development outbox/log implementation.
- Full account administration, staff user management, role-change approval, or account deactivation workflows.
- Reader library/PDF access entitlements beyond current session role/permission exposure.
- CAPTCHA, advanced abuse throttling, or lockout policy unless an existing local pattern already supports it.
- Security audit logging beyond minimal session/reset metadata.

## 4. Recommended Technical Direction

### 4.1 Session Strategy

Use opaque, revocable, database-backed sessions rather than stateless JWTs.

Rationale:

- The app already uses a NestJS API plus PostgreSQL boundary.
- Sign-out, password-reset invalidation, and future account deactivation are easier with server-side revocation.
- The frontend already depends on `GET /api/auth/session` rather than decoding client-side identity claims.

Proposed session model:

```prisma
model UserSession {
  id          String    @id @default(cuid())
  userId      String
  tokenHash   String    @unique
  expiresAt   DateTime
  revokedAt   DateTime?
  createdAt   DateTime  @default(now())
  lastSeenAt  DateTime?
  userAgent   String?
  ipHash      String?

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}
```

Cookie recommendation:

- Name: `libif_session`
- Value: unguessable opaque token, never the database ID.
- Flags: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` in production, explicit max age/expiration.
- Clear cookie on sign-out and when session lookup detects an invalid/expired session.

### 4.2 Password Hashing

Use a `PasswordHasher` service abstraction so the storage format can evolve.

Recommended Phase 3 default:

- Use Node `crypto.scrypt` with per-user random salt and a versioned stored hash format.
- Use `timingSafeEqual` for hash comparisons.
- Keep the service boundary narrow enough to migrate to Argon2id later if native dependency installation becomes acceptable.

Reasoning:

- OWASP accepts scrypt when configured appropriately.
- This environment previously showed install-script constraints, so adding native Argon2 should not be a Phase 3 blocker.
- A versioned hash format prevents future migrations from needing schema redesign.

Suggested stored format:

```text
scrypt$N=131072,r=8,p=1$<base64-salt>$<base64-derived-key>
```

### 4.3 Password Reset Strategy

Use random, single-use, expiring reset tokens stored only as hashes.

Proposed reset model:

```prisma
model PasswordResetToken {
  id          String    @id @default(cuid())
  userId      String
  tokenHash   String    @unique
  expiresAt   DateTime
  usedAt      DateTime?
  createdAt   DateTime  @default(now())
  requesterIpHash String?

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}
```

Behavior:

- `POST /api/auth/password-reset-requests` always returns the same public success response.
- If an account exists, create a reset token and send it through a mail/outbox port.
- In development/test, expose the token only through a controlled test seam, log sink, or dev outbox implementation; never return it from the public API.
- `POST /api/auth/password-resets` validates token, sets the new password, marks token used, and revokes existing sessions for that user.

### 4.4 Access and Permission Direction

Keep the existing `ROLE_KEYS`, `PERMISSION_KEYS`, and `RolesGuard` direction, but move from dev-header identity resolution to persisted session resolution.

Phase 3 should not expand role-management features. It should only ensure:

- Reader registration creates `READER` users.
- Staff/admin access still depends on resolved persisted session roles.
- Permission failure responses use the documented envelope.
- Dev-header auth cannot silently activate in production.

## 5. Acceptance Criteria

### Backend

- `POST /api/auth/register` creates a reader user, rejects duplicate emails safely, hashes passwords, creates a session, sets `libif_session`, and returns a `SessionDto`.
- `POST /api/auth/sign-in` validates credentials, creates a new persisted session, sets `libif_session`, and returns a `SessionDto`.
- `POST /api/auth/sign-out` revokes the current session, clears `libif_session`, and is idempotent for missing/expired sessions.
- `GET /api/auth/session` resolves valid persisted sessions and returns the existing session DTO shape.
- `GET /api/auth/session` returns a safe unauthenticated response/error for missing, expired, revoked, or malformed cookies.
- `POST /api/auth/password-reset-requests` returns a uniform response regardless of account existence.
- `POST /api/auth/password-resets` accepts valid reset tokens exactly once, updates the password, revokes existing sessions, and rejects expired/used/invalid tokens safely.
- No endpoint returns raw password hashes or raw session/reset tokens, except controlled non-public test/dev inspection seams.
- Production mode does not accept development auth headers.

### Frontend

- `/sign-in` renders a working form with validation-error state.
- `/register` renders a reader registration flow.
- `/forgot-password` renders a reset request flow and shows a uniform success state.
- `/reset-password` handles token input/query state and submits the new password.
- `/reset-password/completed` renders after successful reset.
- `/session-expired` and `/access-denied` copy describes real auth/access outcomes, not Phase 2 placeholder behavior.
- Browser calls use cookie credentials where needed.
- Server-side session fetches forward incoming cookies to the API.
- Admin layout continues redirecting unauthenticated/non-staff users correctly.

### Contracts and Docs

- `apps/api/openapi/libif-api.json` regenerated.
- `apps/web/lib/generated/api-types.ts` regenerated.
- `apps/web/lib/api-types.ts` exports new auth request/response aliases where useful.
- Centralized `ai_artifacts` docs updated to mark Phase 3 implementation status and remove stale placeholder language.

### Verification

- Prisma migration applies cleanly from a fresh database.
- Backend auth unit tests pass.
- Backend auth e2e tests pass.
- Frontend auth component/action tests pass where the existing test stack supports them.
- Full lint, test, build, and OpenAPI generation pass.

## 6. Implementation Steps

### Step 0 — Preflight and Behavior Lock

Files to inspect before editing:

- `package.json`
- `apps/api/package.json`
- `apps/web/package.json`
- `apps/api/prisma/schema.prisma`
- existing test setup under `apps/api/test` and `apps/web`

Actions:

1. Confirm available scripts for lint/test/build/openapi.
2. Run current targeted auth/session tests if present.
3. Add initial failing tests for auth service/session behavior before implementation where coverage is missing.

Expected output:

- A clear test baseline.
- No dependency additions unless explicitly justified and non-native.

### Step 1 — Add Auth Persistence Models

Primary file:

- `apps/api/prisma/schema.prisma`

Actions:

1. Add `UserSession` and `PasswordResetToken` models.
2. Add back-relations to `User`.
3. Consider minimal user metadata fields only if needed:
   - `lastSignInAt DateTime?`
   - `disabledAt DateTime?` only if guards need future-safe denial logic.
4. Generate a Prisma migration.

Acceptance evidence:

- Migration generated and applies cleanly.
- Prisma client generation passes.

### Step 2 — Implement Auth Domain Services

Primary files likely needed:

- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/auth/auth.module.ts`
- `apps/api/src/modules/auth/password-hasher.service.ts`
- `apps/api/src/modules/auth/session-token.service.ts`
- `apps/api/src/modules/auth/password-reset.service.ts`
- `apps/api/src/modules/auth/auth-cookie.service.ts`

Actions:

1. Add password hashing/verification service with versioned scrypt hashes.
2. Add random token generation and SHA-256 token hashing utilities.
3. Add persisted session creation, lookup, touch/expiry, and revocation behavior.
4. Add password reset request/consume behavior.
5. Add a mail/reset notification port with development/test implementation.
6. Preserve dev-header auth as an explicit non-production fallback only.

Acceptance evidence:

- Unit tests cover password hash roundtrip and mismatch.
- Unit tests cover session expiry/revocation.
- Unit tests cover reset token one-time use and expiry.

### Step 3 — Define DTOs and OpenAPI Contracts

Primary files likely needed:

- `apps/api/src/modules/auth/dto/session.dto.ts`
- new DTO files under `apps/api/src/modules/auth/dto/`
- `apps/api/src/modules/auth/auth.controller.ts`

DTOs to add:

- `RegisterRequestDto`
- `SignInRequestDto`
- `PasswordResetRequestDto`
- `PasswordResetDto`
- `AuthMessageDto` or equivalent standard success message response

Actions:

1. Add validation decorators with safe error messages.
2. Add Swagger decorators for request/response/error shapes.
3. Ensure validation-error envelopes align with existing API docs.

Acceptance evidence:

- OpenAPI includes all Phase 3 endpoints and DTOs.

### Step 4 — Implement Auth Controller Endpoints and Cookies

Primary file:

- `apps/api/src/modules/auth/auth.controller.ts`

Actions:

1. Implement register/sign-in/sign-out/session/reset endpoints.
2. Set `libif_session` cookie on register/sign-in.
3. Clear `libif_session` cookie on sign-out and invalid session where appropriate.
4. Ensure password reset request response is uniform.
5. Avoid returning raw tokens from public handlers.

Acceptance evidence:

- E2E tests confirm `Set-Cookie` flags and session persistence.
- E2E tests confirm sign-out invalidates session.

### Step 5 — Update Guards and Session Resolution

Primary files:

- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/auth/roles.guard.ts`
- staff/admin controllers currently protected by `RolesGuard`

Actions:

1. Make `resolveUser(request)` prefer persisted cookie sessions.
2. Keep dev-header fallback behind explicit non-production configuration.
3. Ensure role/permission mapping remains centralized and stable.
4. Normalize permission failure payloads.

Acceptance evidence:

- Existing admin/staff protected endpoint tests still pass.
- New tests prove production ignores dev auth headers.

### Step 6 — Update Web API Adapters

Primary files:

- `apps/web/lib/api-server.ts`
- `apps/web/lib/api-browser.ts`
- `apps/web/lib/auth/session.ts`
- `apps/web/lib/api-types.ts`

Actions:

1. Forward incoming cookies from server-rendered requests to the NestJS API.
2. Use `credentials: 'include'` for browser auth calls.
3. Add typed wrappers for register/sign-in/sign-out/reset endpoints.
4. Keep dev auth headers opt-in and disabled by default.

Acceptance evidence:

- Frontend unit tests or smoke tests confirm wrappers build and typecheck.

### Step 7 — Build Auth Routes and Forms

Primary files/directories:

- `apps/web/app/(auth)/sign-in/page.tsx`
- `apps/web/app/(auth)/register/page.tsx`
- `apps/web/app/(auth)/forgot-password/page.tsx`
- `apps/web/app/(auth)/reset-password/page.tsx`
- `apps/web/app/(auth)/reset-password/completed/page.tsx`
- shared auth form components if existing patterns support them

Actions:

1. Reuse Phase 1 shared tokens/components before adding new UI primitives.
2. Implement form validation and API error display.
3. Redirect successful sign-in/registration to the appropriate authenticated destination.
4. Keep reset request success message uniform.
5. Handle invalid/expired reset token responses safely.

Acceptance evidence:

- Pages compile and route correctly.
- Tests cover validation-error and success states if the web test stack is available.

### Step 8 — Update Existing Access Pages and Admin Boundary

Primary files:

- `apps/web/app/(auth)/access-denied/page.tsx`
- `apps/web/app/(auth)/session-expired/page.tsx`
- `apps/web/app/(admin)/layout.tsx`
- admin shell sign-out affordance if present

Actions:

1. Remove Phase 2 placeholder wording.
2. Add links/actions to sign in again or return to catalog as appropriate.
3. Add a sign-out action in the admin shell if a suitable existing shell affordance exists.

Acceptance evidence:

- Unauthenticated admin access redirects to `/access-denied` or `/session-expired` according to the existing route contract.
- Signed-in staff access remains allowed.

### Step 9 — Regenerate Contracts and Types

Commands:

- `npm run openapi:generate`
- Any existing frontend type generation script if separate from OpenAPI generation.

Files expected to change:

- `apps/api/openapi/libif-api.json`
- `apps/web/lib/generated/api-types.ts`
- possibly `apps/web/lib/api-types.ts`

Acceptance evidence:

- Generated files are deterministic.
- No stale manual DTO aliases conflict with generated shapes.

### Step 10 — Update Centralized Docs

Primary files:

- `ai_artifacts/prompts/Agent_Prompt.md`
- `ai_artifacts/docs/api-contracts.md`
- `ai_artifacts/docs/screen-matrix.md`
- `ai_artifacts/docs/workflow-state-machines.md`
- `ai_artifacts/docs/architecture-alignment.md`

Actions:

1. Mark Phase 3 auth/access endpoints and screens according to actual implementation.
2. Remove references that imply auth is only a Phase 2 placeholder.
3. Keep docs non-redundant: link between docs instead of repeating endpoint/screen details in every file.
4. Record remaining deferred auth items, especially OAuth/MFA/email provider integration if still out of scope.

Acceptance evidence:

- Docs mention each Phase 3 artifact once in the most appropriate place.
- Agent prompt gives future team members current, actionable context.

## 7. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Cookie behavior differs between local web/API ports and deployment domains | Auth works in tests but not browser runtime | Define cookie options through config; test browser fetch with `credentials: include`; document deployment assumptions. |
| Password hashing work factor too high for CI | Slow/flaky tests | Centralize hasher config; use production-safe default and lower test override. |
| Password reset token leaks through API/tests | Security regression | Never return token from public endpoint; use controlled test/dev outbox seam. |
| Dev-header fallback accidentally enabled in production | Critical access bypass | Add explicit production test proving dev headers are ignored. |
| Auth UI creates new visual primitives instead of reusing Phase 1 components | Design drift | Require reuse of shared tokens/components first; only add role-specific components when there is no existing primitive. |
| Reset/sign-out session invalidation not enforced | Account takeover persistence risk | E2E test reset invalidates previous sessions and sign-out revokes current session. |
| OpenAPI/manual types diverge | Frontend/backend contract drift | Regenerate OpenAPI and generated types as part of verification. |

## 8. Verification Plan

Run the smallest checks after each major slice, then the full suite before completion.

Targeted checks:

1. Prisma
   - `npx prisma generate --schema apps/api/prisma/schema.prisma`
   - migration apply/deploy command used by the repo

2. Backend unit/e2e
   - Auth service/password hasher tests
   - Auth controller e2e tests
   - Protected route e2e tests

3. Frontend
   - Auth route/form tests if existing web test framework supports them
   - Typecheck/build for server/client boundary correctness

4. Contract generation
   - `npm run openapi:generate`

Final required checks:

```bash
npm run openapi:generate
npm run lint
npm test
npm run build
npm run test:e2e -w apps/api
```

If any command is unavailable or fails for an unrelated known environment issue, record the exact command, output summary, and next-best validation.

## 9. Execution Handoff Recommendation

Recommended execution mode: `$ralph Execute the Phase 3 plan`.

Reasoning:

- Authentication/access is security-sensitive and benefits from a single persistent owner with verification loops.
- The work crosses backend, frontend, contracts, and docs, but the dependencies are sequential enough that full team orchestration is optional.
- If execution speed becomes more important, split into bounded subagents under the Ralph leader:
  - Backend auth persistence/services/endpoints.
  - Frontend auth routes/adapters.
  - Verification/docs/contracts.

Do not start role-management modules before Phase 3 is implemented and verified. Role modules depend on trustworthy session identity, permission enforcement, and account/session revocation semantics from this phase.

## 10. Completion Report Requirements

The Phase 3 completion report should include:

- Changed backend auth files and migration names.
- Changed frontend auth routes/components/adapters.
- Updated generated contract files.
- Updated `ai_artifacts` docs.
- Verification commands run and pass/fail evidence.
- Explicit remaining auth limitations, especially email provider, MFA/OAuth, rate limiting, and role administration if deferred.

## 11. Official References Used

- Next.js Authentication Guide: https://nextjs.org/docs/app/guides/authentication
- Next.js `cookies` API: https://nextjs.org/docs/app/api-reference/functions/cookies
- NestJS Authentication: https://docs.nestjs.com/security/authentication
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Forgot Password Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
