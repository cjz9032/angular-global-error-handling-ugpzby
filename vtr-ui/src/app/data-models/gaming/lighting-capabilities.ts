export class LightingCapabilities {
	constructor(
		public LightPanelType: number[],
		public LedType_Complex: number[],
		public LedType_simple: number[],
		public BrightAdjustLevel: number = 0,
		public RGBfeature: number

	) { }

}
