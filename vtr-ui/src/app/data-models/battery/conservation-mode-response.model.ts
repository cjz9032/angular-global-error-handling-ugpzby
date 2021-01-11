export class ConservationModeStatus {
    constructor(
        public available: boolean,
        public storageToEight: boolean,
        public status: boolean,
        public isLoading: boolean = true
    ) {}
}