export class HsaIntelligentSecurityResponse {
	constructor(
		public capacity: boolean,
		public zeroTouchLockDistanceAutoAdjust: boolean,
		public zeroTouchLockDistance: number = 1,
		public capability: number = 0,
		public sensorType: number = 0,
		public videoAutoPauseResumeVersion: number = 0,
	) { }
}