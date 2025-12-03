/**
 * Minimal string-width implementation
 * - Strips ANSI codes and counts visible characters
 * - Simplified Unicode handling (no full-width emoji support)
 */

const ansiRegex = /\x1B\[[0-9;]*m/g;

export const stringWidth = (str: string): number => {
	if (!str || str.length === 0) {
		return 0;
	}

	// Strip ANSI escape codes
	const stripped = str.replace(ansiRegex, '');

	// For now, just return length
	// This loses emoji/full-width char support but covers 99% of cases
	// and saves ~25KB of Unicode tables
	return stripped.length;
};

export default stringWidth;