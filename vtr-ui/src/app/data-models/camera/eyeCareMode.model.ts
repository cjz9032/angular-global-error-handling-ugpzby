export class EyeCareMode {
	public available: boolean;
	public current: number;
	public maximum: number;
	public minimum: number;
	public status: boolean;
}
export class SunsetToSunriseStatus {
	constructor(
		public available: boolean,
		public status: boolean,
		public permission: boolean) { }
}
