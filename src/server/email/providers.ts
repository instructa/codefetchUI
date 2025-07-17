// Remove nodemailer - not compatible with Cloudflare Workers
import { Resend } from 'resend';

export interface EmailProvider {
  sendEmail(params: { from: string; to: string; subject: string; html: string }): Promise<void>;
}

export class ResendProvider implements EmailProvider {
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async sendEmail({
    from,
    to,
    subject,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }) {
    await this.resend.emails.send({
      from,
      to,
      subject,
      html,
    });
  }
}

export class SMTPProvider implements EmailProvider {
  private config: {
    host: string;
    port: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  };

  constructor(config: {
    host: string;
    port: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  }) {
    this.config = config;
  }

  async sendEmail({
    from,
    to,
    subject,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }) {
    // In Cloudflare Workers, we need to use an HTTP-based SMTP service
    // or fall back to console logging
    console.warn('SMTP Provider: Direct SMTP not supported in Cloudflare Workers. Email not sent.');
    console.log('Would send email:', { from, to, subject });
    // You could implement HTTP-based SMTP relay here if needed
  }
}

export class ConsoleProvider implements EmailProvider {
  async sendEmail({
    from,
    to,
    subject,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }) {
    /* eslint-disable no-console */
    console.log('=== EMAIL (Console Provider) ===');
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    // Do NOT print the full HTML; it may contain one‑time tokens.
    console.log('HTML: [redacted for security]');
    console.log('================================');
  }
}

export class MailhogProvider implements EmailProvider {
  private host: string;
  private port: number;

  constructor(host = 'localhost', port = 1025) {
    this.host = host;
    this.port = port;
  }

  async sendEmail({
    from,
    to,
    subject,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }) {
    // Use HTTP API for Mailhog instead of SMTP
    try {
      const response = await fetch(`http://${this.host}:${this.port}/api/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: { email: from },
          to: [{ email: to }],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        throw new Error(`Mailhog API error: ${response.status}`);
      }

      console.log(`Email sent to Mailhog: ${to}`);
    } catch (error) {
      console.error('Failed to send email via Mailhog:', error);
      // Fall back to console logging
      console.log('Email would be sent:', { from, to, subject });
    }
  }
}
