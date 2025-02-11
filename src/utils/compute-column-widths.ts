import type {
	InternalColumnMeta,
	ColumnMetasArray,
	ColumnWidth,
} from '../types';

const isPercentPattern = /^\d+%$/;

const defaultColumnMetas: InternalColumnMeta = {
	width: 'auto',
	align: 'left',
	contentWidth: 0,
	paddingLeft: 0,
	paddingRight: 0,
	paddingTop: 0,
	paddingBottom: 0,
	horizontalPadding: 0,
	paddingLeftString: '',
	paddingRightString: '',
};

const initColumns = (
	columnContentWidths: number[],
	columnMetas: ColumnMetasArray,
) => {
	const columns: InternalColumnMeta[] = [];

	for (let i = 0; i < columnContentWidths.length; i += 1) {
		const columnWidth = columnMetas[i] ?? 'auto';

		if (
			typeof columnWidth === 'number'
			|| columnWidth === 'auto'
			|| columnWidth === 'content-width'
			|| (typeof columnWidth === 'string' && isPercentPattern.test(columnWidth))
		) {
			columns.push({
				...defaultColumnMetas,
				width: columnWidth as ColumnWidth,
				contentWidth: columnContentWidths[i],
			});
			continue;
		}

		if (
			columnWidth
			&& (typeof columnWidth === 'object')
		) {
			const column = {
				...defaultColumnMetas,
				...columnWidth,
				contentWidth: columnContentWidths[i],
			};
			column.horizontalPadding = column.paddingLeft + column.paddingRight;
			columns.push(column);
			continue;
		}

		throw new Error(`Invalid column width: ${JSON.stringify(columnWidth)}`);
	}

	return columns;
};

const resolveColumnWidths = <T extends ColumnWidth>(
	columnMetas: InternalColumnMeta<T>[],
	stdoutWidth: number,
): asserts columnMetas is InternalColumnMeta<Exclude<T, 'content-width' | 'auto' | string>>[] => {
	for (const column of columnMetas) {
		const { width } = column;

		// Convert 'content-width' to number
		if (width === 'content-width') {
			column.width = column.contentWidth as T;
		}

		// Convert 'auto' to number
		if (width === 'auto') {
			const recommendedWidth = Math.min(20, column.contentWidth);
			column.width = recommendedWidth as T;
			column.autoOverflow = column.contentWidth - recommendedWidth;
		}

		// Convert x% to number
		// Behaves like "vw" unit (viewport width)
		if (typeof width === 'string' && isPercentPattern.test(width)) {
			const columnWidthPercent = Number.parseFloat(width.slice(0, -1)) / 100;

			column.width = (
				Math.floor(stdoutWidth * columnWidthPercent)
				- (column.paddingLeft + column.paddingRight) as T
			);
		}

		// Reduce padding if exceeding screen width
		const { horizontalPadding } = column;
		const minimumContentWidth = 1;
		const mimiumWidth = minimumContentWidth + horizontalPadding;

		if (mimiumWidth >= stdoutWidth) {
			const exceedingBy = mimiumWidth - stdoutWidth;

			const paddingLeftReduction = Math.ceil(
				(column.paddingLeft / horizontalPadding) * exceedingBy,
			);
			const paddingRightReduction = exceedingBy - paddingLeftReduction;

			column.paddingLeft -= paddingLeftReduction;
			column.paddingRight -= paddingRightReduction;
			column.horizontalPadding = column.paddingLeft + column.paddingRight;
		}

		column.paddingLeftString = column.paddingLeft ? ' '.repeat(column.paddingLeft) : '';
		column.paddingRightString = column.paddingRight ? ' '.repeat(column.paddingRight) : '';

		// Wrap any exceeding widths to screen width
		const availableWidth = stdoutWidth - column.horizontalPadding;
		column.width = Math.max(
			Math.min(column.width as number, availableWidth), // Don't exceed screen width
			minimumContentWidth,
		) as T;
	}
};

const makeRow = () => Object.assign([] as InternalColumnMeta<number>[], { columns: 0 });

const balanceAuto = (
	columnMetas: InternalColumnMeta<number>[],
	stdoutWidth: number,
) => {
	// group columns by line span
	// (given the screen is 100px, how many stdout rows does this row span?)
	const rows = [makeRow()];
	let [currentRow] = rows;

	for (const column of columnMetas) {
		const outerWidth = column.width + column.horizontalPadding;

		// If it doesn't fit, make a new row
		if ((currentRow.columns + outerWidth) > stdoutWidth) {
			currentRow = makeRow();
			rows.push(currentRow);
		}

		currentRow.push(column);
		currentRow.columns += outerWidth;
	}

	for (const columns of rows) {
		const usedWidth = columns.reduce(
			(sum, column) => (
				sum
				+ (column.width as number)
				+ column.horizontalPadding
			),
			0,
		);

		let remainingWidth = stdoutWidth - usedWidth;

		if (remainingWidth === 0) {
			continue;
		}

		const autoColumns = columns.filter(column => 'autoOverflow' in column) as (InternalColumnMeta<number> & { autoOverflow: number })[];
		const widthOverflows = autoColumns.filter(column => column.autoOverflow > 0);

		const widthOverflowTotal = widthOverflows.reduce((sum, column) => sum + column.autoOverflow, 0);
		const overflowRestorationBudget = Math.min(widthOverflowTotal, remainingWidth);

		for (const column of widthOverflows) {
			const addBack = Math.floor(
				(column.autoOverflow / widthOverflowTotal) * overflowRestorationBudget,
			);
			column.width += addBack;
			remainingWidth -= addBack;
		}

		const addEachColumn = Math.floor(remainingWidth / autoColumns.length);

		for (let i = 0; i < autoColumns.length; i += 1) {
			const column = autoColumns[i];
			if (i === autoColumns.length - 1) {
				column.width += remainingWidth;
			} else {
				column.width += addEachColumn;
			}

			remainingWidth -= addEachColumn;
		}
	}

	return rows;
};

export const computeColumnWidths = (
	stdoutColumns: number,
	columnMetas: ColumnMetasArray,
	columnContentWidths: number[],
) => {
	const columnWidths = initColumns(
		columnContentWidths,
		columnMetas,
	);

	resolveColumnWidths(columnWidths, stdoutColumns);

	return balanceAuto(columnWidths, stdoutColumns);
};
