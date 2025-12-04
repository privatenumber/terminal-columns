/**
 * Minimal wrap-ansi implementation
 * - Hard wraps text at specified width
 * - Preserves ANSI codes
 * - Optimized for terminal-columns use case (always hard: true)
 */

const ansiRegex = /\x1B\[[0-9;]*m/g;

// Strip ANSI codes from string
const stripAnsi = (str: string): string => str.replace(ansiRegex, '');

// Extract ANSI codes from a string
const extractAnsiCodes = (str: string): Array<{code: string; index: number}> => {
	const codes: Array<{code: string; index: number}> = [];
	let match;
	ansiRegex.lastIndex = 0;
	while ((match = ansiRegex.exec(str)) !== null) {
		codes.push({ code: match[0], index: match.index });
	}
	return codes;
};

export const wrapAnsi = (str: string, width: number, _options?: { hard?: boolean }): string => {
	if (!str || width <= 0) {
		return str || '';
	}

	const lines: string[] = [];
	const inputLines = str.split('\n');

	for (const line of inputLines) {
		// Empty lines are kept as-is
		if (line.length === 0) {
			lines.push('');
			continue;
		}

		const visualWidth = stripAnsi(line).length;

		// Line fits within width, keep as-is
		if (visualWidth <= width) {
			lines.push(line);
			continue;
		}

		// Extract all ANSI codes and their positions
		const ansiCodes = extractAnsiCodes(line);
		const plainText = stripAnsi(line);

		// Track which ANSI codes are currently active
		const openCodes: string[] = [];
		const closeCodes: string[] = [];

		// Categorize codes (simplified - just track all codes in order)
		for (const { code } of ansiCodes) {
			// Reset code (39 = default foreground, 49 = default background, 0 = reset all)
			if (code.includes('[39m') || code.includes('[49m') || code.includes('[0m')) {
				closeCodes.push(code);
			} else {
				openCodes.push(code);
			}
		}

		// Hard wrap - preserve exact spacing and cut at width
		let currentPos = 0;

		while (currentPos < plainText.length) {
			const chunkEnd = Math.min(currentPos + width, plainText.length);
			const chunk = plainText.substring(currentPos, chunkEnd);

			// For each line after the first, reapply open codes
			if (currentPos > 0 && openCodes.length > 0) {
				lines.push(openCodes.join('') + chunk);
			} else if (currentPos === 0) {
				// First chunk - include all original ANSI codes at the start
				const startCodes = ansiCodes
					.filter(a => a.index === 0)
					.map(a => a.code)
					.join('');
				lines.push(startCodes + chunk);
			} else {
				lines.push(chunk);
			}

			currentPos = chunkEnd;
		}

		// Add closing codes to the last line if they exist
		if (closeCodes.length > 0 && lines.length > 0) {
			lines[lines.length - 1] += closeCodes.join('');
		}
	}

	return lines.join('\n');
};

export default wrapAnsi;