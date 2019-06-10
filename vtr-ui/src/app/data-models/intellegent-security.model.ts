export class IntelligentSecurity {
	constructor(
		public humanPresenceDetectionFlag: boolean,
		public zeroTouchLoginSensitivity: number,
		public zeroTouchLoginFlag: boolean,
		public zeroTouchLockFlag: boolean,
		public autoScreenLockTimer: string,
		public isZeroTouchLockVisible: boolean,
		public distanceSensitivityFlag: boolean,
		public isZeroTouchLoginVisible: boolean
	) { }
}
