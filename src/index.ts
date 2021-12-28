import type {
	Row,
	Options,
	OptionsFunction,
} from './types';
import { getOptions } from './utils/get-options';
import { getColumnContentWidths } from './utils/get-column-content-widths';
import { computeColumnWidths } from './utils/compute-column-widths';
import { renderRow } from './utils/render-row';

export default function terminalColumns(
	tableData: Row[],
	options?: Options | OptionsFunction,
) {
	if (!tableData || tableData.length === 0) {
		return '';
	}

	const columnContentWidths = getColumnContentWidths(tableData);
	const columnCount = columnContentWidths.length;
	if (columnCount === 0) {
		return '';
	}

	const { stdoutColumns, columns } = getOptions(options);

	if (columns.length > columnCount) {
		throw new Error(`${columns.length} columns defined, but only ${columnCount} columns found`);
	}

	const computedColumns = computeColumnWidths(
		stdoutColumns,
		columns,
		columnContentWidths,
	);

	return tableData
		.map(
			row => renderRow(
				computedColumns,
				row,
			),
		)
		.join('\n');
}
