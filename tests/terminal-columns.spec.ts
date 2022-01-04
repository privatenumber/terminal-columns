import { blue, bold, underline } from 'colorette';
/**
 * Dependencies are bundled in because they have a
 * higher Node.js requirement. Test compiled version
 * to verify it works with Node.js 12.
 */
import terminalColumns, { breakpoints } from '..';
// import terminalColumns, { breakpoints } from '../src';

const loremIpsumShort = 'Lorem ipsum dolor sit amet.';
const loremIpsumLong = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const loremIpsumNewLines = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc.
Nunc sed augue lacus viverra vitae congue eu consequat ac.
Sit amet porttitor eget dolor morbi non arcu.
`.trim();

beforeAll(() => {
	process.stdout.columns = 100;
});

describe('edge cases', () => {
	describe('error handling', () => {
		test('missing columns', () => {
			expect(
				() => terminalColumns(
					[['']],
					[100, 200],
				),
			).toThrow('2 columns defined, but only 1 columns found');
		});

		test('invalid column', () => {
			expect(
				() => terminalColumns(
					[['']],
					['100'],
				),
			).toThrow('Invalid column width: "100"');
		});
	});

	describe('empty table', () => {
		test('no table', () => {
			// @ts-expect-error test error
			const table = terminalColumns();
			expect(table).toBe('');
		});

		test('no rows', () => {
			const table = terminalColumns([]);
			expect(table).toBe('');
		});

		test('no columns', () => {
			const table = terminalColumns([[], []]);
			expect(table).toBe('');
		});
	});

	test('inconsistent rows', () => {
		const table = terminalColumns([
			['A'],
			['B', 'B'],
			['C', 'C', 'C'],
		]);

		expect(table).toMatchSnapshot();
	});

	test('colored text', () => {
		const table = terminalColumns([
			[blue('A'.repeat(2))],
			['B', bold('B'.repeat(3))],
			['C', 'C', underline('C'.repeat(4))],
		]);

		expect(table).toMatchSnapshot();
	});
});

describe('padding', () => {
	test('overflowing padding reduction - even', () => {
		const table = terminalColumns(
			[
				[
					loremIpsumShort,
				],
			],
			[
				{
					width: 1,
					paddingLeft: 200,
					paddingRight: 200,
				},
			],
		);

		expect(table).toMatchSnapshot();
	});

	test('overflowing padding reduction - uneven', () => {
		const table = terminalColumns(
			[
				[
					loremIpsumShort,
				],
			],
			[
				{
					width: 1,
					paddingLeft: 200,
					paddingRight: 100,
				},
			],
		);

		expect(table).toMatchSnapshot();
	});

	test('overflowing content with overflowing padding reduction - even', () => {
		const table = terminalColumns(
			[
				[
					loremIpsumLong,
				],
			],
			[
				{
					width: 'content-width',
					paddingLeft: 200,
					paddingRight: 200,
				},
			],
		);

		expect(table).toMatchSnapshot();
	});
});

describe('align', () => {
	test('align right', () => {
		const table = terminalColumns(
			[
				[
					loremIpsumNewLines,
				],
			],
			[
				{
					align: 'right',
				},
			],
		);

		expect(table).toMatchSnapshot();
	});
});

describe('static widths', () => {
	test('fixed width', () => {
		const table = terminalColumns(
			[
				[loremIpsumShort, loremIpsumLong],
			],
			[10, 20],
		);

		expect(table).toMatchSnapshot();
	});

	test('overflowing width', () => {
		const table = terminalColumns(
			[
				[loremIpsumShort, loremIpsumLong],
			],
			[124, 152],
		);

		expect(table).toMatchSnapshot();
	});

	test('overflowing rows', () => {
		const table = terminalColumns(
			[
				[loremIpsumShort, loremIpsumShort],
				[loremIpsumShort, loremIpsumShort],
			],
			[10, 100],
		);

		expect(table).toMatchSnapshot();
	});

	test('overflowing width with padding', () => {
		const table = terminalColumns(
			[
				[loremIpsumShort, loremIpsumLong],
			],
			[
				{
					width: 124,
					paddingLeft: 6,
				},
				{
					width: 152,
					paddingLeft: 3,
					paddingRight: 6,
				},
			],
		);

		expect(table).toMatchSnapshot();
	});
});

describe('percent widths', () => {
	test('50% 50%', () => {
		const table = terminalColumns(
			[
				[loremIpsumLong, loremIpsumLong],
			],
			[
				'50%',
				'50%',
			],
		);

		expect(table).toMatchSnapshot();
	});

	test('50% 50% with padding', () => {
		const table = terminalColumns(
			[
				[loremIpsumLong, loremIpsumLong],
			],
			[
				{
					width: '50%',
					paddingLeft: 6,
					paddingRight: 4,
				},
				{
					width: '50%',
					paddingLeft: 3,
					paddingRight: 9,
				},
			],
		);

		expect(table).toMatchSnapshot();
	});

	test('70% 30% with different content lengths', () => {
		const table = terminalColumns(
			[
				[loremIpsumLong, loremIpsumLong],
				[loremIpsumLong, loremIpsumShort],
			],
			['70%', '30%'],
		);

		expect(table).toMatchSnapshot();
	});

	test('100% 100% with padding', () => {
		const table = terminalColumns(
			[
				[loremIpsumLong, loremIpsumLong],
			],
			[
				{
					width: '100%',
					paddingLeft: 2,
					paddingRight: 2,
					paddingTop: 1,
				},
				{
					width: '100%',
					paddingLeft: 4,
					paddingRight: 4,
					paddingBottom: 1,
				},
			],
		);

		expect(table).toMatchSnapshot();
	});
});

describe('content-width', () => {
	test('content-width with fixed width', () => {
		const table = terminalColumns(
			[
				[loremIpsumLong, loremIpsumLong],
				[loremIpsumLong, loremIpsumShort],
			],
			['content-width', 40],
		);

		expect(table).toMatchSnapshot();
	});

	test('content-width with padding', () => {
		const table = terminalColumns(
			[
				[loremIpsumLong, loremIpsumLong],
			],
			[
				{
					width: 'content-width',
					paddingLeft: 2,
					paddingRight: 1,
				},
				{
					width: 'content-width',
					paddingLeft: 1,
					paddingRight: 2,
				},
			],
		);

		expect(table).toMatchSnapshot();
	});

	test('content-width with overflowing', () => {
		const table = terminalColumns(
			[
				[loremIpsumNewLines, loremIpsumNewLines, loremIpsumNewLines],
			],
			[
				{
					width: 'content-width',
					paddingLeft: 2,
					paddingRight: 1,
				},
				{
					width: 'content-width',
					paddingLeft: 1,
					paddingRight: 2,
				},
				{
					width: 'content-width',
					paddingTop: 1,
					paddingBottom: 1,
				},
			],
		);

		expect(table).toMatchSnapshot();
	});
});

describe('auto', () => {
	test('event split', () => {
		const table = terminalColumns(
			[
				[
					loremIpsumShort,
					loremIpsumShort,
					loremIpsumShort,
				],
			],
			[
				'auto',
				'auto',
				'auto',
			],
		);

		expect(table).toMatchSnapshot();
	});

	test('event split - many', () => {
		const table = terminalColumns(
			[
				[
					loremIpsumShort,
					loremIpsumShort,
					loremIpsumShort,
					loremIpsumShort,
					loremIpsumShort,
					loremIpsumShort,
					loremIpsumShort,
					loremIpsumShort,
					loremIpsumShort,
					loremIpsumShort,
					loremIpsumShort,
					loremIpsumShort,
				],
			],
			[
				'auto',
				'auto',
				'auto',
				'auto',
				'auto',
				'auto',
				'auto',
				'auto',
				'auto',
				'auto',
				'auto',
				'auto',
			],
		);

		expect(table).toMatchSnapshot();
	});

	test('mutli-row', () => {
		const table = terminalColumns(
			[
				[loremIpsumShort, loremIpsumNewLines, loremIpsumNewLines],
				[loremIpsumLong, loremIpsumLong, loremIpsumShort],
			],
		);

		expect(table).toMatchSnapshot();
	});
});

describe('breakpoints', () => {
	const getTable = () => terminalColumns(
		[
			[loremIpsumLong, loremIpsumLong],
			[loremIpsumLong, loremIpsumLong],
		],
		breakpoints({
			// Large screens
			'>= 90': ['content-width', 'auto'],

			// Normal screens
			'>= 25': ['100%', '100%'],

			'>= 0': {
				columns: ['content-width', 'content-width'],
				stdoutColumns: Number.POSITIVE_INFINITY,
			},
		}),
	);

	test('stdout: 25 - Too small', () => {
		process.stdout.columns = 25;
		const table = getTable();
		expect(table).toMatchSnapshot();
	});

	test('stdout: 90 - Normal', () => {
		process.stdout.columns = 90;
		const table = getTable();
		expect(table).toMatchSnapshot();
	});

	test('stdout: 150 - Very big', () => {
		process.stdout.columns = 150;
		const table = getTable();

		expect(table).toMatchSnapshot();
	});
});

describe('custom breakpoints function', () => {
	const getTable = () => terminalColumns(
		[
			[loremIpsumLong, loremIpsumLong],
			[loremIpsumLong, loremIpsumLong],
		],
		(stdoutColumns) => {
			// Large screens
			if (stdoutColumns > 90) {
				return ['content-width', 'auto'];
			}

			// Normal screens
			if (stdoutColumns > 25) {
				return ['100%', '100%'];
			}

			return {
				columns: ['content-width', 'content-width'],
				stdoutColumns: Number.POSITIVE_INFINITY,
			};
		},
	);

	test('stdout: 25 - Too small', () => {
		process.stdout.columns = 25;
		const table = getTable();
		expect(table).toMatchSnapshot();
	});

	test('stdout: 90 - Normal', () => {
		process.stdout.columns = 90;
		const table = getTable();
		expect(table).toMatchSnapshot();
	});

	test('stdout: 150 - Very big', () => {
		process.stdout.columns = 150;
		const table = getTable();

		expect(table).toMatchSnapshot();
	});
});
