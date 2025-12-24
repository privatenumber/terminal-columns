import { blue, bold, underline } from 'colorette';
import { describe, expect } from 'manten';
import { terminalColumns, breakpoints } from '#terminal-columns';

const loremIpsumShort = 'Lorem ipsum dolor sit amet.';
const loremIpsumLong = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const loremIpsumNewLines = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc.
Nunc sed augue lacus viverra vitae congue eu consequat ac.
Sit amet porttitor eget dolor morbi non arcu.
`.trim();

// Setup stdout columns before tests
process.stdout.columns = 100;

describe('edge cases', async ({ describe, test }) => {
	describe('error handling', async ({ test }) => {
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

	describe('empty table', async ({ test }) => {
		test('no table', () => {
			// @ts-expect-error no args
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

	test('inconsistent rows', ({ expectSnapshot }) => {
		const table = terminalColumns([
			['A'],
			['B', 'B'],
			['C', 'C', 'C'],
		]);

		expectSnapshot(table);
	});

	test('colored text', ({ expectSnapshot }) => {
		const table = terminalColumns([
			[blue('A'.repeat(2))],
			['B', bold('B'.repeat(3))],
			['C', 'C', underline('C'.repeat(4))],
		]);

		expectSnapshot(table);
	});

	test('infinite width', ({ expectSnapshot }) => {
		const table = terminalColumns([
			['A'.repeat(100)],
			['B', 'B'.repeat(100)],
			['C', 'C', 'C'.repeat(100)],
		], {
			stdoutColumns: Number.POSITIVE_INFINITY,
		});

		expectSnapshot(table);
	});
});

describe('padding', async ({ test }) => {
	test('overflowing padding reduction - even', ({ expectSnapshot }) => {
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

		expectSnapshot(table);
	});

	test('overflowing padding reduction - uneven', ({ expectSnapshot }) => {
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

		expectSnapshot(table);
	});

	test('overflowing content with overflowing padding reduction - even', ({ expectSnapshot }) => {
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

		expectSnapshot(table);
	});
});

describe('align', async ({ test }) => {
	test('align right', ({ expectSnapshot }) => {
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

		expectSnapshot(table);
	});
});

describe('process', async ({ test }) => {
	test('preprocess', ({ expectSnapshot }) => {
		const table = terminalColumns(
			[
				[
					loremIpsumNewLines,
				],
			],
			[
				{
					preprocess: text => text.toUpperCase(),
				},
			],
		);

		expectSnapshot(table);
	});

	test('postprocess', ({ expectSnapshot }) => {
		const table = terminalColumns(
			[
				[
					loremIpsumNewLines,
				],
			],
			[
				{
					postprocess: (line, i) => {
						if (i % 2 === 0) {
							return line.toUpperCase();
						}
						return line.toLowerCase();
					},
				},
			],
		);

		expectSnapshot(table);
	});

	test('postprocess ignores vertical padding', ({ expectSnapshot }) => {
		const table = terminalColumns(
			[
				[
					loremIpsumNewLines,
					loremIpsumNewLines,
				],
			],
			[
				{
					postprocess: () => 'postprocessed',
					paddingTop: 1,
					paddingBottom: 3,
				},
			],
		);

		expectSnapshot(table);
	});
});

describe('static widths', async ({ test }) => {
	test('fixed width', ({ expectSnapshot }) => {
		const table = terminalColumns(
			[
				[loremIpsumShort, loremIpsumLong],
			],
			[10, 20],
		);

		expectSnapshot(table);
	});

	test('overflowing width', ({ expectSnapshot }) => {
		const table = terminalColumns(
			[
				[loremIpsumShort, loremIpsumLong],
			],
			[124, 152],
		);

		expectSnapshot(table);
	});

	test('overflowing rows', ({ expectSnapshot }) => {
		const table = terminalColumns(
			[
				[loremIpsumShort, loremIpsumShort],
				[loremIpsumShort, loremIpsumShort],
			],
			[10, 100],
		);

		expectSnapshot(table);
	});

	test('overflowing width with padding', ({ expectSnapshot }) => {
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

		expectSnapshot(table);
	});
});

describe('percent widths', async ({ test }) => {
	test('50% 50%', ({ expectSnapshot }) => {
		const table = terminalColumns(
			[
				[loremIpsumLong, loremIpsumLong],
			],
			[
				'50%',
				'50%',
			],
		);

		expectSnapshot(table);
	});

	test('50% 50% with padding', ({ expectSnapshot }) => {
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

		expectSnapshot(table);
	});

	test('70% 30% with different content lengths', ({ expectSnapshot }) => {
		const table = terminalColumns(
			[
				[loremIpsumLong, loremIpsumLong],
				[loremIpsumLong, loremIpsumShort],
			],
			['70%', '30%'],
		);

		expectSnapshot(table);
	});

	test('100% 100% with padding', ({ expectSnapshot }) => {
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

		expectSnapshot(table);
	});
});

describe('content-width', async ({ test }) => {
	test('content-width with fixed width', ({ expectSnapshot }) => {
		const table = terminalColumns(
			[
				[loremIpsumLong, loremIpsumLong],
				[loremIpsumLong, loremIpsumShort],
			],
			['content-width', 40],
		);

		expectSnapshot(table);
	});

	test('content-width with padding', ({ expectSnapshot }) => {
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

		expectSnapshot(table);
	});

	test('content-width with overflowing', ({ expectSnapshot }) => {
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

		expectSnapshot(table);
	});
});

describe('auto', async ({ test }) => {
	test('event split', ({ expectSnapshot }) => {
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

		expectSnapshot(table);
	});

	test('event split - many', ({ expectSnapshot }) => {
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

		expectSnapshot(table);
	});

	test('mutli-row', ({ expectSnapshot }) => {
		const table = terminalColumns(
			[
				[loremIpsumShort, loremIpsumNewLines, loremIpsumNewLines],
				[loremIpsumLong, loremIpsumLong, loremIpsumShort],
			],
		);

		expectSnapshot(table);
	});
});

describe('breakpoints', async ({ test }) => {
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

	test('stdout: 25 - Too small', ({ expectSnapshot }) => {
		process.stdout.columns = 25;
		const table = getTable();
		expectSnapshot(table);
	});

	test('stdout: 90 - Normal', ({ expectSnapshot }) => {
		process.stdout.columns = 90;
		const table = getTable();
		expectSnapshot(table);
	});

	test('stdout: 150 - Very big', ({ expectSnapshot }) => {
		process.stdout.columns = 150;
		const table = getTable();

		expectSnapshot(table);
	});
});

describe('custom breakpoints function', async ({ test }) => {
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

	test('stdout: 25 - Too small', ({ expectSnapshot }) => {
		process.stdout.columns = 25;
		const table = getTable();
		expectSnapshot(table);
	});

	test('stdout: 90 - Normal', ({ expectSnapshot }) => {
		process.stdout.columns = 90;
		const table = getTable();
		expectSnapshot(table);
	});

	test('stdout: 150 - Very big', ({ expectSnapshot }) => {
		process.stdout.columns = 150;
		const table = getTable();

		expectSnapshot(table);
	});
});
