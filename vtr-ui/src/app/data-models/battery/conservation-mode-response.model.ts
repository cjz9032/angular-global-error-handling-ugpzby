export class ConservationModeStatus {
    constructor(
        public available: boolean,
        public storageToEighty: boolean,
        public status: boolean,
        public isLoading: boolean = true
    ) {}
}