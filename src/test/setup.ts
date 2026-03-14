// Dependencies: @testing-library/jest-dom, vitest-axe/extend-expect, vitest-axe/matchers — see DEPENDENCY_GUIDE.md
import '@testing-library/jest-dom';
import 'vitest-axe/extend-expect';
import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';
import { server } from './mocks/server';

// Register vitest-axe matchers (toHaveNoViolations)
expect.extend(matchers);

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

// Reset handlers between tests (so overrides don't leak)
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
