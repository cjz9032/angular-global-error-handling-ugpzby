
export interface ForteClient {
	/**
	 * Check whether support Forte Media HSA APIs, if not support, then should not show microphone settings
	 */
	isForteHSASupport: boolean;

	/**
	 * Check which kind of microphone UI should be showed
	 */
	isClassicLayout: boolean;

	/**
	 * Check whether support Forte Media HSA APIs, if not support, then should not show microphone settings
	 */
	getHSASupported(): boolean;

	/**
	 * Check current microphone mode (only support new UI)
	 * TODO: Test unknow mode is exist or not.
	 */
	getCurrentMode(): 'Private mode' | 'Share mode' | 'Environmental mode' | 'unknow mode';

	/**
	 * Set mic mode to private mode
	 */
	setPrivateMode(onOff: boolean): boolean;

	/**
	 * Set mic mode to shared mode
	 */
	setSharedMode(onOff: boolean): boolean;

	/**
	 * Set mic mode to environmental mode
	 */
	setEnvironmentalMode(onOff: boolean): boolean;

	/**
	 * Get FMAPOCTL.dll version
	 *
	 * @return string for example: 1.0.0.0
	 */
	getUIVersion(): string;
}
