export type Row = string[];

export type ColumnWidth = number | 'content-width' | 'auto' | string;

export type ColumnMeta<Width = ColumnWidth> ={
	width: Width;
	// TODO: align
	// align?: string;
	paddingRight?: number;
	paddingLeft?: number;
	paddingTop?: number;
	paddingBottom?: number;
};

export type InternalColumnMeta<Width = ColumnWidth> = {
	width: Width;
	autoOverflow?: number;
	contentWidth: number;
	paddingRight: number;
	paddingLeft: number;
	paddingTop: number;
	paddingBottom: number;
	paddingLeftString: string;
	paddingRightString: string;
	horizontalPadding: number;
};

export type ColumnMetasArray = (ColumnWidth | ColumnMeta)[];

export type Options = ColumnMetasArray | {
	columns: ColumnMetasArray;
	stdoutColumns?: number;
};

export type OptionsFunction = (stdoutColumns: number) => Options;
