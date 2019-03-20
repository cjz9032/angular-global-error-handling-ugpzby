export class Microphone {
	constructor(
		public muteDisabled: boolean,
		public volume: number,
		public currentMode: string,
		public keyboardNoiseSuppression: boolean,
		public autoOptimization: boolean,
		public AEC: boolean,
		public disableEffect: boolean
	) { }
}
