export class CameraDetail {
	public isPrivacyModeEnabled = false;
	public isAutoExposureEnabled: boolean;
	public isAutoFocusEnabled: boolean;
	public hasAccessToCamera = true;

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
export class EyeCareModeResponse {
	available: boolean;
	minimum: number; // slider bar min value
	maximum: number; // slider bar max value
	current: number;
	eyeCareMode: boolean; //
	default: number; // current value
	status: boolean;
}
export interface ICameraSettingsResponse {
	brightness: {
		autoModeSupported: boolean,
		autoValue: boolean,
		supported: boolean,
		min: number, // slider bar min value
		max: number, // slider bar max value
		step: number,
		default: number, //
		value: number // current value
	};
	contrast: {
		autoModeSupported: boolean,
		autoValue: boolean,
		supported: boolean,
		min: number,
		max: number,
		step: number,
		default: number,
		value: number
	};
	exposure: {
		autoModeSupported: boolean, // true means auto exposure mode toggle button can be shown
		autoValue: boolean, // true means auto exposure mode enabled
		supported: boolean, // true means exposure slider bar can be shown
		min: number,
		max: number,
		step: number,
		default: number,
		value: number
	};
	focus: {
		autoModeSupported: boolean,
		autoValue: boolean,
		supported: boolean,
		min: number, // slider bar min value
		max: number, // slider bar max value
		step: number,
		default: number, //
		value: number // current value
	};
	permission: boolean;

}
export class CameraFeatureAccess {
	public showAutoExposureSlider: boolean;
	public exposureAutoValue: boolean;
}
