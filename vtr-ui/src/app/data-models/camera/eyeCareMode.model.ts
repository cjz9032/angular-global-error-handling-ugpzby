export class EyeCareMode {
	public available = false;
	public current = 0;
	public maximum = 100;
	public minimum = 0;
	public status = false;
}
export class SunsetToSunriseStatus {
	constructor(
		public available: boolean,
		public status: boolean,
		public permission: boolean,
		public sunriseTime: string,
		public sunsetTime: string
	) { }
}
