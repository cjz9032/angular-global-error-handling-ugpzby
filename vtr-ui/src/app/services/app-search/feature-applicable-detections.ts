import { Injectable } from '@angular/core';
import { keyBy, mapValues, toLower } from 'lodash';

import { DeviceService } from '../device/device.service';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SegmentConst, SegmentConstHelper } from '../self-select/self-select.service';
import { LoggerService } from '../logger/logger.service';
import { SystemUpdateService } from '../system-update/system-update.service';
import { AppSearch } from './model/feature-ids.model';
import { IApplicableDetector } from './model/interface.model';
import { HardwareScanService } from 'src/app/modules/hardware-scan/services/hardware-scan.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { DisplayService } from 'src/app/services/hwsettings/hwsettings.service';
import { BatteryDetailService } from 'src/app/services/hwsettings/hwsettings.service';
import { PowerService } from '../power/power.service';
import { PowerDpmService } from 'src/app/services/hwsettings/hwsettings.service';
import { CameraFeedService } from 'src/app/services/hwsettings/hwsettings.service';
import { AudioService } from 'src/app/services/hwsettings/hwsettings.service';
import { InputAccessoriesService } from 'src/app/services/hwsettings/hwsettings.service';
import { SmartAssistService } from 'src/app/services/hwsettings/hwsettings.service';
import { FlipToStartSupportedEnum } from '../power/flip-to-start.enum';
import { TopRowFunctionsIdeapadService } from 'src/app/services/hwsettings/hwsettings.service';
import { MachineType } from '../device/machine-type';
import { BacklightService } from 'src/app/services/hwsettings/hwsettings.service';
import { BacklightLevelEnum } from 'src/app/enums/hwsettings.enum';

@Injectable({
	providedIn: 'root',
})
export class FeatureApplicableDetections {
	private detectionFuncMap = {};
	private invokeCache = {};
	private detectionFuncList: IApplicableDetector[] = [
		// dashboard
		{
			featureId: AppSearch.FeatureIds.Dashboard.pageId,
			isApplicable: async () => this.isDashboardApplicable(),
		},
		// my device
		{
			featureId: AppSearch.FeatureIds.MyDevice.pageId,
			isApplicable: async () => true,
		},
		// system update
		{
			featureId: AppSearch.FeatureIds.SystemUpdate.pageId,
			isApplicable: async () => this.isSystemUpdateApplicable(),
		},
		// MySecurity
		{
			featureId: AppSearch.FeatureIds.MySecurity.pageId,
			isApplicable: async () => this.isMySecurityApplicable(),
		},
		// AntiVirus
		{
			featureId: AppSearch.FeatureIds.AntiVirus.pageId,
			isApplicable: async () => this.isAntiVirusApplicable(),
		},
		// PasswordHealth
		{
			featureId: AppSearch.FeatureIds.PasswordHealth.pageId,
			isApplicable: async () => this.isPasswordHealthAndVpnSecurityApplicable(),
		},
		// WifiSecurity
		{
			featureId: AppSearch.FeatureIds.WifiSecurity.pageId,
			isApplicable: async () => this.isWifiSecurityApplicable(),
		},
		// VPNSecurity
		{
			featureId: AppSearch.FeatureIds.VpnSecurity.pageId,
			isApplicable: async () => this.isPasswordHealthAndVpnSecurityApplicable(),
		},
		// HomeSecurity
		{
			featureId: AppSearch.FeatureIds.HomeSecurity.pageId,
			isApplicable: async () => this.isHomeSecurityApplicable(),
		},
		// Smart Performance
		{
			featureId: AppSearch.FeatureIds.SmartPerformance.pageId,
			isApplicable: async () => this.isSmartPerformanceApplicable(),
		},
		// Hardware Scan
		{
			featureId: AppSearch.FeatureIds.HardwareScan.pageId,
			isApplicable: async () => this.isHardwareScanApplicable(),
		},
		// device settings - powers feature
		{
			featureId: AppSearch.FeatureIds.Power.batteryInformationId,
			isApplicable: async () => this.isBatteryInformationApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.batteryDetailsId,
			isApplicable: async () => this.isBatteryInformationApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.acAdapterId,
			isApplicable: async () => this.isAcAdapterStatusApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.smartStandbyId,
			isApplicable: async () => this.isSmartStandByApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.alwaysOnUSBId,
			isApplicable: async () => this.isAlwaysOnUsbApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.airplanePowerModeId,
			isApplicable: async () => this.isAirplanePowerModeIdApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.batteryChargeThresholdId,
			isApplicable: async () => this.isbatteryChargeThresholdApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.batteryGaugeResetId,
			isApplicable: async () => this.powerService.getGaugeResetCapability(),
		},

		{
			featureId: AppSearch.FeatureIds.Power.intelligentCoolingId,
			isApplicable: async () => this.isITSSettingsApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.dynamicThermalControlId,
			isApplicable: async () => this.isDynamicThermalControlApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.extraPowerModeSettingId,
			isApplicable: async () => this.isExtraPowerModeSettingApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.easyResumeId,
			isApplicable: async () => this.isEasyResumeApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.energyStarId,
			isApplicable: async () => this.isEnergyStarApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.conservationModeId,
			isApplicable: async () => this.isConservationModeStatusApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.rapidChargeId,
			isApplicable: async () => this.isRapidChargeModeStatusApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.desktopPowerPlanManagementId,
			isApplicable: async () => this.isPowerPlanManagementApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.smartFliptoBootId,
			isApplicable: async () => this.isFlipToBootCapabilityApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Power.vantageToolbarId,
			isApplicable: async () => this.isVantageToolBarStatusApplicable(),
		},

		// Cammera & Display
		{
			featureId: AppSearch.FeatureIds.CameraAndDisplay.cameraPrivacyModeId,
			isApplicable: async () =>
				(await this.displayService.getCameraPrivacyModeState())?.available,
		},
		{
			featureId: AppSearch.FeatureIds.CameraAndDisplay.privacyGuardId,
			isApplicable: async () => this.isPrivacyGuardApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.CameraAndDisplay.eyeCareModeId,
			isApplicable: async () => true,
		},
		{
			featureId: AppSearch.FeatureIds.CameraAndDisplay.cameraSettingsId,
			isApplicable: async () => this.isCameraSettingsApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.CameraAndDisplay.cameraBackgroundBlurId,
			isApplicable: async () =>
				(await this.cameraFeedService.getCameraBlurSettings()).available,
		},
		{
			featureId: AppSearch.FeatureIds.CameraAndDisplay.oLEDPowerSettingsId,
			isApplicable: async () => this.isOLEDPowerSettingsApplicable(),
		},

		// audio features
		{
			featureId: AppSearch.FeatureIds.Audio.dolbyAudioId,
			isApplicable: async () => (await this.audioService.getDolbyMode())?.available,
		},
		{
			featureId: AppSearch.FeatureIds.Audio.microphoneSettingsId,
			isApplicable: async () => this.audioService.getMicrophoneSettingsAsync(null),
		},
		{
			featureId: AppSearch.FeatureIds.Audio.automaticOptimizationForECourseId,
			isApplicable: async () =>
				(await this.audioService.getDolbyMode())?.eCourseStatus?.toLowerCase() !==
				'notsupport',
		},

		// InputAccessories features
		{
			featureId: AppSearch.FeatureIds.InputAccessories.touchPadSettingsId,
			isApplicable: async () => this.inputAccessoriesService.getTouchPadCapability(),
		},
		{
			featureId: AppSearch.FeatureIds.InputAccessories.trackPointSettingsId,
			isApplicable: async () => this.isTrackPointSettingsApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.InputAccessories.keyboardBacklightId,
			isApplicable: async () => this.isBacklightApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.InputAccessories.smartKeyboardBacklightId,
			isApplicable: async () => this.isSmartKeyboardBacklightApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.InputAccessories.hiddenKeyboardFunctionsId,
			isApplicable: async () => this.isHiddenKeyboardFunctionApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.InputAccessories.voIPHotkeyFunctionId,
			isApplicable: async () => this.isVoIPHotkeyFunctionApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.InputAccessories.topRowKeyFunctionsId,
			isApplicable: async () => this.isTopRowKeyFunctionsApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.InputAccessories.userDefinedKeyId,
			isApplicable: async () => this.isUserDefinedKeyApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.InputAccessories.fnAndCtrlKeySwapId,
			isApplicable: async () => this.isFnAndCtrlkeySwapApplicable(),
		},

		// smart assist features
		{
			featureId: AppSearch.FeatureIds.SmartAssist.activeProtectionSystemId,
			isApplicable: async () => this.isActiveProtectionSystemApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.SmartAssist.intelligentSensingId,
			isApplicable: async () => this.isIntelligentSensingApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.SmartAssist.zeroTouchLoginId,
			isApplicable: async () => this.isZeroTouchLoginApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.SmartAssist.zeroTouchLockId,
			isApplicable: async () => this.isZeroTouchLockApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.SmartAssist.zeroTouchVideoPlaybackId,
			isApplicable: async () => this.isZeroTouchVideoPlaybackApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.SmartAssist.smartMotionAlarmId,
			isApplicable: async () => this.isSmartMotionAlarmApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.SmartAssist.videoResolutionUpscalingSRId,
			isApplicable: async () => this.isVideoResolutionUpscalingSRApplicable(),
		},
		// gaming features
		{
			featureId: AppSearch.FeatureIds.MacroKey.pageId,
			isApplicable: async () => this.isMacroKeyApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.ThermalMode.pageId,
			isApplicable: async () => this.isThermalModeApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.NetworkBoost.pageId,
			isApplicable: async () => this.isNetworkBoostApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.AutoClose.pageId,
			isApplicable: async () => this.isAutoCloseApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.HybridMode.pageId,
			isApplicable: async () => this.isHybridModeApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.OverDrive.pageId,
			isApplicable: async () => this.isOverDriveApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.TouchpadLock.pageId,
			isApplicable: async () => this.isTouchpadLockApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.Lighting.pageId,
			isApplicable: async () => this.isLightingApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.RAMOverClock.pageId,
			isApplicable: async () => this.isRAMOverClockApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.CPUOverClock.pageId,
			isApplicable: async () => this.isCPUOverClockApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.GPUOverClock.pageId,
			isApplicable: async () => this.isGPUOverClockApplicable(),
		},
		{
			featureId: AppSearch.FeatureIds.VRAMOverClock.pageId,
			isApplicable: async () => this.isVRAMOverClockApplicable(),
		}
		// gaming end
	];
	Windows: any;

	constructor(
		private deviceService: DeviceService,
		private hypSettings: HypothesisService,
		private localCacheService: LocalCacheService,
		private systemUpdateService: SystemUpdateService,
		private hardwareScanService: HardwareScanService,
		private logger: LoggerService,
		private vantageShellService: VantageShellService,
		private displayService: DisplayService,
		private batteryService: BatteryDetailService,
		private powerService: PowerService,
		private powerDpmService: PowerDpmService,
		private cameraFeedService: CameraFeedService,
		private audioService: AudioService,
		private inputAccessoriesService: InputAccessoriesService,
		private smartAssistService: SmartAssistService,
		private topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService,
		private backlightService: BacklightService
	) {
		this.detectionFuncMap = mapValues(
			keyBy(this.detectionFuncList, 'featureId'),
			'isApplicable'
		);
		this.Windows = this.vantageShellService.getWindows();
	}

	public async isFeatureApplicable(featureId: string) {
		if (!this.detectionFuncMap[featureId]) {
			return false;
		}

		try {
			return this.mergeDuplicateInvocationById(featureId, () =>
				this.detectionFuncMap[featureId]()
			);
		} catch (ex) {
			this.logger.error(`check applicable error:${JSON.stringify(featureId)}: ${ex.message}`);
		}

		return false;
	}

	private isDashboardApplicable() {
		return !this.deviceService.isGaming;
	}

	private isSystemUpdateApplicable() {
		return this.systemUpdateService.isSystemUpdateEnabled();
	}

	private isMySecurityApplicable() {
		const segment = this.localCacheService.getLocalCacheValue(LocalStorageKey.LocalInfoSegment);
		if (
			(SegmentConstHelper.includedInCommonConsumer(segment) ||
				segment === SegmentConst.SMB) &&
			!this.deviceService.isArm &&
			!this.deviceService.isSMode
		) {
			return true;
		}
		return false;
	}

	private isAntiVirusApplicable() {
		const segment: SegmentConst = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.LocalInfoSegment
		);
		if (
			!this.deviceService.isArm &&
			!this.deviceService.isSMode &&
			!this.deviceService.isGaming &&
			segment !== SegmentConst.Commercial
		) {
			return true;
		}
		return false;
	}

	private isPasswordHealthAndVpnSecurityApplicable() {
		const locale = this.deviceService.machineInfo.locale;
		const segment: SegmentConst = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.LocalInfoSegment
		);
		if (
			toLower(locale) !== 'cn' &&
			!this.deviceService.isArm &&
			!this.deviceService.isSMode &&
			!this.deviceService.isGaming &&
			segment !== SegmentConst.Commercial
		) {
			return true;
		}
		return false;
	}

	private isWifiSecurityApplicable() {
		const wsCacheState = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityShowWifiSecurity
		);
		if (!this.deviceService.isArm && !this.deviceService.isSMode && wsCacheState) {
			return true;
		}
		return false;
	}

	private async isHomeSecurityApplicable() {
		const locale = this.deviceService.machineInfo.locale;
		const country = this.deviceService.machineInfo.country;
		const chsHypsis = await this.hypSettings
			.getFeatureSetting('ConnectedHomeSecurity')
			.then((result) => (result || '').toString() === 'true');
		const chsAvailability =
			country.toLowerCase() === 'us' && locale.startsWith('en') && chsHypsis;
		const segment: SegmentConst = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.LocalInfoSegment
		);
		if (
			chsAvailability &&
			!this.deviceService.isArm &&
			!this.deviceService.isSMode &&
			!this.deviceService.isGaming &&
			segment !== SegmentConst.Commercial
		) {
			return true;
		}
		return false;
	}

	private async isSmartPerformanceApplicable() {
		if (this.hypSettings) {
			return this.hypSettings.getFeatureSetting('SmartPerformance').then(
				(result) => (result || '').toString().toLowerCase() === 'true',
				() => false
			);
		}
		return false;
	}

	private isHardwareScanApplicable() {
		return this.hardwareScanService.isAvailable();
	}

	private async isCameraSettingsApplicable() {
		const deviceInformation = this.Windows?.Devices.Enumeration.DeviceInformation;
		const deviceClass = this.Windows?.Devices.Enumeration.DeviceClass;
		let frontCameraCount = 0;
		const panel = this.Windows.Devices.Enumeration.Panel.front;
		const devices = await deviceInformation.findAllAsync(deviceClass.videoCapture);
		devices.forEach((cameraDeviceInfo) => {
			if (
				cameraDeviceInfo.enclosureLocation !== null &&
				cameraDeviceInfo.enclosureLocation.panel === panel
			) {
				frontCameraCount = frontCameraCount + 1;
			}
		});
		if (frontCameraCount <= 0) {
			return false;
		}
		const cameraSettingsRes = await this.displayService.getCameraSettingsInfo();
		if (!cameraSettingsRes) {
			return false;
		}
		return true;
	}

	private async mergeDuplicateInvocationById(funcId: string, func: () => Promise<any>) {
		const invokeCache: any = this.invokeCache;
		if (!invokeCache[funcId]) {
			invokeCache[funcId] = func();
		}

		let applicable;
		try {
			applicable = await invokeCache[funcId];
		} finally {
			invokeCache[funcId] = null;
		}

		return applicable;
	}

	private async isBatteryInformationApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType === MachineType.IdeaPad || machineType === MachineType.ThinkPad) {
			const result = (await this.batteryService.getBatteryDetail()) as any;
			return result.batteryInformation?.length > 0;
		}

		return false;
	}

	private async isAcAdapterStatusApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType !== MachineType.ThinkPad) {
			return false;
		}

		const result = (await this.batteryService.getBatteryDetail()) as any;
		return result.batteryIndicatorInfo?.acAdapterStatus?.toLowerCase() !== 'notsupported';
	}

	private async isSmartStandByApplicable() {
		return await this.powerService.getSmartStandbyCapability();
	}

	private async isAlwaysOnUsbApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType === MachineType.IdeaPad) {
			const resultForIdea = await this.powerService.getAlwaysOnUSBStatusIdeaNoteBook();
			return resultForIdea?.available;
		} else if (machineType === MachineType.ThinkPad) {
			return await this.powerService.getAlwaysOnUSBCapabilityThinkPad();
		}

		return false;
	}

	private async isAirplanePowerModeIdApplicable() {
		return await this.powerService.getAirplaneModeCapabilityThinkPad();
	}

	private async isbatteryChargeThresholdApplicable() {
		const resuls = await this.powerService.getChargeThresholdInfo();
		return resuls.filter((thresholdInfo) => thresholdInfo.isCapable).length > 0;
	}

	private async isITSSettingsApplicable() {
		const capability = await this.powerService.getITSModeForICIdeapad();
		return capability?.available;
	}

	private async isDynamicThermalControlApplicable() {
		const dmDriverStatus = await this.powerService.getPMDriverStatus();
		if (!dmDriverStatus) {
			return false;
		}

		const itsStatus = await this.powerService.getITSServiceStatus();
		if (!itsStatus) {
			return true; // DYTC 3.0
		}

		const dytcVersion = await this.powerService.getDYTCRevision();
		return dytcVersion >= 4;
	}

	private async isExtraPowerModeSettingApplicable() {
		const dmDriverStatus = await this.powerService.getPMDriverStatus();
		if (!dmDriverStatus) {
			return false;
		}

		const itsStatus = await this.powerService.getITSServiceStatus();
		if (!itsStatus) {
			return false;
		}

		const dytverion = await this.powerService.getDYTCRevision();
		if (dytverion < 6) {
			return false;
		}

		const amtCapability = await this.powerService.getAMTCapability();
		if (amtCapability) {
			return false;
		}

		return await this.powerService.isMobileWorkStation();
	}

	private async isEasyResumeApplicable() {
		return await this.powerService.getEasyResumeCapabilityThinkPad();
	}

	private async isEnergyStarApplicable() {
		return await this.powerService.getEnergyStarCapability();
	}

	private async isConservationModeStatusApplicable() {
		return (await this.powerService.getConservationModeStatusIdeaNoteBook())?.available;
	}

	private async isRapidChargeModeStatusApplicable() {
		const capability = await this.powerService.getRapidChargeModeStatusIdeaNoteBook();
		return capability?.available;
	}

	private async isPowerPlanManagementApplicable() {
		const brand = this.deviceService.machineInfo.brand?.toLowerCase();
		const subBrand = this.deviceService.machineInfo.subBrand?.toLowerCase();

		if (
			(brand === 'think' || brand === 'lenovo') &&
			(subBrand === 'thinkcentre' || subBrand === 'thinkcenter')
		) {
			const capability = await this.powerDpmService.getAllPowerPlansObs();
			return Boolean(capability);
		}

		return false;
	}

	private async isFlipToBootCapabilityApplicable() {
		const capability = await this.powerService.getFlipToStartCapability();
		return (
			capability.Supported &&
			(capability.Supported as any) !== FlipToStartSupportedEnum.Fail.toString()
		);
	}

	private async isVantageToolBarStatusApplicable() {
		const capability = await this.powerService.getVantageToolBarStatus();
		return capability?.available;
	}

	private async isPrivacyGuardApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType === MachineType.IdeaPad) {
			return false;
		}

		return await this.displayService.getPrivacyGuardCapability();
	}

	private async isTrackPointSettingsApplicable() {
		return await this.inputAccessoriesService.getMouseCapability();
	}

	private async isSmartKeyboardBacklightApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType === MachineType.ThinkPad) {
			return await this.inputAccessoriesService.getAutoKBDBacklightCapability();
		}

		if (machineType === MachineType.IdeaPad) {
			return await this.isIdeaKdbBacklightApplicable();
		}

		return false;
	}

	private async isHiddenKeyboardFunctionApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType === MachineType.ThinkPad) {
			const capability = await this.inputAccessoriesService.GetAllCapability();
			return capability?.keyboardMapCapability;
		}

		return false;
	}

	private async isVoIPHotkeyFunctionApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType === MachineType.IdeaPad) {
			return false;
		}

		const capability = await this.inputAccessoriesService.getVoipHotkeysSettings();
		return capability?.capability;
	}

	private async isTopRowKeyFunctionsApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType === MachineType.IdeaPad) {
			const capabilityItems = await this.topRowFunctionsIdeapadService
				.requestCapability()
				.toPromise();

			const result = capabilityItems.find(
				(item) => item.key === 'FnLock' && item.value === 'True'
			);

			return Boolean(result);
		}

		return await this.inputAccessoriesService.getTopRowFnLockCapability();
	}

	private async isUserDefinedKeyApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType === MachineType.ThinkPad) {
			const capability = await this.inputAccessoriesService.GetAllCapability();
			return capability?.uDKCapability;
		}

		return false;
	}

	private async isFnAndCtrlkeySwapApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType !== MachineType.IdeaPad) {
			return await this.inputAccessoriesService.GetFnCtrlSwapCapability();
		}

		return false;
	}

	private async isActiveProtectionSystemApplicable() {
		const apsCapability = await this.smartAssistService.getAPSCapability();
		if (!apsCapability) {
			return false;
		}

		const hddStatus = await this.smartAssistService.getHDDStatus();
		if (hddStatus < 1) {
			return false;
		}

		return await this.smartAssistService.getSensorStatus();
	}

	private async isIntelligentSensingApplicable() {
		return await this.smartAssistService.getIntelligentScreenVisibility();
	}

	private async isZeroTouchLoginApplicable() {
		return await this.smartAssistService.getZeroTouchLoginVisibility();
	}

	private async isZeroTouchLockApplicable() {
		return await this.smartAssistService.getZeroTouchLockVisibility();
	}

	private async isZeroTouchVideoPlaybackApplicable() {
		const capability = await this.smartAssistService.getVideoPauseResumeStatus();
		return capability?.available;
	}

	private async isSmartMotionAlarmApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType !== MachineType.IdeaPad) {
			return false;
		}

		const capability = await this.smartAssistService.getAntiTheftStatus();
		return capability?.available;
	}

	private async isVideoResolutionUpscalingSRApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType !== MachineType.IdeaPad) {
			return false;
		}

		const capability = await this.smartAssistService.getSuperResolutionStatus();
		return capability?.available;
	}

	private async isOLEDPowerSettingsApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType === MachineType.IdeaPad) {
			return false;
		}

		return this.displayService.getOLEDPowerControlCapability();
	}

	private async isBacklightApplicable() {
		const machineType = await this.deviceService.getMachineType();
		if (machineType === MachineType.ThinkPad) {
			return await this.inputAccessoriesService.getKBDBacklightCapability();
		}

		if (machineType === MachineType.IdeaPad) {
			return await this.isIdeaKdbBacklightApplicable();
		}

		return false;
	}

	private async isIdeaKdbBacklightApplicable() {
		const backlightStatus = await this.backlightService.backlight.toPromise();
			if (!backlightStatus || backlightStatus.length < 1) {
				return false;
			}

			const noCapability = backlightStatus.find(
				(item) =>
					item.key === 'KeyboardBacklightLevel' &&
					item.value === BacklightLevelEnum.NO_CAPABILITY
			);

			return Boolean(!noCapability);
	}

	// Version 3.7 app search for gaming
	private isMacroKeyApplicable() {
		return this.deviceService.isGaming && this.localCacheService.getLocalCacheValue(LocalStorageKey.macroKeyFeature, false);
	}
	private isThermalModeApplicable() {
		const thermalModeVersion = this.localCacheService.getLocalCacheValue(LocalStorageKey.thermalModeVersion, 0);
		const thermalModeFeatureInfo = this.localCacheService.getLocalCacheValue(LocalStorageKey.smartFanFeature, false);
		return this.deviceService.isGaming && (thermalModeVersion === 2 || thermalModeVersion === 4 || thermalModeVersion === 1) && thermalModeFeatureInfo;
	}
	private isNetworkBoostApplicable() {
		return this.deviceService.isGaming && this.localCacheService.getLocalCacheValue(LocalStorageKey.networkBoostFeature, false);
	}
	private isAutoCloseApplicable() {
		return this.deviceService.isGaming && this.localCacheService.getLocalCacheValue(LocalStorageKey.optimizationFeature, false);
	}
	private isHybridModeApplicable() {
		return this.deviceService.isGaming && this.localCacheService.getLocalCacheValue(LocalStorageKey.hybridModeFeature, false);
	}
	private isOverDriveApplicable() {
		return this.deviceService.isGaming && this.localCacheService.getLocalCacheValue(LocalStorageKey.overDriveFeature, false);
	}
	private isTouchpadLockApplicable() {
		return this.deviceService.isGaming && this.localCacheService.getLocalCacheValue(LocalStorageKey.touchpadLockFeature, false);
	}
	private isLightingApplicable() {
		return this.deviceService.isGaming && this.localCacheService.getLocalCacheValue(LocalStorageKey.ledSetFeature, false);
		// && this.localCacheService.getLocalCacheValue(LocalStorageKey.ledDriver, false);
	}
	private isRAMOverClockApplicable() {
		return this.deviceService.isGaming && this.localCacheService.getLocalCacheValue(LocalStorageKey.memOCFeature, false);
	}
	private isCPUOverClockApplicable() {
		const cpuOCFeatureInfo = this.localCacheService.getLocalCacheValue(LocalStorageKey.cpuOCFeature, false);
		return this.deviceService.isGaming && cpuOCFeatureInfo;
	}
	private isGPUOverClockApplicable() {
		const gpuOCFeatureInfo = this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuCoreOCFeature, false);
		return this.deviceService.isGaming && gpuOCFeatureInfo;
	}
	private isVRAMOverClockApplicable() {
		const vramOCFeatureInfo = this.localCacheService.getLocalCacheValue(LocalStorageKey.gpuVramOCFeature, false);
		return this.deviceService.isGaming && vramOCFeatureInfo;
	}
	// gaming end
}
