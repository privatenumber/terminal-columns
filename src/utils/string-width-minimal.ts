/**
 * Minimal string-width implementation
 * - Strips ANSI codes and counts visible characters
 * - Simplified Unicode handling (no full-width emoji support)
 */

// eslint-disable-next-line no-control-regex -- ANSI escape codes are intentional
const ansiRegex = /\u001B\[[0-9;]*m/g;

export const stringWidth = (string_: string): number => {
	if (!string_ || string_.length === 0) {
		return 0;
	}

	// Strip ANSI escape codes
	const stripped = string_.replaceAll(ansiRegex, '');

	// For now, just return length
	// This loses emoji/full-width char support but covers 99% of cases
	// and saves ~25KB of Unicode tables
	return stripped.length;
};
