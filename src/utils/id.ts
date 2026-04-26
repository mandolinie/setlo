/**
 * Generates a UUID v4.
 * crypto.randomUUID() requires a secure context (HTTPS / localhost).
 * This falls back to Math.random for HTTP on a local network (e.g. mobile testing).
 */
export function generateId(): string {
  if (typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16)
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
}
