import crypto from "crypto";

/**
 * Generate a SHA-256 hash of a file buffer.
 */
export function hashFile(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Generate a random short code for credential verification URLs.
 * Format: 7-character alphanumeric string (e.g., "8FH2KS9")
 */
export function generateShortCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I, O, 0, 1 to avoid confusion
  let code = "";
  const bytes = crypto.randomBytes(7);
  for (let i = 0; i < 7; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

/**
 * Format a date for display.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Parse skills from JSON string (stored in SQLite as text).
 */
export function parseSkills(skills: string): string[] {
  try {
    return JSON.parse(skills);
  } catch {
    return [];
  }
}

/**
 * Truncate a hash for display.
 */
export function truncateHash(hash: string, chars: number = 8): string {
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

/**
 * Get CardanoScan URL for a transaction on preprod.
 */
export function getCardanoScanUrl(txHash: string): string {
  const network = process.env.NEXT_PUBLIC_CARDANO_NETWORK || "preprod";
  if (network === "mainnet") {
    return `https://cardanoscan.io/transaction/${txHash}`;
  }
  return `https://preprod.cardanoscan.io/transaction/${txHash}`;
}

/**
 * Get the verification URL for a credential.
 */
export function getVerificationUrl(shortCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/verify/${shortCode}`;
}
