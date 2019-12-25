export class ChunkLoadError extends Error {
	public description?: string;
	public message: string;
	public name: string;
	public number: number;
	public request?: string;
	public stack?: string;
	public type: string;
	public test1: string;
	public test2?: string;
	constructor ( ) {
		super();
		Object.setPrototypeOf(this, ChunkLoadError.prototype);
    }
}
