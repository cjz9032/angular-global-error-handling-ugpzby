export class HsaIntelligentSecurityResponse {
	constructor(
        public capacity: boolean,
        public capability: boolean,
        public zeroTouchLockDistanceAutoAdjust: boolean, 
        public zeroTouchLockDistance: number = 1, 
    ) {}
}