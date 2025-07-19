import type { worker } from '../../../alchemy.run';

// Infer the types from alchemy.run.ts
type CloudflareEnv = typeof worker.Env;
import {
  ConsoleProvider,
  type EmailProvider,
  MailhogProvider,
  ResendProvider,
  SMTPProvider,
} from './providers';

// Type declaration for WorkerMailer to avoid import errors in Node.js
type WorkerMailer = {
  send: (options: {
    from: { email: string; name?: string };
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) => Promise<void>;
};

let emailProvider: EmailProvider | null = null;
let workerMailerInstance: WorkerMailer | null = null;

// Helper to dynamically import and get WorkerMailer instance (memoized)
async function getMailer(env: CloudflareEnv): Promise<WorkerMailer> {
  if (workerMailerInstance) {
    return workerMailerInstance;
  }

  if (!env.SMTP_HOST) {
    throw new Error('SMTP_HOST is required for worker-mailer provider');
  }

  // Dynamically import worker-mailer only when needed (in Cloudflare environment)
  // Use string concatenation to avoid Vite's static analysis
  const workerMailerModule = 'worker-mailer';
  const { WorkerMailer } = await import(workerMailerModule);

  workerMailerInstance = await WorkerMailer.connect({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || '587'),
    secure: env.SMTP_PORT === '465', // Use secure connection for port 465
    credentials: env.SMTP_USER
      ? {
          username: env.SMTP_USER,
          password: env.SMTP_PASS || '',
        }
      : undefined,
  });

  return workerMailerInstance;
}

export function getEmailProvider(): EmailProvider {
  if (emailProvider) {
    return emailProvider;
  }

  const provider = process.env.EMAIL_PROVIDER || 'console';

  switch (provider) {
    case 'resend':
      if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is required for Resend provider');
      }
      emailProvider = new ResendProvider(process.env.RESEND_API_KEY);
      break;

    case 'smtp':
      if (!process.env.SMTP_HOST) {
        throw new Error('SMTP_HOST is required for SMTP provider');
      }
      emailProvider = new SMTPProvider({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS || '',
            }
          : undefined,
      });
      break;

    case 'mailhog':
      emailProvider = new MailhogProvider(
        process.env.MAILHOG_HOST || 'localhost',
        Number.parseInt(process.env.MAILHOG_PORT || '1025')
      );
      break;

    default:
      emailProvider = new ConsoleProvider();
      break;
  }

  /* eslint-disable no-console */
  console.log(`Email provider initialized: ${provider}`);
  return emailProvider;
}

export async function sendEmail(params: {
  from?: string;
  to: string;
  subject: string;
  html: string;
  env?: CloudflareEnv;
}) {
  const { env, ...emailParams } = params;

  // Use worker-mailer if configured and env is provided
  if (env && env.EMAIL_PROVIDER === 'worker-mailer') {
    try {
      const mailer = await getMailer(env);
      const from = emailParams.from || env.EMAIL_FROM || 'noreply@localhost';

      await mailer.send({
        from: {
          email: from,
          name: from.includes('@') ? from.split('@')[0] : 'No Reply',
        },
        to: emailParams.to,
        subject: emailParams.subject,
        html: emailParams.html,
      });

      return;
    } catch (error) {
      console.error('Failed to send email with worker-mailer:', error);
      throw error;
    }
  }

  // Fall back to existing providers for local development
  const provider = getEmailProvider();
  const from = emailParams.from || process.env.EMAIL_FROM || 'noreply@localhost';

  await provider.sendEmail({
    ...emailParams,
    from,
  });
}
