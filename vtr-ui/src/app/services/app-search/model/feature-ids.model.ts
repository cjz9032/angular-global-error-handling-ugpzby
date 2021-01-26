export class AppSearch {
	static FeatureIds = class {
		static Dashboard = class {
			static readonly categoryId = 'appSearch.features.dashboard';
			static readonly pageId = `appSearch.features.dashboard.page`;
		};

		static MyDevice = class {
			static readonly categoryId = 'appSearch.features.myDevice';
			static readonly pageId = `appSearch.features.myDevice.page`;
		};

		static SystemUpdate = class {
			static readonly categoryId = 'appSearch.features.systemUpdate';
			static readonly pageId = `appSearch.features.systemUpdate.page`;
		};

		static MySecurity = class {
			static readonly categoryId = 'appSearch.features.mySecurity';
			static readonly pageId = `appSearch.features.mySecurity.page`;
		};

		static SmartPerformance = class {
			static readonly categoryId = 'appSearch.features.smartPerformance';
			static readonly pageId = `appSearch.features.smartPerformance.page`;
		};

		static HardwareScan = class {
			static readonly categoryId = 'appSearch.features.hardwareScan';
			static readonly pageId = `appSearch.features.hardwareScan.page`;
		};

		static Power = class {
			static readonly categoryId = 'appSearch.features.power';
			static readonly batteryInformationId = `appSearch.features.power.batteryInformation`;
			static readonly batteryDetailsId = `appSearch.features.power.batteryDetails`;
			static readonly acAdapterId = `appSearch.features.power.acAdapter`;
			static readonly smartStandbyId = `appSearch.features.power.smartStandby`;
			static readonly alwaysOnUSBId = `appSearch.features.power.alwaysOnUSB`;
			static readonly airplanePowerModeId = `appSearch.features.power.airplanePowerMode`;
			static readonly batteryChargeThresholdId = `appSearch.features.power.batteryChargeThreshold`;
			static readonly batteryGaugeResetId = `appSearch.features.power.batteryGaugeReset`;
			static readonly intelligentCoolingId = `appSearch.features.power.intelligentCooling`;
			static readonly dynamicThermalControlId = `appSearch.features.power.dynamicThermalControl`;
			static readonly performanceModeId = `appSearch.features.power.performanceMode`;
			static readonly easyResumeId = `appSearch.features.power.easyResume`;
			static readonly energyStarId = `appSearch.features.power.energyStar`;
			static readonly conservationModeId = `appSearch.features.power.conservationMode`;
			static readonly rapidChargeId = `appSearch.features.power.rapidCharge`;
			static readonly desktopPowerPlanManagementId = `appSearch.features.power.desktopPowerPlanManagement`;
			static readonly smartFliptoBootId = `appSearch.features.power.smartFliptoBoot`;
			static readonly vantageToolbarId = `appSearch.features.power.vantageToolbar`;
		};

		static CameraAndDisplay = class {
			static readonly categoryId = 'appSearch.features.cameraAndDisplay';
			static readonly cameraPrivacyModeId = `appSearch.features.cameraAndDisplay.cameraPrivacyMode`;
			static readonly privacyGuardId = `appSearch.features.cameraAndDisplay.privacyGuard`;
			static readonly eyeCareModeId = `appSearch.features.cameraAndDisplay.eyeCareMode`;
			static readonly cameraSettingsId = `appSearch.features.cameraAndDisplay.cameraSettings`;
			static readonly cameraBackgroundBlurId = `appSearch.features.cameraAndDisplay.cameraBackgroundBlur`;
			static readonly oLEDPowerSettingsId = `appSearch.features.cameraAndDisplay.oLEDPowerSettings`;
		};

		static Audio = class {
			static readonly categoryId = 'appSearch.features.audio';
			static readonly dolbyAudioId = `appSearch.features.audio.dolbyAudio`;
			static readonly microphoneSettingsId = `appSearch.features.audio.microphoneSettings`;
			static readonly automaticOptimizationForECourseId = `appSearch.features.audio.automaticOptimizationForECourse`;
		};

		static InputAccessories = class {
			static readonly categoryId = 'appSearch.features.inputAccessories';
			static readonly touchPadSettingsId = `appSearch.features.inputAccessories.touchPadSettings`;
			static readonly trackPointSettingsId = `appSearch.features.inputAccessories.trackPointSettings`;
			static readonly keyboardBacklightId = `appSearch.features.inputAccessories.keyboardBacklight`;
			static readonly smartKeyboardBacklightId = `appSearch.features.inputAccessories.smartKeyboardBacklight`;
			static readonly hiddenKeyboardFunctionsId = `appSearch.features.inputAccessories.hiddenKeyboardFunctions`;
			static readonly voIPHotkeyFunctionId = `appSearch.features.inputAccessories.voIPHotkeyFunction`;
			static readonly topRowKeyFunctionsId = `appSearch.features.inputAccessories.topRowKeyFunctions`;
			static readonly userDefinedKeyId = `appSearch.features.inputAccessories.userDefinedKey`;
			static readonly fnAndCtrlKeySwapId = `appSearch.features.inputAccessories.fnAndCtrlKeySwap`;
		};

		static SmartAssist = class {
			static readonly categoryId = 'appSearch.features.smartAssist';
			static readonly activeProtectionSystemId = `appSearch.features.smartAssist.activeProtectionSystem`;
			static readonly intelligentSensingId = `appSearch.features.smartAssist.intelligentSensing`;
			static readonly zeroTouchLoginId = `appSearch.features.smartAssist.zeroTouchLogin`;
			static readonly zeroTouchLockId = `appSearch.features.smartAssist.zeroTouchLock`;
			static readonly zeroTouchVideoPlaybackId = `appSearch.features.smartAssist.zeroTouchVideoPlayback`;
			static readonly smartMotionAlarmId = `appSearch.features.smartAssist.smartMotionAlarm`;
			static readonly videoResolutionUpscalingSRId = `appSearch.features.smartAssist.videoResolutionUpscalingSR`;
		};

		static HomeSecurity = class {
			static readonly categoryId = 'appSearch.features.homeSecurity';
			static readonly pageId = 'appSearch.features.homeSecurity.page';
		};

		static WifiSecurity = class {
			static readonly categoryId = 'appSearch.features.wifiSecurity';
			static readonly pageId = 'appSearch.features.wifiSecurity.page';
		};

		static AntiVirus = class {
			static readonly categoryId = 'appSearch.features.antiVirus';
			static readonly pageId = 'appSearch.features.antiVirus.page';
		};

		static PasswordHealth = class {
			static readonly categoryId = 'appSearch.features.passwordHealth';
			static readonly pageId = 'appSearch.features.passwordHealth.page';
		};

		static VpnSecurity = class {
			static readonly categoryId = 'appSearch.features.vpnSecurity';
			static readonly pageId = 'appSearch.features.vpnSecurity.page';
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
		static readonly homeSecurity = AppSearch.FeatureIds.HomeSecurity.categoryId;
		static readonly wifiSecurity = AppSearch.FeatureIds.WifiSecurity.categoryId;
		static readonly vpnSecurity = AppSearch.FeatureIds.VpnSecurity.categoryId;
		static readonly antiVirus = AppSearch.FeatureIds.AntiVirus.categoryId;
		static readonly passwordHealth = AppSearch.FeatureIds.PasswordHealth.categoryId;
	};
}
