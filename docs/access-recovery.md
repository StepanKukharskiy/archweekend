# Participant access recovery

The recovery login gives allowlisted participants access to `/course` and `/ai-sandbox` without PocketBase. The private email list and shared password are supplied at runtime, never committed or sent to the browser. Sessions use signed, HTTP-only cookies and expire after seven days. Email matching trims whitespace and ignores case.

## Railway setup

1. Use a persistent Railway volume mounted at `/data` on the `archweekend` service. Keep one service replica. Enable volume backups.
2. Add these service variables from the private local `.env.recovery` file:
   - `RECOVERY_ACCESS_ENABLED=true`
   - `RECOVERY_ALLOWED_EMAILS`: comma-separated participant list
   - `RECOVERY_PASSWORD`: the agreed participant password
   - `RECOVERY_SESSION_SECRET`: a random secret of at least 32 characters
   - `RECOVERY_SANDBOX_CREDITS=100`
   - `RECOVERY_CREDITS_DIR=/data/sandbox-credits`
3. Keep the existing `TOGETHER_API_KEY` and set `ORIGIN=https://archweekend.pro` for same-origin POST checks. Set adapter-node `ADDRESS_HEADER` only to a header overwritten by your trusted proxy; never trust a client-provided IP header. The login limiter allows ten failed attempts per address per fifteen minutes and is per-process.
4. Deploy the recovery branch after review. No `DB_URL` or Together API key is required at build time. Together credentials are still required at runtime for actual generation.

The `.env.recovery` file is private, Git-ignored, and not automatically loaded in production. Do not upload it to GitHub or paste it into a PR. Add its settings to Railway's private variables instead.

## Credits and reporting

Every approved participant receives 100 total credits, not a daily allowance. Text costs 1, images cost 5. Usage is stored in one JSON file per normalized email, using an email hash as the filename. Re-login and redeployment do not replenish credits while the volume is retained. Users see the remaining balance in the sandbox.

Credits are reserved before contacting Together. Provider failures refund the reservation. Filesystem locks and atomic replacement prevent parallel requests from overspending. Missing storage configuration, corrupt files, and lock contention fail closed. A process crash during a paid request can leave that reservation charged; inspect it before manually adjusting. A crash while writing the very short ledger transaction may leave a `.lock` directory: confirm no writer is active before removing that stale lock. A missing/deleted volume cannot recover balances; backups are still necessary.

To export a private CSV from a shell **inside the running service**, where its environment and volume are available:

```sh
node scripts/recovery-credit-report.mjs > /tmp/participant-credits.csv
```

Columns: email, credits allocated, credits used, credits remaining. Keep this report private. Updating the allowlist adds/removes access; removing an email also invalidates its session on its next request. Retaining its ledger preserves usage if re-added. Changing `RECOVERY_SANDBOX_CREDITS` changes the total allocation for every participant. Rotating the session secret or password invalidates sessions without resetting credit usage.

## Limits of temporary access

The shared password checks membership but does not verify email ownership. A person who knows another participant's email and the password can use that account's allowance. The course page and data responses require authentication; the existing third-party video URLs themselves are not converted to signed/private streaming URLs by this change.

## Validation

```sh
node --test tests/*.test.js
npm run build
node tests/recovery-http.mjs
```

The HTTP integration test uses synthetic participants and a mocked provider, makes no paid requests, and checks protected pages/data, login/logout, rejected credentials, cookie tampering/expiry, rate limiting, sandbox generation, charges/refunds, and concurrent budget exhaustion.
