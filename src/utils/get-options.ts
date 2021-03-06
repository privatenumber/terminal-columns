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

	if (typeof options === 'function') {
		options = options(stdoutColumns);
	}

	if (!options) {
		options = {};
	}

	if (Array.isArray(options)) {
		return {
			columns: options,
			stdoutColumns,
		};
	}

	return {
		columns: options.columns ?? [],
		stdoutColumns: options.stdoutColumns ?? stdoutColumns,
	};
};
