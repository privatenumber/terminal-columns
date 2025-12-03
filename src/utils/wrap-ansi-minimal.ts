/**
 * Minimal wrap-ansi implementation
 * - Hard wraps text at specified width
 * - Preserves ANSI codes
 * - Optimized for terminal-columns use case (always hard: true)
 */

const ansiRegex = /\x1B\[[0-9;]*m/g;

// Strip ANSI codes from string
const stripAnsi = (str: string): string => str.replace(ansiRegex, '');

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

		// Hard wrap - preserve exact spacing and cut at width
		let remaining = line;

		while (stripAnsi(remaining).length > 0) {
			// Find where to cut (accounting for ANSI codes)
			let visualCount = 0;
			let actualCut = 0;

			for (let i = 0; i < remaining.length; i += 1) {
				if (remaining[i] === '\x1B') {
					// Skip ANSI code
					const endIndex = remaining.indexOf('m', i);
					if (endIndex !== -1) {
						actualCut = endIndex + 1;
						i = endIndex;
						continue;
					}
				}
				visualCount += 1;
				actualCut = i + 1;
				if (visualCount >= width) break;
			}

			const chunk = remaining.substring(0, actualCut);
			lines.push(chunk);

			remaining = remaining.substring(actualCut);
			if (stripAnsi(remaining).length === 0) break;
		}
	}

	return lines.join('\n');
};

export default wrapAnsi;