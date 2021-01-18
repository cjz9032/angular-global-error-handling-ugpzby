export namespace AppSearch {
	export namespace FeatureIds {
		export class Dashboard {
			static readonly categoryId = 'appSearch.features.dashboard';
			static readonly pageId = `${Dashboard.categoryId}.page`;
		}
		export class MyDevice {
			static readonly categoryId = 'appSearch.features.myDevice';
			static readonly pageId = `${MyDevice.categoryId}.page`;
		}
		export class SystemUpdate {
			static readonly categoryId = 'appSearch.features.systemUpdate';
			static readonly pageId = `${SystemUpdate.categoryId}.page`;
		}
		export class MySecurity {
			static readonly categoryId = 'appSearch.features.mySecurity';
			static readonly pageId = `${MySecurity.categoryId}.page`;
		}
		export class SmartPerformance {
			static readonly categoryId = 'appSearch.features.smartPerformance';
			static readonly pageId = `${SmartPerformance.categoryId}.page`;
		}
		export class HardwareScan {
			static readonly categoryId = 'appSearch.features.hardwareScan';
			static readonly pageId = `${HardwareScan.categoryId}.page`;
		}
		export class Power {
			static readonly categoryId = 'appSearch.features.power';
			static readonly batteryInformationId = `${Power.categoryId}.batteryInformation`;
			static readonly batteryDetailsId = `${Power.categoryId}.batteryDetails`;
			static readonly smartStandbyId = `${Power.categoryId}.smartStandby`;
			static readonly alwaysOnUSBId = `${Power.categoryId}.alwaysOnUSB`;
			static readonly batteryChargeThresholdId = `${Power.categoryId}.batteryChargeThreshold`;
			static readonly intelligentCoolingId = `${Power.categoryId}.intelligentCooling`;
			static readonly dynamicThermalControlId = `${Power.categoryId}.dynamicThermalControl`;
			static readonly easyResumeId = `${Power.categoryId}.easyResume`;
			static readonly rapidChargeId = `${Power.categoryId}.rapidCharge`;
			static readonly vantageToolbarId = `${Power.categoryId}.vantageToolbar`;
		}

		export class CameraAndDisplay {
			static readonly categoryId = 'appSearch.features.cameraAndDisplay';
			static readonly cameraPrivacyModeId = `${CameraAndDisplay.categoryId}.cameraPrivacyMode`;
			static readonly privacyGuardId = `${CameraAndDisplay.categoryId}.privacyGuard`;
			static readonly eyeCareModeId = `${CameraAndDisplay.categoryId}.eyeCareMode`;
			static readonly cameraSettingsId = `${CameraAndDisplay.categoryId}.cameraSettings`;
			static readonly cameraBackgroundBlurId = `${CameraAndDisplay.categoryId}.cameraBackgroundBlur`;
		}

		export class Audio {
			static readonly categoryId = 'appSearch.features.audio';
			static readonly dolbyAudioId = `${Audio.categoryId}.dolbyAudio`;
			static readonly microphoneSettingsId = `${Audio.categoryId}.microphoneSettings`;
			static readonly automaticOptimizationForECourseId = `${Audio.categoryId}.automaticOptimizationForECourse`;
		}

		export class InputAccessories {
			static readonly categoryId = 'appSearch.features.inputAccessories';
			static readonly touchPadSettingsId = `${InputAccessories.categoryId}.touchPadSettings`;
			static readonly trackPointSettingsId = `${InputAccessories.categoryId}.trackPointSettings`;
			static readonly keyboardBacklightId = `${InputAccessories.categoryId}.keyboardBacklight`;
			static readonly smartKeyboardBacklightId = `${InputAccessories.categoryId}.smartKeyboardBacklight`;
			static readonly hiddenKeyboardFunctionsId = `${InputAccessories.categoryId}.hiddenKeyboardFunctions`;
			static readonly voIPHotkeyFunctionId = `${InputAccessories.categoryId}.voIPHotkeyFunction`;
			static readonly topRowKeyFunctionsId = `${InputAccessories.categoryId}.topRowKeyFunctions`;
			static readonly userDefinedKeyId = `${InputAccessories.categoryId}.userDefinedKey`;
			static readonly fnAndCtrlKeySwapId = `${InputAccessories.categoryId}.fnAndCtrlKeySwap`;
		}

		export class SmartAssist {
			static readonly categoryId = 'appSearch.features.smartAssist';
			static readonly activeProtectionSystemId = `${SmartAssist}.activeProtectionSystem`;
			static readonly intelligentSensingId = `${SmartAssist}.intelligentSensing`;
			static readonly zeroTouchLoginId = `${SmartAssist}.zeroTouchLogin`;
			static readonly zeroTouchLockId = `${SmartAssist}.zeroTouchLock`;
			static readonly zeroTouchVideoPlaybackId = `${SmartAssist}.zeroTouchVideoPlayback`;
			static readonly videoResolutionUpscalingSRId = `${SmartAssist}.videoResolutionUpscalingSR`;
		}
	}

	export class LocaleResourcePath {
		static readonly dashboard = FeatureIds.Dashboard.categoryId;
		static readonly myDevice = FeatureIds.MyDevice.categoryId;
		static readonly systemUpdate = FeatureIds.SystemUpdate.categoryId;
		static readonly mySecurity = FeatureIds.MySecurity.categoryId;
		static readonly smartPerformance = FeatureIds.SmartPerformance.categoryId;
		static readonly hardwareScan = FeatureIds.HardwareScan.categoryId;
		static readonly power = FeatureIds.Power.categoryId;
		static readonly cameraAndDisplay = FeatureIds.CameraAndDisplay.categoryId;
		static readonly audio = FeatureIds.Audio.categoryId;
		static readonly inputAccessories = FeatureIds.InputAccessories.categoryId;
		static readonly smartAssist = FeatureIds.SmartAssist.categoryId;
	}
}
