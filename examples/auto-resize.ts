/**
 * Demonstrates how 'auto' splits column widths by re-rendering on terminal resize.
 *
 * Run the example:
 * $ npx esno examples/auto-resize.ts
 */

import { promisify } from 'util';
import ansiEscapes from 'ansi-escapes';
import { red, blue, green } from 'colorette';
import { terminalColumns } from '../src';

const tableData = [
	[
		red('A'.repeat(20)),
		blue('B'.repeat(30)),
		green('C'.repeat(40)),
	],
];

const renderTable = () => {
	const table = terminalColumns(tableData);
	process.stdout.write(ansiEscapes.clearTerminal + table);
};

process.stdout.on('resize', renderTable);
renderTable();

// Keep Node.js from exiting
promisify(setTimeout)(60 * 60 * 1000);
