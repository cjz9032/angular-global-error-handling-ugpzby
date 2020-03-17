export class HsaIntelligentSecurityResponse {
	constructor(
        public capacity: boolean,
        public capability: number = 0,
        public zeroTouchLockDistanceAutoAdjust: boolean, 
        public zeroTouchLockDistance: number = 1, 
    ) {}
}