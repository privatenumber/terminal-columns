/**
 * Demonstrates how to make a responsive table.
 *
 * Run the example:
 * $ npx esno examples/responsive-table.ts
 */
import { promisify } from 'util';
import ansiEscapes from 'ansi-escapes';
import terminalColumns from '../src';

const tableData = [
	[
		'Jacky',
		'Mapp',
		'Georgian',
		'1992-08-09',
	],
	[
		'Raphaela',
		'Gaddes',
		'Filipino',
		'1991-07-22',
	],
	[
		'Mellie',
		'Hassey',
		'Dhivehi',
		'2000-02-06',
	],
	[
		'Dru',
		'Clout',
		'Thai',
		'1997-09-17',
	],
	[
		'Sig',
		'Evered',
		'Telugu',
		'1993-12-17',
	],
	[
		'Velvet',
		'Gambrell',
		'Telugu',
		'1995-10-18',
	],
	[
		'Alta',
		'Bagenal',
		'Thai',
		'1992-06-03',
	],
	[
		'Jerrome',
		'Fosten',
		'Kashmiri',
		'2000-09-11',
	],
	[
		'Derk',
		'Emons',
		'Ndebele',
		'1994-04-30',
	],
	[
		'Glennis',
		'Patmore',
		'Swati',
		'2000-06-05',
	],
];

function breakpoints(stdoutColumns: number) {
	// Large screens - auto
	if (stdoutColumns > 100) {
		return [
			{
				width: 'auto',
				paddingLeft: 2,
				paddingRight: 1,
			},
			{
				width: 'auto',
				paddingRight: 1,
			},
			{
				width: 'auto',
				paddingRight: 1,
			},
			{
				width: 'auto',
				paddingRight: 2,
			},
		];
	}

	// Smaller screens
	if (stdoutColumns > 30) {
		return [
			{
				width: '50%',
				paddingLeft: 2,
				paddingRight: 1,
			},
			{
				width: '50%',
				paddingRight: 2,
			},
			{
				width: '50%',
				paddingLeft: 2,
				paddingRight: 1,
			},
			{
				width: '50%',
				paddingRight: 2,
				paddingBottom: 1,
			},
		];
	}

	return {
		// Remove responsiveness
		stdoutColumns: 1000,
		columns: [
			{
				width: 'content-width',
				paddingLeft: 2,
				paddingRight: 1,
			},
			{
				width: 'content-width',
				paddingRight: 1,
			},
			{
				width: 'content-width',
				paddingRight: 1,
			},
			{
				width: 'content-width',
				paddingRight: 2,
			},
		],
	};
}

const renderTable = () => {
	const table = terminalColumns(tableData, breakpoints);
	process.stdout.write(ansiEscapes.clearTerminal + table);
};

process.stdout.on('resize', renderTable);
renderTable();

// Keep Node.js from exiting
promisify(setTimeout)(60 * 60 * 1000);
