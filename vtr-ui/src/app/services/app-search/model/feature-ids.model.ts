export class AppSearch {
	static FeatureIds = class {
		static Dashboard = class {
			static readonly categoryId = 'appSearch.features.dashboard';
			static readonly pageId = `${AppSearch.FeatureIds.Audio.categoryId}.page`;
		};

		static MyDevice = class {
			static readonly categoryId = 'appSearch.features.myDevice';
			static readonly pageId = `${AppSearch.FeatureIds.MyDevice.categoryId}.page`;
		};

		static SystemUpdate = class {
			static readonly categoryId = 'appSearch.features.systemUpdate';
			static readonly pageId = `${AppSearch.FeatureIds.SystemUpdate.categoryId}.page`;
		};

		static MySecurity = class {
			static readonly categoryId = 'appSearch.features.mySecurity';
			static readonly pageId = `${AppSearch.FeatureIds.MySecurity.categoryId}.page`;
		};

		static SmartPerformance = class {
			static readonly categoryId = 'appSearch.features.smartPerformance';
			static readonly pageId = `${AppSearch.FeatureIds.SmartPerformance.categoryId}.page`;
		};

		static HardwareScan = class {
			static readonly categoryId = 'appSearch.features.hardwareScan';
			static readonly pageId = `${AppSearch.FeatureIds.HardwareScan.categoryId}.page`;
		};

		static Power = class {
			static readonly categoryId = 'appSearch.features.power';
			static readonly batteryInformationId = `${AppSearch.FeatureIds.Power.categoryId}.batteryInformation`;
			static readonly batteryDetailsId = `${AppSearch.FeatureIds.Power.categoryId}.batteryDetails`;
			static readonly smartStandbyId = `${AppSearch.FeatureIds.Power.categoryId}.smartStandby`;
			static readonly alwaysOnUSBId = `${AppSearch.FeatureIds.Power.categoryId}.alwaysOnUSB`;
			static readonly batteryChargeThresholdId = `${AppSearch.FeatureIds.Power.categoryId}.batteryChargeThreshold`;
			static readonly intelligentCoolingId = `${AppSearch.FeatureIds.Power.categoryId}.intelligentCooling`;
			static readonly dynamicThermalControlId = `${AppSearch.FeatureIds.Power.categoryId}.dynamicThermalControl`;
			static readonly easyResumeId = `${AppSearch.FeatureIds.Power.categoryId}.easyResume`;
			static readonly rapidChargeId = `${AppSearch.FeatureIds.Power.categoryId}.rapidCharge`;
			static readonly vantageToolbarId = `${AppSearch.FeatureIds.Power.categoryId}.vantageToolbar`;
		};

		static CameraAndDisplay = class {
			static readonly categoryId = 'appSearch.features.cameraAndDisplay';
			static readonly cameraPrivacyModeId = `${AppSearch.FeatureIds.CameraAndDisplay.categoryId}.cameraPrivacyMode`;
			static readonly privacyGuardId = `${AppSearch.FeatureIds.CameraAndDisplay.categoryId}.privacyGuard`;
			static readonly eyeCareModeId = `${AppSearch.FeatureIds.CameraAndDisplay.categoryId}.eyeCareMode`;
			static readonly cameraSettingsId = `${AppSearch.FeatureIds.CameraAndDisplay.categoryId}.cameraSettings`;
			static readonly cameraBackgroundBlurId = `${AppSearch.FeatureIds.CameraAndDisplay.categoryId}.cameraBackgroundBlur`;
		};

		static Audio = class {
			static readonly categoryId = 'appSearch.features.audio';
			static readonly dolbyAudioId = `${AppSearch.FeatureIds.Audio.categoryId}.dolbyAudio`;
			static readonly microphoneSettingsId = `${AppSearch.FeatureIds.Audio.categoryId}.microphoneSettings`;
			static readonly automaticOptimizationForECourseId = `${AppSearch.FeatureIds.Audio.categoryId}.automaticOptimizationForECourse`;
		};

		static InputAccessories = class {
			static readonly categoryId = 'appSearch.features.inputAccessories';
			static readonly touchPadSettingsId = `${AppSearch.FeatureIds.InputAccessories.categoryId}.touchPadSettings`;
			static readonly trackPointSettingsId = `${AppSearch.FeatureIds.InputAccessories.categoryId}.trackPointSettings`;
			static readonly keyboardBacklightId = `${AppSearch.FeatureIds.InputAccessories.categoryId}.keyboardBacklight`;
			static readonly smartKeyboardBacklightId = `${AppSearch.FeatureIds.InputAccessories.categoryId}.smartKeyboardBacklight`;
			static readonly hiddenKeyboardFunctionsId = `${AppSearch.FeatureIds.InputAccessories.categoryId}.hiddenKeyboardFunctions`;
			static readonly voIPHotkeyFunctionId = `${AppSearch.FeatureIds.InputAccessories.categoryId}.voIPHotkeyFunction`;
			static readonly topRowKeyFunctionsId = `${AppSearch.FeatureIds.InputAccessories.categoryId}.topRowKeyFunctions`;
			static readonly userDefinedKeyId = `${AppSearch.FeatureIds.InputAccessories.categoryId}.userDefinedKey`;
			static readonly fnAndCtrlKeySwapId = `${AppSearch.FeatureIds.InputAccessories.categoryId}.fnAndCtrlKeySwap`;
		};

		static SmartAssist = class {
			static readonly categoryId = 'appSearch.features.smartAssist';
			static readonly activeProtectionSystemId = `${AppSearch.FeatureIds.SmartAssist.categoryId}.activeProtectionSystem`;
			static readonly intelligentSensingId = `${AppSearch.FeatureIds.SmartAssist.categoryId}.intelligentSensing`;
			static readonly zeroTouchLoginId = `${AppSearch.FeatureIds.SmartAssist.categoryId}.zeroTouchLogin`;
			static readonly zeroTouchLockId = `${AppSearch.FeatureIds.SmartAssist.categoryId}.zeroTouchLock`;
			static readonly zeroTouchVideoPlaybackId = `${AppSearch.FeatureIds.SmartAssist.categoryId}.zeroTouchVideoPlayback`;
			static readonly videoResolutionUpscalingSRId = `${AppSearch.FeatureIds.SmartAssist.categoryId}.videoResolutionUpscalingSR`;
		};
	};

	static LocaleResourcePath = class {
		static readonly dashboard = AppSearch.FeatureIds.Dashboard.categoryId;
		static readonly myDevice = AppSearch.FeatureIds.MyDevice.categoryId;
		static readonly systemUpdate = AppSearch.FeatureIds.SystemUpdate.categoryId;
		static readonly mySecurity = AppSearch.FeatureIds.MySecurity.categoryId;
		static readonly smartPerformance = AppSearch.FeatureIds.SmartPerformance.categoryId;
		static readonly hardwareScan = AppSearch.FeatureIds.HardwareScan.categoryId;
		static readonly power = AppSearch.FeatureIds.Power.categoryId;
		static readonly cameraAndDisplay = AppSearch.FeatureIds.CameraAndDisplay.categoryId;
		static readonly audio = AppSearch.FeatureIds.Audio.categoryId;
		static readonly inputAccessories = AppSearch.FeatureIds.InputAccessories.categoryId;
		static readonly smartAssist = AppSearch.FeatureIds.SmartAssist.categoryId;
	};
}
