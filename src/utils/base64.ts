
// ===============================
// Base64 Encoding / Decoding
// ===============================

// Encode UTF-8 string to Base64
export function encodeBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
}

// Decode Base64 to UTF-8 string
export function decodeBase64(base64: string): string {
  return decodeURIComponent(escape(atob(base64)))
}
