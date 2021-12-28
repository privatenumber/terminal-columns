import type {
	Options,
	OptionsFunction,
	ColumnMetasArray,
} from '../types';

type InternalOptions = {
	columns: ColumnMetasArray;
	stdoutColumns: number;
};

export const getOptions = (
	options?: Options | OptionsFunction,
): InternalOptions => {
	const stdoutColumns = process.stdout.columns ?? Number.POSITIVE_INFINITY;

	if (!options) {
		return {
			columns: [],
			stdoutColumns,
		};
	}

	if (typeof options === 'function') {
		options = options(stdoutColumns);
	}

	if (Array.isArray(options)) {
		return {
			columns: options,
			stdoutColumns,
		};
	}

	if (!('columns' in options)) {
		throw new Error('Invalid options');
	}

	return {
		columns: options.columns,
		stdoutColumns: options.stdoutColumns ?? stdoutColumns,
	};
};
