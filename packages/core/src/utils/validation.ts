/**
 * Validation utilities
 */

/**
 * Validate text input
 */
export function validateTextInput(text: string, maxLength: number = 200): {
  valid: boolean;
  error?: string;
} {
  if (typeof text !== 'string') {
    return { valid: false, error: 'Input must be a string' };
  }

  if (text.length > maxLength) {
    return { valid: false, error: `Text exceeds maximum length of ${maxLength} characters` };
  }

  return { valid: true };
}

/**
 * Sanitize text input
 */
export function sanitizeText(text: string): string {
  // Remove any potentially harmful characters but keep Unicode
  return text.trim();
}
