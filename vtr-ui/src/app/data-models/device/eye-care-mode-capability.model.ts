import { EyeCareModeResponse } from '../camera/camera-detail.model';
import { SunsetToSunriseStatus, EyeCareMode } from '../camera/eyeCareMode.model';

export class EyeCareModeCapability {
	public available = false;
	public toggleStatus: boolean;
	public eyeCareDataSource: EyeCareMode;
	public enableSlider: boolean;
	public enableSunsetToSunrise: boolean;
	public sunsetToSunriseStatus: SunsetToSunriseStatus;
}
