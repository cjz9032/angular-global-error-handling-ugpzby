export class DolbyModeResponse {
	constructor(
        public available: boolean, 
        public supporedModes: string[], 
        public currentMode: string
    ) {}
}