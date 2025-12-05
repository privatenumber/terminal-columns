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

	const startCodes = ansiCodes
		.filter(a => a.index === 0)
		.map(a => a.code)
		.join('');

	// Split into words
	const words = plainText.split(' ');
	let currentLine = '';
	let isFirstLine = true;

	for (let i = 0; i < words.length; i += 1) {
		const word = words[i];
		const addSpace = currentLine.length > 0;
		const potentialLine = currentLine + (addSpace ? ' ' : '') + word;

		if (potentialLine.length <= width) {
			// Word fits on current line
			currentLine = potentialLine;
		} else if (word.length > width) {
			// Word is longer than width, need to hard wrap it
			if (currentLine) {
				// Push current line first
				if (isFirstLine) {
					wrappedLines.push(startCodes + currentLine);
					isFirstLine = false;
				} else if (openCodes.length > 0) {
					wrappedLines.push(openCodes.join('') + currentLine);
				} else {
					wrappedLines.push(currentLine);
				}
			}

			// Hard wrap the long word
			let remainingWord = word;
			while (remainingWord.length > 0) {
				const chunk = remainingWord.slice(0, width);
				remainingWord = remainingWord.slice(width);

				if (isFirstLine) {
					wrappedLines.push(startCodes + chunk);
					isFirstLine = false;
				} else if (openCodes.length > 0) {
					wrappedLines.push(openCodes.join('') + chunk);
				} else {
					wrappedLines.push(chunk);
				}
			}
			currentLine = '';
		} else {
			// Start new line
			if (currentLine) {
				if (isFirstLine) {
					wrappedLines.push(startCodes + currentLine);
					isFirstLine = false;
				} else if (openCodes.length > 0) {
					wrappedLines.push(openCodes.join('') + currentLine);
				} else {
					wrappedLines.push(currentLine);
				}
			}
			currentLine = word;
		}
	}

	// Add remaining line
	if (currentLine) {
		if (isFirstLine) {
			wrappedLines.push(startCodes + currentLine);
		} else if (openCodes.length > 0) {
			wrappedLines.push(openCodes.join('') + currentLine);
		} else {
			wrappedLines.push(currentLine);
		}
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
