export class IntelligentSecurity {
    constructor(
        public humanPresenceDetectionFlag: boolean,
        public distanceSensitivityFlag: boolean,
        public humanDistance: number,
        public zeroTouchLoginFlag: boolean,
        public zeroTouchLockFlag: boolean,
        public autoScreenLockTimer: number
	) { }
}