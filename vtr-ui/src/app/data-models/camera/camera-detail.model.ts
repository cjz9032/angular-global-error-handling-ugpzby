export class CameraDetail {
	public isPrivacyModeEnabled: boolean;
	public isAutoExposureEnabled: boolean;
	public isAutoFocusEnabled: boolean;
	public hasAccessToCamera: boolean;

	/**
	 * Minimum value allowed for brightness
	 */
	public brightnessMinValue: number;
	/**
	 * Maximum value allowed for brightness
	 */
	public brightnessMaxValue: number;
	/**
	 * Currently selected value for brightness
	 */
	public brightnessValue: number;
	/**
	 * determines how many steps or values to increase on each slide for brightness
	 */
	public brightnessStepValue: number;

	/**
	 * Minimum value allowed for contrast
	 */
	public contrastMinValue: number;
	/**
	 * Maximum value allowed for contrast
	 */
	public contrastMaxValue: number;
	/**
	 * Currently selected value for contrast
	 */
	public contrastValue: number;
	/**
	 * determines how many steps or values to increase on each slide for contrast
	 */
	public contrastStepValue: number;

	/**
	 * Minimum value allowed for autoExposure
	 */
	public autoExposureMinValue: number;
	/**
	 * Maximum value allowed for autoExposure
	 */
	public autoExposureMaxValue: number;
	/**
	 * Currently selected value for autoExposure
	 */
	public autoExposureValue: number;
	/**
	 * determines how many steps or values to increase on each slide for autoExposure
	 */
	public autoExposureStepValue: number;
}
