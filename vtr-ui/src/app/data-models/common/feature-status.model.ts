export class FeatureStatus {
	constructor(
		public available: boolean,
		public status: boolean,
		public permission: boolean = false,
		public isLoading: boolean = true) { }
}
