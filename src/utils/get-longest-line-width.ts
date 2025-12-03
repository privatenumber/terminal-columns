import stringWidth from './string-width-minimal';

export const getLongestLineWidth = (text: string) => Math.max(
	...text.split('\n').map(line => stringWidth(line)),
);
