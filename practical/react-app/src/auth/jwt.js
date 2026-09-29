// Simulated auth server. Builds a real JWT-format token: header.payload.signature
// WARNING: the secret lives in browser code here only for learning purposes.
const SECRET = "demo-secret-change-me";
const TOKEN_LIFETIME_SECONDS = 60 * 60; // 1 hour

// Simulated user database
export const DEMO_USERS = [
  { userId: 1, username: "admin", password: "admin123", role: "admin" },
  { userId: 2, username: "user", password: "user123", role: "user" },
];

const enc = new TextEncoder();

function b64url(input) {
  const bytes = typeof input === "string" ? enc.encode(input) : new Uint8Array(input);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "="));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

async function sign(data) {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

// Token generation
export async function createToken({ userId, username, role }) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = { userId, username, role, iat: now, exp: now + TOKEN_LIFETIME_SECONDS };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  return `${unsigned}.${await sign(unsigned)}`;
}

// Read the payload without verifying (for display only)
export function decodeToken(token) {
  try {
    const [h, p] = token.split(".");
    return { header: JSON.parse(b64urlDecode(h)), payload: JSON.parse(b64urlDecode(p)) };
  } catch {
    return null;
  }
}

// Verify signature + expiry. Returns the payload, or null if invalid.
export async function verifyToken(token) {
  const parts = token?.split(".");
  if (!parts || parts.length !== 3) return null;
  const expected = await sign(`${parts[0]}.${parts[1]}`);
  if (expected !== parts[2]) return null; // tampered
  const decoded = decodeToken(token);
  if (!decoded || decoded.payload.exp < Math.floor(Date.now() / 1000)) return null; // expired
  return decoded.payload;
}
