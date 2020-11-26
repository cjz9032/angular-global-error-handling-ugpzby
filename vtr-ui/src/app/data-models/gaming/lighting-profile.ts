export class LightingProfile {
	constructor(
		public didSuccess: Boolean,
		public profileId: number,
		public brightness: number,
		public lightInfo: [
			{
				lightPanelType: number;
				lightEffectType: number;
				lightColor: string;
			}
		]
	) {}
}
