import type { Options } from './types';

const allowedOperators = ['<', '>', '=', '>=', '<='] as const;

type Operator = typeof allowedOperators[number];

const assertOperator = (operator: string): asserts operator is Operator => {
	if (!allowedOperators.includes(operator as Operator)) {
		throw new TypeError(`Invalid breakpoint operator: ${operator}`);
	}
};

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
export const breakpoints = (
	breakpointsMap: Record<string, Options>,
) => {
	const bp = Object.keys(breakpointsMap).map((key) => {
		const [operator, breakpointString] = key.split(' ');
		assertOperator(operator);

		const breakpoint = Number.parseInt(breakpointString, 10);

		if (Number.isNaN(breakpoint)) {
			throw new TypeError(`Invalid breakpoint value: ${breakpointString}`);
		}

		const value = breakpointsMap[key];
		return {
			operator,
			breakpoint,
			value,
		};
	}).sort(
		(a, b) => b.breakpoint - a.breakpoint,
	);

	return (stdoutColumns: number) => bp.find(({ operator, breakpoint }) => (
		(
			operator === '='
			&& stdoutColumns === breakpoint
		)
		|| (
			operator === '>'
			&& stdoutColumns > breakpoint
		)
		|| (
			operator === '<'
			&& stdoutColumns < breakpoint
		)
		|| (
			operator === '>='
			&& stdoutColumns >= breakpoint
		)
		|| (
			operator === '<='
			&& stdoutColumns <= breakpoint
		)
	))?.value;
};
