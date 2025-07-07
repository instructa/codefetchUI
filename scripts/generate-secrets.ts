#!/usr/bin/env bun
import crypto from 'crypto';

// Generate secure random secrets
const generateSecret = (length = 32) => {
  return crypto.randomBytes(length).toString('base64');
};

console.log('🔐 Generating secure secrets for your .env file:\n');

console.log('# Alchemy password (for encrypting secrets)');
console.log(`ALCHEMY_PASSWORD="${generateSecret(24)}"`);
console.log();

console.log('# Better Auth secret (for signing sessions)');
console.log(`BETTER_AUTH_SECRET="${generateSecret(32)}"`);
console.log();

console.log('# Example database URL (update with your actual database)');
console.log(`DATABASE_URL="postgresql://user:password@host:5432/database"`);
console.log();

console.log('\n📋 Copy these values to your .env file and update as needed.');
console.log('⚠️  Keep these secrets secure and never commit them to git!');
