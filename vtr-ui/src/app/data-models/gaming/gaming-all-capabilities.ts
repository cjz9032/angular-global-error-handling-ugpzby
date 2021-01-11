export class GamingAllCapabilities {
	public desktopType = false;
	public liteGaming = false;
	// Hardware Info
	public cpuInfoFeature = false;
	public gpuInfoFeature = false;
	public memoryInfoFeature = false;
	public hddInfoFeature = false;
	// Macrokey
	public macroKeyFeature = false;
	// Thermal mode
	public smartFanFeature = false;
	public thermalModeVersion = 1;
	public supporttedThermalMode: number[] = [1, 2, 3];
	// Over clock
	public cpuOCFeature = false;
	public gpuOCFeature = false;
	public advanceCPUOCFeature = false;
	public advanceGPUOCFeature = false;
	public xtuService = false;
	public nvDriver = false;
	// Legion edge
	public memOCFeature = false;
	public networkBoostFeature = false;
	public fbnetFilter = false; // Network boost
	public optimizationFeature = false; // Auto close
	public hybridModeFeature = false;
	public overDriveFeature = false; // Version 3.3 over drive
	public winKeyLockFeature = false;
	public touchpadLockFeature = true;
	public touchpadLockStatus = false;
	// Lighting
	public ledSetFeature = false;
	public ledLayoutVersion = 1;
	public ledSwitchButtonFeature = false;
	public ledDriver = false;
}
