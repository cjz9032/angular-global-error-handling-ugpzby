export class KeyPress {
	constructor(
		public key: string,
		public keyCode: number,
		public location: number,
		public ctrlKey: boolean,
		public altKey: boolean,
		public shiftKey: boolean
	) {}
}
