import type { IncomingRequestCfProperties } from '@cloudflare/workers-types';
import type { KVNamespace } from '@cloudflare/workers-types';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { reactStartCookies } from 'better-auth/react-start';
import { magicLink } from 'better-auth/plugins';
import { getAuthDb } from '~/db/db-config';
import { sendEmail } from './email';
import type { CloudflareEnv } from '../../types/env';

/**
 * Main authentication configuration for Cloudflare Workers.
 * This combines BetterAuth with Cloudflare-specific integrations.
 */
function createAuth(env?: CloudflareEnv, cf?: IncomingRequestCfProperties) {
  // Get the Drizzle database instance
  const db = env ? getAuthDb(env) : ({} as any);

  const isProd = env?.NODE_ENV === 'production';
  const isEmailVerificationEnabled = env?.ENABLE_EMAIL_VERIFICATION === 'true';

  // Helper for sending emails
  const sendEmailWithEnv = async (options: Parameters<typeof sendEmail>[0]) => {
    await sendEmail(options);
  };

  // Create the BetterAuth configuration with Cloudflare support
  const authConfig = betterAuth({
    // Database configuration using Drizzle adapter
    ...(env && {
      database: drizzleAdapter(db, {
        provider: 'sqlite', // D1 is SQLite-based
        usePlural: true,
      }),
    }),

    // Email and password authentication
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: isEmailVerificationEnabled,
      sendResetPassword: async ({ user, url }) => {
        await sendEmailWithEnv({
          to: user.email,
          subject: 'Reset your password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Reset Your Password</h2>
              <p>You requested to reset your password. Click the button below to continue:</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a>
              <p style="margin-top: 20px; color: #666;">Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${url}</p>
              <p style="margin-top: 30px; color: #999; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });
      },
    },

    // Email verification configuration
    emailVerification: {
      sendOnSignUp: isEmailVerificationEnabled,
      autoSignInAfterVerification: true,
      sendVerificationEmail: isEmailVerificationEnabled
        ? async ({ user, url }) => {
            await sendEmailWithEnv({
              to: user.email as string,
              subject: 'Verify your email address',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2>Verify your email address</h2>
                  <p>Please click the button below to verify your email address:</p>
                  <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">Verify Email</a>
                  <p style="margin-top: 20px; color: #666;">Or copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; color: #666;">${url}</p>
                  <p style="margin-top: 30px; color: #999; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
                </div>
              `,
            });
          }
        : undefined,
    },

    // Social provider configuration
    socialProviders: {
      ...(env?.GITHUB_CLIENT_ID &&
        env?.GITHUB_CLIENT_SECRET && {
          github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET as string,
          },
        }),
      ...(env?.GOOGLE_CLIENT_ID &&
        env?.GOOGLE_CLIENT_SECRET && {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
          },
        }),
    },

    // Plugins
    plugins: [
      reactStartCookies(),
      magicLink({
        async sendMagicLink({ email, url }) {
          await sendEmailWithEnv({
            to: email,
            subject: 'Sign in to Constructa',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Sign in to Constructa</h2>
                <p>Click the button below to sign in. This link will expire in 5 minutes.</p>
                <a href="${url}" style="display:inline-block;padding:12px 24px;background-color:#4F46E5;color:white;text-decoration:none;border-radius:6px;">Sign In</a>
                <p style="margin-top:20px;color:#666;">If the button above does not work, copy and paste the following link into your browser:</p>
                <p style="word-break:break-all;color:#666;">${url}</p>
                <p style="margin-top:30px;color:#999;font-size:14px;">If you did not request this email, you can safely ignore it.</p>
              </div>
            `,
          });
        },
      }),
    ],

    // Rate limiting
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
    },
  });

  return authConfig;
}

// Export only the createAuth function - no static instance
export { createAuth };

// Helper function to get session from request
export async function getSession(request: Request, env: CloudflareEnv) {
  const authInstance = createAuth(env);
  const session = await authInstance.api.getSession({ headers: request.headers });
  return session;
}
