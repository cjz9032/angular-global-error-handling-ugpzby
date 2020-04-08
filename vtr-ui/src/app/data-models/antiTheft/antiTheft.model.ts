export class AntiTheftResponse {
	constructor(
        public available: boolean, 
        public status: boolean,
        public isSupportPhoto:boolean,
        public cameraPrivacyState:boolean,
        public authorizedAccessState:boolean,
        public photoAddress:string = "",
        public alarmOften: number = 0, 
        public photoNumber: number = 0,
    ) {}
}