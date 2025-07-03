// API Security Configuration
export const getApiSecurityConfig = () => {
  // Get additional allowed origins from environment
  // Note: Same-origin requests are always allowed automatically
  const additionalAllowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(origin => origin)
    : [];

  return {
    // These are additional origins beyond same-origin requests
    allowedOrigins: additionalAllowedOrigins,
    rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  };
};