/**
 * Demonstrates how 'auto' splits column widths by re-rendering on terminal resize.
 *
 * Run the example:
 * $ npx esno examples/auto-resize.ts
 */

import { promisify } from 'util';
import ansiEscapes from 'ansi-escapes';
import terminalColumns from '../src';

const tableData = [
	[
		'A'.repeat(20),
		'B'.repeat(30),
		'C'.repeat(40),
	],
];

const renderTable = () => {
	const table = terminalColumns(tableData);
	process.stdout.write(ansiEscapes.clearTerminal);
	process.stdout.write(table);
};

process.stdout.on('resize', renderTable);
renderTable();

// Keep Node.js from exiting
promisify(setTimeout)(60 * 60 * 1000);
