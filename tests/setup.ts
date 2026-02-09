import { setupServer } from 'msw/node';

// Create base server (handlers added per test)
export const server = setupServer();

// Setup/teardown
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());