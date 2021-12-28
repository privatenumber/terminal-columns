import type { Row } from '../types';
import { getLongestLineWidth } from './get-longest-line-width';

export const getColumnContentWidths = (
	tableData: Row[],
) => {
	const columnContentWidths: number[] = [];

	for (const row of tableData) {
		const { length: rowLength } = row;
		const addColumns = rowLength - columnContentWidths.length;
		for (let i = 0; i < addColumns; i += 1) {
			columnContentWidths.push(0);
		}

		// Get column content width based on all rows
		for (let i = 0; i < rowLength; i += 1) {
			const width = getLongestLineWidth(row[i]);
			if (width > columnContentWidths[i]) {
				columnContentWidths[i] = width;
			}
		}
	}

	return columnContentWidths;
};
