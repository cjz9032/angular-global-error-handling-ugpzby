export class PromiseError extends Error {
	public name: string;
	public message: string;
	public description?: string;
	public promise: Promise<any>;
	public rejection: Error;
	public stack?: string;
	public task?: any;
	public zone?: any;
	constructor ( ) {
		super();
		Object.setPrototypeOf(this, PromiseError.prototype);
    }
}
