export class FeatureStatus {
	constructor(
		public available: boolean,
		public status: boolean,
		public permission: boolean = true,
		public isLoading: boolean = true) { }
}
