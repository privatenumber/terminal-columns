import stringWidth from 'string-width';

export const getLongestLineWidth = (text: string) => Math.max(
	...text.split('\n').map(stringWidth),
);
