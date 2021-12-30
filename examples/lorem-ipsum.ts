/**
 * Demonstrates responsive behavior by faking the terminal width
 * (Demo in README)
 *
 * Run the example in 80x27:
 * $ npx esno examples/lorem-ipsum.ts
 */

import ansiEscapes from 'ansi-escapes';
import { bold, underline, italic } from 'colorette';
import terminalColumns from '../src';

const tableData = [
	[
		italic('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id neque aliquam vestibulum morbi blandit cursus risus at.'),
		underline('Sit amet luctus venenatis lectus magna. Nisi porta lorem mollis aliquam ut porttitor leo a. Sem integer vitae justo eget magna. Erat pellentesque adipiscing commodo elit.'),
		bold('Ultrices tincidunt arcu non sodales neque. Quis blandit turpis cursus in hac habitasse platea dictumst quisque. Libero enim sed faucibus turpis in eu mi bibendum neque.'),
	],
];

const renderTable = (stdoutColumns: number) => {
	const table = terminalColumns(tableData, {
		stdoutColumns,
		columns: [
			{
				align: 'right',
				paddingRight: 4,
				paddingBottom: 1,
			},
			{
				paddingRight: 4,
				paddingBottom: 1,
			},
		],
	});

	process.stdout.write(`${ansiEscapes.clearTerminal + table}\n\n\n`);
};

const stdoutWidth = process.stdout.columns;
let tableWidth = process.stdout.columns;
let movingDown = true;

setInterval(() => {
	if (movingDown) {
		tableWidth -= 1;
		if (tableWidth === 30) {
			movingDown = false;
		}
	} else {
		tableWidth += 1;
		if (tableWidth === stdoutWidth) {
			movingDown = true;
		}
	}

	renderTable(tableWidth);
}, 100);
