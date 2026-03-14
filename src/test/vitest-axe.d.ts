import type { AxeMatchers } from 'vitest-axe';

declare module '@vitest/expect' {
  interface Assertion<T> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
