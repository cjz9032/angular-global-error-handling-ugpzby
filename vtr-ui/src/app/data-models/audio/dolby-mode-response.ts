export class DolbyModeResponse {
    constructor(
        public available: boolean,
        public supporedModes: string[],
        public currentMode: string,

        public isAudioProfileEnabled: boolean,
        public eCourseStatus: string,
        public voIPStatus: string,
        public entertainmentStatus: string,
        public driverAvailability: boolean
    ) { }
}