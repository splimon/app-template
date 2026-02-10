import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

export const testUser = {
  id: randomUUID(),
  email: 'testuser@example.com',
  username: 'testuser',
  password: 'TestPassword123!',
  system_role: 'user' as const,
  session_token: 'valid-session-token',
};

export const testAdmin = {
  id: randomUUID(),
  email: 'admin@example.com',
  username: 'adminuser',
  password: 'AdminPassword123!',
  system_role: 'sysadmin' as const,
};

export const testOrg = {
  id: randomUUID(),
  name: 'Test Org',
  slug: 'test-org'
};

export function createMockRequest(
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
  cookies: Record<string, string> = {}
): NextRequest {
  const defaultHeaders = {
    'content-type': 'application/json',
    'user-agent': 'jest-test-runner',
    'x-forwarded-for': '127.0.0.1',
    ...headers,
  };

  const mockHeaders = new Headers();
  Object.entries(defaultHeaders).forEach(([key, value]) => {
    mockHeaders.set(key, value);
  });

  // Mock cookies API
  const mockCookies = {
    get: (name: string) => {
      const value = cookies[name];
      return value ? { value, name } : undefined;
    },
    set: (name: string, value: string) => {
      cookies[name] = value;
    },
    delete: (name: string) => {
      delete cookies[name];
    },
    has: (name: string) => name in cookies,
    getAll: () => Object.entries(cookies).map(([name, value]) => ({ name, value })),
  };

  return {
    json: async () => body,
    headers: mockHeaders,
    cookies: mockCookies,
  } as NextRequest;
}