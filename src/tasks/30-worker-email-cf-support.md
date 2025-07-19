# Plan: Integrate `worker-mailer` for Cloudflare-Native Email

## 1. Overview

The current email implementation relies on providers that may not be optimal or fully compatible with the Cloudflare Workers environment, particularly concerning TCP socket connections for SMTP. This plan details the migration to `worker-mailer`, a library purpose-built for sending emails from Cloudflare Workers, ensuring robust and reliable email delivery for critical authentication flows like magic links and password resets.

## 2. Rationale

Based on the recommendation for outbound-only email from a Cloudflare Worker, `worker-mailer` is the ideal choice. It's a lightweight library that works with standard SMTP providers and integrates cleanly into our existing TypeScript codebase. This avoids the overhead of more complex solutions like Cloudflare Email Kit, which is better suited for inbound email processing.

## 3. Implementation Plan

### Step 3.1: Add Dependency

We'll begin by adding the necessary package to our project.

**Action:**
- Execute the following command in your terminal:
  ```bash
  pnpm add worker-mailer@latest
  ```

### Step 3.2: Refactor Email Service for Async Initialization

`worker-mailer` requires an asynchronous `connect` method to initialize. Our current email service architecture is synchronous. We will refactor `src/server/email/index.ts` to manage this async initialization and create a memoized mailer instance to reuse connections within a worker instance.

**File to Modify:** `src/server/email/index.ts`

**Actions:**
1.  Import `WorkerMailer` and the `CloudflareEnv` type.
2.  Create a private, module-scoped variable to hold the memoized `mailer` instance.
3.  Implement a `getMailer` function that initializes `WorkerMailer` on its first call and returns the cached instance on subsequent calls.
4.  Update the `sendEmail` function to take an `env` object. It will check if `EMAIL_PROVIDER` is set to `worker-mailer` and use the new `getMailer` flow. Otherwise, it will fall back to the existing `getEmailProvider` logic for other environments (like local development).
5.  Ensure the `from` address is correctly handled, using a default from the environment variables if not provided.

### Step 3.3: Update Authentication Server

The main `betterAuth` configuration needs to be updated to pass the environment context to our refactored `sendEmail` function.

**File to Modify:** `src/server/auth.server.ts`

**Actions:**
1.  Locate the `sendEmailWithEnv` helper function inside `createAuth`.
2.  Modify its implementation to pass the `env` object to `sendEmail`. This is the crucial step that provides the necessary context for our email service to access SMTP credentials.

### Step 3.4: Configure Environment Variables

The new provider needs credentials. We'll add them to our environment configuration.

**Action:**
- Update your `.env.example` file with the following variables. These must also be configured in the Cloudflare dashboard for any deployed environments (staging, production).

```dotenv
# .env.example

# ... existing variables

# --- Email Configuration ---
# Set to "worker-mailer" to use the new provider on Cloudflare
EMAIL_PROVIDER="console"
# Default "from" address for emails
EMAIL_FROM="no-reply@your-domain.com"

# --- SMTP Credentials for worker-mailer ---
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
```

## 4. Testing and Verification Strategy

### Local Development
- For local testing, keep `EMAIL_PROVIDER` set to `console` or `mailhog` in your `.env` file. The refactored `sendEmail` function will fall back to the old providers, so your local workflow remains unchanged.

### Deployed Environment (Staging/Production)
1.  **Configure Variables:** Ensure all `EMAIL_PROVIDER` and `SMTP_*` variables are correctly set in your Cloudflare environment's settings.
2.  **Deploy:** Deploy the application with the code changes.
3.  **Trigger Email:** Perform an action that sends an email, such as:
    - Signing up for a new account (if email verification is enabled).
    - Requesting a password reset for an existing account.
4.  **Verify Receipt:** Check the recipient's inbox to confirm the email was delivered successfully.
5.  **Check Logs:** Monitor the Cloudflare Worker logs for any potential errors reported by `worker-mailer`.

This plan ensures a seamless transition to a Cloudflare-native email solution while maintaining local development ergonomics. 