/**
 * Demonstrates how 'auto' splits column widths with Lorem Ipsum paragraphs.
 *
 * Run the example:
 * $ npx esno examples/lorem-ipsum.ts
 */

import { promisify } from 'util';
import ansiEscapes from 'ansi-escapes';
import terminalColumns from '../src';

const loremIpsumNewLines = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nHabitant morbi tristique senectus et netus et malesuada. Duis at tellus at urna condimentum mattis. Dolor sit amet consectetur adipiscing elit.';

const tableData = [
	[
		loremIpsumNewLines,
		loremIpsumNewLines,
		loremIpsumNewLines,
	],
];

const renderTable = () => {
	const table = terminalColumns(tableData, {
		columns: [
			{
				paddingRight: 4,
				paddingBottom: 1,
			},
			{
				paddingRight: 4,
			},
		],
	});
	process.stdout.write(ansiEscapes.clearTerminal);
	process.stdout.write(table);
};

process.stdout.on('resize', renderTable);
renderTable();

// Keep Node.js from exiting
promisify(setTimeout)(60 * 60 * 1000);
