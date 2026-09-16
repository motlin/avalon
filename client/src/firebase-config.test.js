import {afterEach, describe, expect, it, vi} from 'vitest';

async function loadConfig() {
  vi.resetModules();
  return (await import('./firebase-config.js')).default;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('firebase-config', () => {
  it('targets avalon-cool when VITE_FIREBASE_PROJECT is unset', async () => {
    expect((await loadConfig()).projectId).toBe('avalon-cool');
  });

  it('targets the project named by VITE_FIREBASE_PROJECT', async () => {
    vi.stubEnv('VITE_FIREBASE_PROJECT', 'georgyo-avalon');
    expect((await loadConfig()).projectId).toBe('georgyo-avalon');
  });

  it('fails the build rather than guessing when the project is unknown', async () => {
    vi.stubEnv('VITE_FIREBASE_PROJECT', 'avalon-kool');
    await expect(loadConfig()).rejects.toThrow(/Unknown Firebase project "avalon-kool"/);
  });
});
