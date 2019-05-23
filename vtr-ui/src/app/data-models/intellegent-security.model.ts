export class IntelligentSecurity {
	constructor(
		public humanPresenceDetectionFlag: boolean,
		public humanDistance: number,
		public autoIRLoginFlag: boolean,
		public isAutoScreenLockChecked: boolean,
		public autoScreenLockTimer: string
	) { }
}
