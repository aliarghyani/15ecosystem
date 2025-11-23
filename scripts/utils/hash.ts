import crypto from 'crypto'

/**
 * Calculate SHA-256 hash of transcript content
 * Normalizes content before hashing to ignore whitespace differences
 */
export function calculateTranscriptHash(content: string): string {
  // Normalize content before hashing
  const normalized = content
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\u200c/g, '') // Remove Persian ZWNJ (Zero Width Non-Joiner)
    .toLowerCase()
  
  return crypto
    .createHash('sha256')
    .update(normalized, 'utf8')
    .digest('hex')
}
