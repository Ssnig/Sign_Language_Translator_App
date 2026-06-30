/**
 * Generate a simple unique ID for local use.
 * Replace with uuid library if collision-resistance is needed.
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
