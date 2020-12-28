class AcAdapter {
	constructor(public wattage: number, public adapterType: string, public isAttached: boolean) {}

	get type() {
		if (this.adapterType) {
			return this.adapterType.toLocaleLowerCase() === 'legacy' ? 'ac' : 'USB-C';
		}
	}
}

export default AcAdapter;
