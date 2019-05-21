export class IntelligentSecurity {
    constructor(
		public humanPresenceDetectionFlag: boolean,
        public humanDistance: number,
        public autoIRLoginFlag: boolean,
        public autoScreenLockFlag: boolean,
        public autoScreenLockTimer: string
	) { }
}