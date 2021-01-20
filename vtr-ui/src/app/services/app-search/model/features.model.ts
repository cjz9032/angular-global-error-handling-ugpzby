import { MenuID, RoutePath } from 'src/assets/menu/menu';
import { AppSearch } from './feature-ids.model';

export const featureSource = [
	/***
	 * appSearch.features.dashboard
	 */
	{
		id: AppSearch.FeatureIds.Dashboard.pageId,
		categoryId: AppSearch.FeatureIds.Dashboard.categoryId,
		categoryName: `${AppSearch.LocaleResourcePath.dashboard}.categoryName`,
		featureName: `${AppSearch.LocaleResourcePath.dashboard}.page.featureName`, // if the featureName and category is omited, we will fill it with the according id
		highRelevantKeywords: `${AppSearch.LocaleResourcePath.dashboard}.page.highRelevantKeywords`,
		lowRelevantKeywords: `${AppSearch.LocaleResourcePath.dashboard}.page.lowRelevantKeywords`,
		icon: ['fal', 'gem'],
		action: {
			route: RoutePath.dashboard,
			// params: {}, optional
		},
	},

	/***
	 * appSearch.features.myDevice
	 */
	{
		id: AppSearch.FeatureIds.MyDevice.pageId,
		categoryId: AppSearch.FeatureIds.MyDevice.categoryId,
		icon: ['fal', 'gem'],
		action: {
			route: RoutePath.device,
			// params: {}, optional
		},
	},

	/***
	 * appSearch.features.systemUpdate
	 */
	{
		id: AppSearch.FeatureIds.SystemUpdate.pageId,
		categoryId: AppSearch.FeatureIds.SystemUpdate.categoryId,
		icon: ['fal', 'gem'],
		action: {
			route: `${RoutePath.device}/${RoutePath.systemUpdates}`,
		},
	},

	/***
	 * appSearch.features.mySecurity
	 */
	{
		id: AppSearch.FeatureIds.MySecurity.pageId,
		categoryId: AppSearch.FeatureIds.MySecurity.categoryId,
		icon: ['fal', 'gem'],
		action: {
			route: `${RoutePath.security}/${RoutePath.mySecurity}`,
		},
	},

	/***
	 * appSearch.pages.smartPerformance
	 */
	{
		id: AppSearch.FeatureIds.SmartPerformance.pageId,
		categoryId: AppSearch.FeatureIds.SmartPerformance.categoryId,
		icon: ['fal', 'gem'],
		action: {
			route: `${RoutePath.support}/${RoutePath.smartPerfomance}`,
		},
	},

	/***
	 * appSearch.pages.hwScan
	 */
	{
		id: AppSearch.FeatureIds.HardwareScan.pageId,
		categoryId: AppSearch.FeatureIds.HardwareScan.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.hardwareScan,
		},
	},

	/***
	 * appSearch.features.power
	 */
	{
		id: AppSearch.FeatureIds.Power.batteryInformationId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.batteryDetailsId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.smartStandbyId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.acAdapterId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.alwaysOnUSBId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.airplanePowerModeId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.batteryChargeThresholdId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.batteryGaugeResetId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.intelligentCoolingId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.energyStarId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.performanceModeId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.conservationModeId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.desktopPowerPlanId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.oLEDPowerSettingsId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.smartFliptoBootId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.dynamicThermalControlId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.easyResumeId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.rapidChargeId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},
	{
		id: AppSearch.FeatureIds.Power.vantageToolbarId,
		categoryId: AppSearch.FeatureIds.Power.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.power,
		},
	},

	/***
	 * appSearch.features.cameraAndDisplay
	 */
	{
		id: AppSearch.FeatureIds.CameraAndDisplay.cameraPrivacyModeId,
		categoryId: AppSearch.FeatureIds.CameraAndDisplay.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.displayCamera,
		},
	},
	{
		id: AppSearch.FeatureIds.CameraAndDisplay.privacyGuardId,
		categoryId: AppSearch.FeatureIds.CameraAndDisplay.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.displayCamera,
		},
	},
	{
		id: AppSearch.FeatureIds.CameraAndDisplay.eyeCareModeId,
		categoryId: AppSearch.FeatureIds.CameraAndDisplay.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.displayCamera,
		},
	},
	{
		id: AppSearch.FeatureIds.CameraAndDisplay.cameraSettingsId,
		categoryId: AppSearch.FeatureIds.CameraAndDisplay.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.displayCamera,
		},
	},
	{
		id: AppSearch.FeatureIds.CameraAndDisplay.cameraBackgroundBlurId,
		categoryId: AppSearch.FeatureIds.CameraAndDisplay.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.displayCamera,
		},
	},

	/***
	 * appSearch.features.audio
	 */
	{
		id: AppSearch.FeatureIds.Audio.dolbyAudioId,
		categoryId: AppSearch.FeatureIds.Audio.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.audio,
		},
	},
	{
		id: AppSearch.FeatureIds.Audio.microphoneSettingsId,
		categoryId: AppSearch.FeatureIds.Audio.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.audio,
		},
	},
	{
		id: AppSearch.FeatureIds.Audio.automaticOptimizationForECourseId,
		categoryId: AppSearch.FeatureIds.Audio.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.audio,
		},
	},

	/***
	 * appSearch.features.input
	 */
	{
		id: AppSearch.FeatureIds.InputAccessories.touchPadSettingsId,
		categoryId: AppSearch.FeatureIds.InputAccessories.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.inputAccessories,
		},
	},
	{
		id: AppSearch.FeatureIds.InputAccessories.trackPointSettingsId,
		categoryId: AppSearch.FeatureIds.InputAccessories.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.inputAccessories,
		},
	},
	{
		id: AppSearch.FeatureIds.InputAccessories.keyboardBacklightId,
		categoryId: AppSearch.FeatureIds.InputAccessories.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.inputAccessories,
		},
	},
	{
		id: AppSearch.FeatureIds.InputAccessories.smartKeyboardBacklightId,
		categoryId: AppSearch.FeatureIds.InputAccessories.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.inputAccessories,
		},
	},
	{
		id: AppSearch.FeatureIds.InputAccessories.hiddenKeyboardFunctionsId,
		categoryId: AppSearch.FeatureIds.InputAccessories.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.inputAccessories,
		},
	},
	{
		id: AppSearch.FeatureIds.InputAccessories.voIPHotkeyFunctionId,
		categoryId: AppSearch.FeatureIds.InputAccessories.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.inputAccessories,
		},
	},
	{
		id: AppSearch.FeatureIds.InputAccessories.topRowKeyFunctionsId,
		categoryId: AppSearch.FeatureIds.InputAccessories.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.inputAccessories,
		},
	},
	{
		id: AppSearch.FeatureIds.InputAccessories.userDefinedKeyId,
		categoryId: AppSearch.FeatureIds.InputAccessories.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.inputAccessories,
		},
	},
	{
		id: AppSearch.FeatureIds.InputAccessories.fnAndCtrlKeySwapId,
		categoryId: AppSearch.FeatureIds.InputAccessories.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.inputAccessories,
		},
	},

	/***
	 * appSearch.features.smartAssist
	 */
	{
		id: AppSearch.FeatureIds.SmartAssist.activeProtectionSystemId,
		categoryId: AppSearch.FeatureIds.SmartAssist.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.smartAssist,
		},
	},
	{
		id: AppSearch.FeatureIds.SmartAssist.intelligentSensingId,
		categoryId: AppSearch.FeatureIds.SmartAssist.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.smartAssist,
		},
	},
	{
		id: AppSearch.FeatureIds.SmartAssist.zeroTouchLoginId,
		categoryId: AppSearch.FeatureIds.SmartAssist.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.smartAssist,
		},
	},
	{
		id: AppSearch.FeatureIds.SmartAssist.zeroTouchLockId,
		categoryId: AppSearch.FeatureIds.SmartAssist.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.smartAssist,
		},
	},
	{
		id: AppSearch.FeatureIds.SmartAssist.zeroTouchVideoPlaybackId,
		categoryId: AppSearch.FeatureIds.SmartAssist.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.smartAssist,
		},
	},
	{
		id: AppSearch.FeatureIds.SmartAssist.smartMotionAlarmId,
		categoryId: AppSearch.FeatureIds.SmartAssist.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.smartAssist,
		},
	},
	{
		id: AppSearch.FeatureIds.SmartAssist.videoResolutionUpscalingSRId,
		categoryId: AppSearch.FeatureIds.SmartAssist.categoryId,
		icon: ['fal', 'gem'],
		action: {
			menuId: MenuID.smartAssist,
		},
	},
	/***
	 * appSearch.features.homeSecurity
	 */
	{
		id: AppSearch.FeatureIds.HomeSecurity.pageId,
		categoryId: AppSearch.FeatureIds.HomeSecurity.categoryId,
		icon: ['fal', 'gem'],
		action: {
			route: `${RoutePath.homeSecurity}`,
		},
	},

	/***
	 * appSearch.features.wifiSecurity
	 */
	{
		id: AppSearch.FeatureIds.WifiSecurity.pageId,
		categoryId: AppSearch.FeatureIds.WifiSecurity.categoryId,
		icon: ['fal', 'gem'],
		action: {
			route: `${RoutePath.security}/${RoutePath.wifiSecurity}`,
		},
	},

	/***
	 * appSearch.features.antiVirus
	 */
	{
		id: AppSearch.FeatureIds.AntiVirus.pageId,
		categoryId: AppSearch.FeatureIds.AntiVirus.categoryId,
		icon: ['fal', 'gem'],
		action: {
			route: `${RoutePath.security}/${RoutePath.antiVirus}`,
		},
	},

	/***
	 * appSearch.features.passwordSecurity
	 */
	{
		id: AppSearch.FeatureIds.PasswordHealth.pageId,
		categoryId: AppSearch.FeatureIds.PasswordHealth.categoryId,
		icon: ['fal', 'gem'],
		action: {
			route: `${RoutePath.security}/${RoutePath.passwordProtection}`,
		},
	},

	/***
	 * appSearch.features.vpnSecurity
	 */
	{
		id: AppSearch.FeatureIds.VpnSecurity.pageId,
		categoryId: AppSearch.FeatureIds.VpnSecurity.categoryId,
		icon: ['fal', 'gem'],
		action: {
			route: `${RoutePath.security}/${RoutePath.internetProtection}`,
		},
	},
];
