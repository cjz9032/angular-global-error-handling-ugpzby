export class Microphone {
	constructor(
		public available: boolean,
		public muteDisabled: boolean,
		public volume: number,
		public currentMode: string,
		public keyboardNoiseSuppression: boolean,
		public autoOptimization: boolean,
		public AEC: boolean,
		public disableEffect: boolean,
		public permission: boolean
	) {}
}
