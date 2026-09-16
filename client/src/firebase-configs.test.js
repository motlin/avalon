import {describe, expect, it} from 'vitest';
import {DEFAULT_FIREBASE_PROJECT, FIREBASE_CONFIGS, selectFirebaseConfig} from './firebase-configs.js';

describe('selectFirebaseConfig', () => {
  it('returns the avalon-cool config that production is actually built with', () => {
    expect(selectFirebaseConfig('avalon-cool')).toEqual({
      apiKey: 'AIzaSyARX8d_fjzy7_wd4JUdFuOyxA9EwTICodc',
      authDomain: 'avalon-cool.firebaseapp.com',
      projectId: 'avalon-cool',
      storageBucket: 'avalon-cool.firebasestorage.app',
      messagingSenderId: '266781145190',
      appId: '1:266781145190:web:2e53b3df46819d5ec2d5a7',
    });
  });

  it('returns the upstream georgyo-avalon config when asked for it', () => {
    expect(selectFirebaseConfig('georgyo-avalon').projectId).toBe('georgyo-avalon');
  });

  it('defaults to avalon-cool so an unset variable cannot repoint production', () => {
    expect(DEFAULT_FIREBASE_PROJECT).toBe('avalon-cool');
    expect(selectFirebaseConfig(undefined).projectId).toBe('avalon-cool');
    expect(selectFirebaseConfig('').projectId).toBe('avalon-cool');
  });

  it('refuses an unknown project instead of falling back silently', () => {
    expect(() => selectFirebaseConfig('avalon-kool')).toThrow(/avalon-kool/);
    expect(() => selectFirebaseConfig('avalon-kool')).toThrow(/avalon-cool, georgyo-avalon/);
  });

  it('keys every config by its own projectId', () => {
    for (const [key, config] of Object.entries(FIREBASE_CONFIGS)) {
      expect(config.projectId).toBe(key);
    }
  });

  it('carries no databaseURL, since the app uses Firestore and not Realtime Database', () => {
    for (const config of Object.values(FIREBASE_CONFIGS)) {
      expect(config).not.toHaveProperty('databaseURL');
    }
  });
});
