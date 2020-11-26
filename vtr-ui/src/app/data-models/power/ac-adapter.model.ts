class AcAdapter {
	constructor(public wattage: number, public _type: string, public isAttached: boolean) {}

	get type() {
		if (this._type) {
			return this._type.toLocaleLowerCase() === 'legacy' ? 'ac' : 'USB-C';
		}
	}
}

export default AcAdapter;
