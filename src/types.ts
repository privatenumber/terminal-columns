export type Row = string[];

export type ColumnWidth = number | 'content-width' | 'auto' | string;

type Alignment = 'left' | 'right';

export type ColumnMeta<Width = ColumnWidth> = {
	width?: Width;
	align?: Alignment;
	paddingRight?: number;
	paddingLeft?: number;
	paddingTop?: number;
	paddingBottom?: number;
	preprocess?: (cellValue: string) => string;
	postprocess?: (line: string, lineNumber: number) => string;
};

export type InternalColumnMeta<Width = ColumnWidth> = {
	// Options
	width: Width;
	align: Alignment;
	paddingRight: number;
	paddingLeft: number;
	paddingTop: number;
	paddingBottom: number;
	preprocess?: ((cellValue: string) => string);
	postprocess?: ((line: string, lineNumber: number) => string);

	// Internal meta data
	autoOverflow?: number;
	contentWidth: number;
	paddingLeftString: string;
	paddingRightString: string;
	horizontalPadding: number;
};

export type ColumnMetasArray = (ColumnWidth | ColumnMeta)[];

export type Options = ColumnMetasArray | {
	columns?: ColumnMetasArray;
	stdoutColumns?: number;
};

export type OptionsFunction = (stdoutColumns: number) => Options | undefined;
