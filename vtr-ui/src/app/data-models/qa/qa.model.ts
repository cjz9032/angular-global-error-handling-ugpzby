export class QA {
	id: number;
	iconPath: string;
	path: string;
	title?: string;
	keys?: string[];
	description?: string;
	like: boolean;
	dislike: boolean;
	category: string;

	constructor(id: number,
		iconPath: string,
		path: string,
		title: string,
		like: boolean,
		dislike: boolean,
		keys: string[],
		description: string) { }

	getDescription?() {
		return 'getDescription';
	}
}
