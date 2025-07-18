import { useRef } from 'react';

interface UseCaptchaResult {
  captchaRef: React.RefObject<HTMLDivElement>;
  getCaptchaHeaders: (action?: string) => Promise<Record<string, string>>;
}

/**
 * Minimal no-op replacement for Better Auth's useCaptcha hook.
 * Returns an empty ref and no-op header builder so the codebase
 * can compile without the upstream dependency.
 */
export function useCaptcha(): UseCaptchaResult {
  const captchaRef = useRef<HTMLDivElement>(null);

  const getCaptchaHeaders = async (): Promise<Record<string, string>> => ({
    // Turnstile / hCaptcha headers would go here
  });

  return { captchaRef, getCaptchaHeaders };
}