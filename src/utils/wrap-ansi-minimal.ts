/**
 * Minimal wrap-ansi implementation
 * - Hard wraps text at specified width
 * - Preserves ANSI codes
 * - Optimized for terminal-columns use case (always hard: true)
 */

// eslint-disable-next-line no-control-regex -- ANSI escape codes are intentional
const ansiRegex = /\u001B\[[0-9;]*m/g;

// Strip ANSI codes from string
const stripAnsi = (string_: string): string => string_.replace(ansiRegex, '');

// Extract ANSI codes from a string
const extractAnsiCodes = (string_: string): Array<{ code: string;
	index: number; }> => {
	const codes: Array<{ code: string;
		index: number; }> = [];
	ansiRegex.lastIndex = 0;

	let match = ansiRegex.exec(string_);
	while (match !== null) {
		codes.push({
			code: match[0],
			index: match.index,
		});
		match = ansiRegex.exec(string_);
	}
	return codes;
};

// Helper to wrap a single line that's too long
// eslint-disable-next-line complexity -- Necessary for proper ANSI code handling
const wrapLongLine = (line: string, width: number): string[] => {
	const wrappedLines: string[] = [];
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
		const chunk = plainText.slice(currentPos, chunkEnd);

		// For each line after the first, reapply open codes
		if (currentPos > 0 && openCodes.length > 0) {
			wrappedLines.push(openCodes.join('') + chunk);
		} else if (currentPos === 0) {
			// First chunk - include all original ANSI codes at the start
			const startCodes = ansiCodes
				.filter(a => a.index === 0)
				.map(a => a.code)
				.join('');
			wrappedLines.push(startCodes + chunk);
		} else {
			wrappedLines.push(chunk);
		}

		currentPos = chunkEnd;
	}

	// Add closing codes to the last line if they exist
	if (closeCodes.length > 0 && wrappedLines.length > 0) {
		wrappedLines[wrappedLines.length - 1] += closeCodes.join('');
	}

	return wrappedLines;
};

export const wrapAnsi = (string_: string, width: number, _options?: { hard?: boolean }): string => {
	if (!string_ || width <= 0) {
		return string_ || '';
	}

	const lines: string[] = [];
	const inputLines = string_.split('\n');

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

		// Line needs wrapping
		lines.push(...wrapLongLine(line, width));
	}

	return lines.join('\n');
};

export default wrapAnsi;
