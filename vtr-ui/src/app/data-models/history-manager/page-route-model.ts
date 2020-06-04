export class PageRoute {
	path: string;
	finalPath: string;

	constructor (path: string, finalPath?: string) {
		this.path = path ? path : '/';
		this.finalPath = finalPath ? finalPath : path;
	}
}
