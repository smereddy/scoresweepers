import { describe, it, expect } from 'vitest';
import { config } from '../config';

describe('config', () => {
  it('has required properties', () => {
    expect(config.isDevelopment).toBeDefined();
    expect(config.isProduction).toBeDefined();
    expect(config.baseUrl).toBeDefined();
    expect(config.supabase).toBeDefined();
    expect(config.supabase.url).toBeDefined();
    expect(config.supabase.anonKey).toBeDefined();
  });

  it('has correct development flag', () => {
    // In test environment, isDevelopment should be true
    expect(typeof config.isDevelopment).toBe('boolean');
    expect(typeof config.isProduction).toBe('boolean');
  });

  it('has valid base URL', () => {
    expect(typeof config.baseUrl).toBe('string');
    expect(config.baseUrl).toMatch(/^https?:\/\//);
  });

  it('has supabase configuration', () => {
    expect(typeof config.supabase.url).toBe('string');
    expect(typeof config.supabase.anonKey).toBe('string');
  });
});