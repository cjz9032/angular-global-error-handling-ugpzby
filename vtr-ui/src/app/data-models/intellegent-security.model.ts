export class IntelligentSecurity {
	constructor(
		public humanPresenceDetectionFlag: boolean,
		public humanDistance: number,
		public zeroTouchLoginFlag: boolean,
		public zeroTouchLockFlag: boolean,
		public autoScreenLockTimer: number,
		public isZeroTouchLockVisible: boolean,
		public distanceSensitivityFlag: boolean,
	) { }
}
