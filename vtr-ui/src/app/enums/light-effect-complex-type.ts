export enum LightEffectComplexType {
	Static = 1, // Same as On
	Flicker = 2,
	Breath = 4,
	Wave = 8,
	Music = 16,
	Smooth = 32, ///change spectrum to smooth
	CPU_thermal = 64,
	CPU_frequency = 128,
	Response = 256,
	Ripple = 512,
	Off = 268435456, ///same Off
}
