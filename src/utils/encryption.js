/**
 * Smart Caesar cipher encryption/decryption for appraisal comment fields.
 * Prepends '[ENC]' so we can distinguish encrypted strings from plain text.
 */

const DEFAULT_SHIFT = 3;
const PREFIX = '[ENC]';

/**
 * Encrypt a plaintext string.
 * @param {string} text  - The raw text.
 * @param {number} shift - Number of character positions to shift (default 3).
 * @returns {string} Encrypted string prefixed with [ENC].
 */
export function encrypt(text, shift = DEFAULT_SHIFT) {
    if (!text || typeof text !== 'string') return text;
    // Don't double encrypt
    if (text.startsWith(PREFIX)) return text;
    
    const cipher = text
        .split('')
        .map(ch => String.fromCharCode(ch.charCodeAt(0) + shift))
        .join('');
        
    return PREFIX + cipher;
}

/**
 * Decrypt a ciphertext string back to its original form safely.
 * @param {string} text  - The encrypted text retrieved from the database.
 * @param {number} shift - Same shift value used during encryption (default 3).
 * @returns {string} Original plaintext.
 */
export function decrypt(text, shift = DEFAULT_SHIFT) {
    if (!text || typeof text !== 'string') return text;
    // If it doesn't have the prefix, it's plain text (not encrypted), so return as is!
    if (!text.startsWith(PREFIX)) return text;
    
    const cipher = text.slice(PREFIX.length);
    return cipher
        .split('')
        .map(ch => String.fromCharCode(ch.charCodeAt(0) - shift))
        .join('');
}
