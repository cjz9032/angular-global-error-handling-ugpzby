export class DolbyModeResponse {
	constructor(
        public available: boolean, 
        public supporedModes: string[], 
        public currentMode: string
    ) {}
}
export class DolbyAudioProfileResponse {
	constructor(
        public eCourseStatus: string, 
        public voIPRadioStatus: string, 
        public entertainmentRadioStatus: string,
        public aOCheckboxStatus:boolean
    ) {}
}