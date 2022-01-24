declare type Row = string[];
declare type ColumnWidth = number | 'content-width' | 'auto' | string;
declare type Alignment = 'left' | 'right';
declare type ColumnMeta<Width = ColumnWidth> = {
    width?: Width;
    align?: Alignment;
    paddingRight?: number;
    paddingLeft?: number;
    paddingTop?: number;
    paddingBottom?: number;
    preprocess?: (cellValue: string) => string;
    postprocess?: (line: string, lineNumber: number) => string;
};
declare type ColumnMetasArray = (ColumnWidth | ColumnMeta)[];
declare type Options = ColumnMetasArray | {
    columns?: ColumnMetasArray;
    stdoutColumns?: number;
};
declare type OptionsFunction = (stdoutColumns: number) => Options | undefined;

declare function terminalColumns(tableData: Row[], options?: Options | OptionsFunction): string;

/**
 * Pass in a map of breakpoints where the key is the breakpoint (e.g. '>= 10')
 * and the value is the column widths.
 *
 * @example
 * ```ts
 * breakpoints({
 *   '> 80': [
 *     {
 *       width: 'content-width',
 *       paddingRight: 2
 *     },
 *     'auto'
 *   ],
 *   '> 40': [
 *     {
 *       width: 'auto',
 *       paddingRight: 2
 *     },
 *     {
 *       width: '100%',
 *       paddingBottom: 1
 *     }
 * 	 ],
 *   '> 0': {
 *     // Remove responsiveness
 *     stdoutColumns: 1000,
 *
 *     columns: [
 *       'content-width',
 *       'content-width'
 *     ]
 *   }
 * })
 * ```
 */
declare function breakpoints(breakpointsMap: Record<string, Options>): (stdoutColumns: number) => Options | undefined;

export { Options, breakpoints, terminalColumns as default };
