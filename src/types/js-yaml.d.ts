// Minimal ambient declaration for js-yaml (pulled in transitively).
// Only the subset the build-time resolver script uses.
declare module 'js-yaml' {
  export function load(str: string, options?: Record<string, unknown>): unknown;
  export function dump(obj: unknown, options?: Record<string, unknown>): string;
  const _default: { load: typeof load; dump: typeof dump };
  export default _default;
}
