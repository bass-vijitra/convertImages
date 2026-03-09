import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// Run cleanup after each test to clear jsdom
afterEach(() => {
  cleanup();
});

// Mock URL.createObjectURL and revokeObjectURL forcefully
beforeAll(() => {
  // @ts-ignore
  window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  // @ts-ignore
  window.URL.revokeObjectURL = vi.fn();
});
