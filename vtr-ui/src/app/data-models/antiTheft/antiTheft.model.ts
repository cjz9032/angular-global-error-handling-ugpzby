export class AntiTheftResponse {
	constructor(
        public available: boolean, 
        public status: boolean,
        public isSupportPhoto:boolean,
        public cameraPrivacyState:boolean,
        public authorizedAccessState:boolean,
        public photoAddress:string = "",
        public alarmOften: number = 10, 
        public photoNumber: number = 5,
    ) {}
}