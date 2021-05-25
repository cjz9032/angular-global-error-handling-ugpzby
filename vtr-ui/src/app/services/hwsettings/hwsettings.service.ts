import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { Microphone } from 'src/app/data-models/hwsettings/hwsettings.model';
import { DolbyModeResponse } from 'src/app/data-models/hwsettings/hwsettings.model';
import { MicrophoneOptimizeModes } from 'src/app/data-models/hwsettings/hwsettings.model';
import { EventEmitter, Injectable, Output, OnDestroy } from '@angular/core';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
import { CommonService } from '../common/common.service';
import { DevService } from '../dev/dev.service';
import { BatteryDetail } from 'src/app/data-models/hwsettings/hwsettings.model';
import { Observable, BehaviorSubject, EMPTY, from, Subject } from 'rxjs';
import { PowerPlan } from 'src/app/data-models/hwsettings/hwsettings.model';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { AllPowerPlans } from 'src/app/data-models/hwsettings/hwsettings.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from '../logger/logger.service';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { VoipResponse } from 'src/app/data-models/hwsettings/hwsettings.model';
import { AntiTheftResponse } from 'src/app/data-models/hwsettings/hwsettings.model';
import { SuperResolutionResponse } from 'src/app/data-models/hwsettings/hwsettings.model';
import { HsaIntelligentSecurityResponse } from 'src/app/data-models/hwsettings/hwsettings.model';
import { ChargeThreshold } from 'src/app/data-models/hwsettings/hwsettings.model';
import { PowerService } from '../power/power.service';
import {
	CapabilityTemp,
	FnLockStatus,
	PrimaryKeySetting,
	TopRowFunctionsIdeapad,
} from 'src/app/data-models/hwsettings/hwsettings.model';
import {
	// CommonErrorCode,
	// CommonResponse,
	// NumberBoolean,
	StringBoolean,
} from '../../data-models/common/common.interface';
import {
	Backlight,
	BacklightLevel,
	BacklightMode,
	BacklightStatus,
	GetBacklightResponse,
} from 'src/app/data-models/hwsettings/hwsettings.model';

@Injectable({
	providedIn: 'root',
})
export class AudioService {
	private microphone: any;
	private dolby: any;
	private smartSettings: any;
	public isShellAvailable = false;
	constructor(shellService: VantageShellService) {
		this.microphone = shellService.getMicrophoneSettings();
		this.dolby = shellService.getDolbySettings();
		this.smartSettings = shellService.getSmartSettings();
		if (this.microphone && this.dolby && this.smartSettings) {
			this.isShellAvailable = true;
		}
	}

	setDolbyAudioProfileState(key, value) {
		try {
			if (this.isShellAvailable) {
				return this.dolby.setDolbyAudioProfileState(key, value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setDolbyAudioState(value) {
		try {
			if (this.isShellAvailable) {
				return this.dolby.setProfileState(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setMicrophoneVolume(volumn: number): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicrophoneVolume(volumn);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// TODO: We need to remove this as we have to use dashboard.setMicphoneStatus
	setMicophoneOnMute(isAvailable: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicophoneMute(isAvailable);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setDolbyOnOff(onOff: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.smartSettings.absFeature.setDolbyFeatureStatus(onOff);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getDolbyFeatureStatus(): Promise<FeatureStatus> {
		try {
			if (this.isShellAvailable) {
				return this.smartSettings.absFeature.getDolbyFeatureStatus();
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setMicrophoneAutoOptimization(onOff: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicrophoneAutoOptimization(onOff);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setSuppressKeyboardNoise(onOff: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicrophoneKeyboardNoiseSuppression(onOff);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setMicrophoneAEC(onOff: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicrophoneAEC(onOff);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// getMicrophoneSettings(): Promise<Microphone> {
	// 	try {
	// 		if (this.isShellAvailable) {
	// 			return this.microphone.getMicrophoneSettings();
	// 		}
	// 		return undefined;
	// 	} catch (error) {
	// 		throw new Error(error.message);
	// 	}
	// }

	getDolbyMode(): Promise<DolbyModeResponse> {
		try {
			if (this.isShellAvailable) {
				return this.dolby.getDolbyMode();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setDolbyMode(mode: string): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.dolby.setDolbyMode(mode);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// getSupportedModes(): Promise<MicrophoneOptimizeModes> {
	// 	try {
	// 		if (this.isShellAvailable) {
	// 			return this.microphone.getSupportedModes();
	// 		}
	// 		return undefined;
	// 	} catch (error) {
	// 		throw new Error(error.message);
	// 	}
	// }

	setMicrophoneOpitimaztion(mode: string): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.setMicrophoneOpitimaztion(mode);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	startMicrophoneMonitor(handler: any): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.startMonitor(handler);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	stopMicrophoneMonitor(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.stopMonitor();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	startMonitorForDolby(handler: any): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.dolby.startMonitor(handler);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	stopMonitorForDolby(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.dolby.stopMonitor();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getMicrophoneSettingsAsync(handler: any): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.microphone.getMicrophoneSettingsAsync(handler);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

@Injectable({
	providedIn: 'root',
})
export class DisplayService {
	displayEyeCareMode: any;
	cameraPrivacyStatus: any;
	cameraSettings: any;
	private privacyGuardSettings: any;
	oledSettings: any;
	private priorityControl: any;
	public isShellAvailable = false;
	@Output() windowResize: EventEmitter<any> = new EventEmitter();

	loading = 0;
	windowWidth = 0;
	windowHeight = 0;

	constructor(
		private devService: DevService,
		shellService: VantageShellService,
		private commonService: CommonService
	) {
		this.displayEyeCareMode = shellService.getEyeCareMode();
		if (this.displayEyeCareMode) {
			this.isShellAvailable = true;
		}
		this.cameraPrivacyStatus = shellService.getCameraPrivacy();
		if (this.cameraPrivacyStatus) {
			this.isShellAvailable = true;
		}
		this.cameraSettings = shellService.getCameraSettings();
		if (this.cameraSettings) {
			this.isShellAvailable = true;
		}

		this.privacyGuardSettings = shellService.getPrivacyGuardObject();
		if (this.privacyGuardSettings) {
			this.isShellAvailable = true;
		}

		this.oledSettings = shellService.getOledSettings();
		if (this.oledSettings) {
			this.isShellAvailable = true;
		}

		this.priorityControl = shellService.getPriorityControl();
		if (this.priorityControl) {
			this.isShellAvailable = true;
		}
	}

	startLoading() {
		this.devService.writeLog('START LOADING');
		this.loading++;
	}

	endLoading() {
		this.devService.writeLog('END LOADING');
		this.loading--;
		if (this.loading < 0) {
			this.loading = 0;
		}
	}

	clearLoading() {
		this.loading = 0;
	}

	calcSize(service) {
		service.windowWidth = window.outerWidth;
		service.windowHeight = window.outerHeight;
		this.windowResize.emit();
		this.devService.writeLog('CALC SIZE', service.windowWidth, service.windowHeight);
	}

	resizeWindow() {
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 100);
	}

	windowResizeListener() {
		return this.windowResize;
	}
	public getEyeCareModeState(): Promise<FeatureStatus> {
		if (this.displayEyeCareMode) {
			return this.displayEyeCareMode.getEyeCareModeState();
		}
		return undefined;
	}
	public getCameraPrivacyModeState(): Promise<FeatureStatus> {
		if (this.cameraPrivacyStatus) {
			return this.cameraPrivacyStatus.getCameraPrivacyStatus();
		}
		return undefined;
	}

	public startCameraPrivacyMonitor(callback: any): Promise<FeatureStatus> {
		try {
			if (this.cameraPrivacyStatus) {
				return this.cameraPrivacyStatus.startMonitor(callback);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public stopCameraPrivacyMonitor(): Promise<FeatureStatus> {
		try {
			if (this.cameraPrivacyStatus) {
				return this.cameraPrivacyStatus.stopMonitor();
			}

			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setEyeCareModeState(value: boolean): Promise<any> {
		try {
			if (this.displayEyeCareMode) {
				return this.displayEyeCareMode.setEyeCareMode(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public setCameraPrivacyModeState(value: boolean): Promise<boolean> {
		if (this.cameraPrivacyStatus) {
			return this.cameraPrivacyStatus.setCameraPrivacyStatus(value);
		}
		return undefined;
	}
	public getCameraSettingsInfo(): Promise<any> {
		try {
			if (this.cameraSettings) {
				return this.cameraSettings.getCameraSettings();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setCameraBrightness(value: number): Promise<boolean> {
		if (this.cameraSettings) {
			return this.cameraSettings.setCameraBrightness(value);
		}
		return undefined;
	}
	public setCameraContrast(value: number): Promise<boolean> {
		if (this.cameraSettings) {
			return this.cameraSettings.setCameraContrast(value);
		}
		return undefined;
	}
	public setCameraAutoExposure(value: boolean): Promise<boolean> {
		if (this.cameraSettings) {
			return this.cameraSettings.setCameraAutoExposure(value);
		}
		return undefined;
	}
	public setCameraExposureValue(value: number): Promise<boolean> {
		if (this.cameraSettings) {
			return this.cameraSettings.setCameraExposure(value);
		}
		return undefined;
	}
	public setCameraAutoFocus(value: number): Promise<boolean> {
		if (this.cameraSettings) {
			return this.cameraSettings.setCameraAutoFocus(value);
		}
		return undefined;
	}
	public resetCameraSettings(): Promise<boolean> {
		if (this.cameraSettings) {
			return this.cameraSettings.resetCameraSettings();
		}
		return undefined;
	}
	public getDisplayColorTemperature(): Promise<any> {
		if (this.displayEyeCareMode) {
			return this.displayEyeCareMode.getDisplayColortemperature();
		}
		return undefined;
	}
	public setDisplayColorTemperature(value: number): Promise<boolean> {
		if (this.displayEyeCareMode) {
			return this.displayEyeCareMode.setDisplayColortemperature(value);
		}
		return undefined;
	}
	public resetEyeCareMode(): Promise<any> {
		if (this.displayEyeCareMode) {
			return this.displayEyeCareMode.resetEyeCareMode();
		}
		return undefined;
	}
	public setEyeCareAutoMode(value: boolean): Promise<any> {
		if (this.displayEyeCareMode) {
			return this.displayEyeCareMode.setEyeCareAutoMode(value);
		}
		return undefined;
	}
	public getEyeCareAutoMode(): Promise<any> {
		if (this.displayEyeCareMode) {
			return this.displayEyeCareMode.getEyeCareAutoModeState();
		}
		return undefined;
	}

	// Start Day Time Color Temperature Settings
	public getDaytimeColorTemperature(): Promise<FeatureStatus> {
		if (this.displayEyeCareMode) {
			return this.displayEyeCareMode.getDaytimeColorTemperature();
		}
		return undefined;
	}

	public setDaytimeColorTemperature(value: number): Promise<boolean> {
		if (this.displayEyeCareMode) {
			return this.displayEyeCareMode.setDaytimeColorTemperature(value);
		}
		return undefined;
	}

	public resetDaytimeColorTemperature(): Promise<any> {
		if (this.displayEyeCareMode) {
			return this.displayEyeCareMode.resetDaytimeColorTemperature();
		}
		return undefined;
	}

	// End Day Time Color Temperature Settings

	// Start Privacy Guard Settings
	public getPrivacyGuardCapability(): Promise<any> {
		if (this.privacyGuardSettings) {
			return this.privacyGuardSettings.getPrivacyGuardCapability();
		}
		return undefined;
	}

	public getPrivacyGuardOnPasswordCapability(): Promise<any> {
		if (this.privacyGuardSettings) {
			return this.privacyGuardSettings.getPrivacyGuardOnPasswordCapability();
		}
		return undefined;
	}

	public getPrivacyGuardStatus(): Promise<any> {
		if (this.privacyGuardSettings) {
			return this.privacyGuardSettings.getPrivacyGuardStatus();
		}
		return undefined;
	}

	public getPrivacyGuardOnPasswordStatus(): Promise<any> {
		if (this.privacyGuardSettings) {
			return this.privacyGuardSettings.getPrivacyGuardOnPasswordStatus();
		}
		return undefined;
	}

	public setPrivacyGuardStatus(value): Promise<any> {
		if (this.privacyGuardSettings) {
			return this.privacyGuardSettings.setPrivacyGuardStatus(value);
		}
		return undefined;
	}

	public setPrivacyGuardOnPasswordStatus(value): Promise<any> {
		if (this.privacyGuardSettings) {
			return this.privacyGuardSettings.setPrivacyGuardOnPasswordStatus(value);
		}
		return undefined;
	}

	// End Privacy Guard Settings

	public statusChangedLocationPermission(handler: any) {
		try {
			if (this.isShellAvailable) {
				this.displayEyeCareMode.statusChangedLocationPermission(handler);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public startEyeCareMonitor(handler: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.displayEyeCareMode.startMonitor(handler);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public startMonitorForCameraPermission() {
		try {
			if (this.isShellAvailable) {
				return this.cameraSettings.startMonitor((response: any) => {
					if (response.permission !== undefined) {
						this.commonService.sendNotification(
							DeviceMonitorStatus.CameraStatus,
							response.permission
						);
					}
				});
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public stopMonitorForCameraPermission() {
		try {
			if (this.isShellAvailable) {
				return this.cameraSettings.stopMonitor((response: boolean) => {});
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public stopEyeCareMonitor() {
		if (this.isShellAvailable) {
			return this.displayEyeCareMode.stopMonitor((response: boolean) => {
				// this.commonService.sendNotification(DeviceMonitorStatus.MicrophoneStatus, response);
			});
		}
	}

	public openPrivacyLocation() {
		if (this.isShellAvailable) {
			this.displayEyeCareMode.openPrivacyLocation();
		}
	}
	public initEyecaremodeSettings(): Promise<boolean> {
		if (this.displayEyeCareMode) {
			return this.displayEyeCareMode.initEyecaremodeSettings();
		}
		return undefined;
	}
	public getOLEDPowerControlCapability(): Promise<boolean> {
		if (this.oledSettings) {
			// this.oledSettings = this.shellService.getOledSettings();
			return this.oledSettings.getOLEDPowerControlCapability();
		}
		return undefined;
	}

	public getTaskbarDimmerSetting(): Promise<any> {
		if (this.oledSettings) {
			return this.oledSettings.getTaskbarDimmerSetting();
		}
		return undefined;
	}

	public getBackgroundDimmerSetting(): Promise<any> {
		if (this.oledSettings) {
			return this.oledSettings.getBackgroundDimmerSetting();
		}
		return undefined;
	}

	public getDisplayDimmerSetting(): Promise<any> {
		if (this.oledSettings) {
			return this.oledSettings.getDisplayDimmerSetting();
		}
		return undefined;
	}

	public setTaskbarDimmerSetting(value: string): Promise<boolean> {
		if (this.oledSettings) {
			// console.log('this.setTaskbarDimmerSetting', this.oledSettings);
			return this.oledSettings.setTaskbarDimmerSetting(value);
		}
		return undefined;
	}

	public setBackgroundDimmerSetting(value: string): Promise<boolean> {
		if (this.oledSettings) {
			// console.log('this.setBackgroundDimmerSetting', this.oledSettings);
			return this.oledSettings.setBackgroundDimmerSetting(value);
		}
		return undefined;
	}

	public setDisplayDimmerSetting(value: string): Promise<boolean> {
		if (this.oledSettings) {
			// console.log('this.setDisplayDimmerSetting', this.oledSettings);
			return this.oledSettings.setDisplayDimmerSetting(value);
		}
		return undefined;
	}

	resetEyecaremodeAllSettings() {
		return this.displayEyeCareMode.resetEyecaremodeAllSettings();
	}

	public getPriorityControlCapability(): Promise<any> {
		if (this.priorityControl) {
			return this.priorityControl.GetCapability();
		}
		return undefined;
	}

	public getPriorityControlSetting(): Promise<string> {
		if (this.priorityControl) {
			return this.priorityControl.GetPriorityControlSetting();
		}
		return undefined;
	}

	public setPriorityControlSetting(value: string): Promise<boolean> {
		if (this.priorityControl) {
			return this.priorityControl.SetPriorityControlSetting(value);
		}
		return undefined;
	}
}

@Injectable({
	providedIn: 'root',
})
export class BatteryDetailService {
	isBatteryModalShown = false;
	isAcAttached: boolean;
	gaugePercent: number;
	remainingPercentages: number[] = [];
	isPowerDriverMissing: boolean;
	isGaugeResetRunning: boolean;
	isInvalidBattery: boolean;
	isTemporaryChargeMode: boolean;
	isDlsPiCapable: boolean;
	currentOpenModal: string;
	chargeThresholdInfo = new BehaviorSubject([new ChargeThreshold()]);
	airplaneModeSubject = new BehaviorSubject(new FeatureStatus(false, false));
	expressChargingSubject = new BehaviorSubject(new FeatureStatus(false, false));
	setGaugeResetSectionSubject = new BehaviorSubject(false);
	isShellAvailable = false;
	private readonly battery: any;

	constructor(
		shellService: VantageShellService,
		private logger: LoggerService,
		private powerService: PowerService,
		private localCacheService: LocalCacheService,
		private commonService: CommonService
	) {
		this.battery = shellService.getBatteryInfo();
		if (this.battery) {
			this.isShellAvailable = true;
		}
	}

	// move this method to here from CommonService,
	// the feature related logic should not included in CommonService
	checkPowerPageFlagAndHide() {
		// Solution to fix the issue VAN-14826.
		const isPowerPageAvailable = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.IsPowerPageAvailable,
			true
		);
		if (!isPowerPageAvailable) {
			this.commonService.sendNotification(LocalStorageKey.IsPowerPageAvailable, {
				available: isPowerPageAvailable,
				link: false,
			});
		}
	}

	getBatteryDetail(): Promise<BatteryDetail[]> {
		try {
			if (this.isShellAvailable) {
				return this.battery.getBatteryInformation();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public startMonitor(handler: any) {
		try {
			if (this.isShellAvailable) {
				this.battery.startBatteryMonitor(handler);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public stopMonitor() {
		if (this.isShellAvailable) {
			this.battery.stopBatteryMonitor(() => {});
		}
	}

	public getChargeThresholdInfo() {
		return this.chargeThresholdInfo.asObservable();
	}

	public getAirplaneMode() {
		return this.airplaneModeSubject.asObservable();
	}

	public getExpressCharging() {
		return this.expressChargingSubject.asObservable();
	}

	public getBatterySettings() {
		const isThinkPad =
			this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineType) === 1;
		if (isThinkPad) {
			this.getBatteryThresholdInformation();
			this.getAirplaneModeCapabilityThinkPad();
		} else {
			// this.getConservationModeStatusIdeaPad();
			this.getRapidChargeModeStatusIdeaPad();
		}
	}

	public getBatteryThresholdInformation(): Promise<any> {
		this.logger.info('Before getBatteryThresholdInformation');
		if (this.powerService.isShellAvailable) {
			return this.powerService
				.getChargeThresholdInfo()
				.then((response) => {
					this.logger.info('getBatteryThresholdInformation.then', response);
					this.chargeThresholdInfo.next(response);
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.BatteryChargeThresholdCapability,
						response
					);
				})
				.catch((error) => {
					this.logger.error('getBatteryThresholdInformation :: error', error.message);
					return EMPTY;
				});
		}
	}

	private getAirplaneModeCapabilityThinkPad() {
		this.logger.info('Before getAirplaneModeCapabilityThinkPad.then ');
		if (this.powerService.isShellAvailable) {
			this.powerService
				.getAirplaneModeCapabilityThinkPad()
				.then((value) => {
					this.logger.info('getAirplaneModeCapabilityThinkPad.then ==>', value);
					if (value) {
						this.getAirplaneModeThinkPad();
					} else {
						const airplaneMode = new FeatureStatus(false, false);
						this.airplaneModeSubject.next(airplaneMode);
					}
				})
				.catch((error) => {
					this.logger.error(
						'getAirplaneModeCapabilityThinkPad Error ==> ',
						error.message
					);
					return EMPTY;
				});
		}
	}

	private getAirplaneModeThinkPad() {
		if (this.powerService.isShellAvailable) {
			this.powerService
				.getAirplaneModeThinkPad()
				.then((value: any) => {
					this.logger.info('getAirplaneModeThinkPad.then', value);
					const airplaneMode = new FeatureStatus(true, value);
					this.airplaneModeSubject.next(airplaneMode);
				})
				.catch((error) => {
					this.logger.error('getAirplaneModeThinkPad', error.message);
					return EMPTY;
				});
		}
	}

	private getRapidChargeModeStatusIdeaPad() {
		this.logger.info('Before getRapidChargeModeStatusIdeaNoteBook');
		if (this.powerService.isShellAvailable) {
			this.powerService
				.getRapidChargeModeStatusIdeaNoteBook()
				.then((featureStatus) => {
					this.logger.info('getRapidChargeModeStatusIdeaNoteBook.then', featureStatus);
					const expressCharging = new FeatureStatus(
						featureStatus.available,
						featureStatus.status
					);
					this.expressChargingSubject.next(expressCharging);
				})
				.catch((error) => {
					this.logger.error('getRapidChargeModeStatusIdeaNoteBook', error.message);
					return EMPTY;
				});
		}
	}
}

@Injectable({
	providedIn: 'root',
})
export class PowerDpmService implements OnDestroy {
	private devicePowerDPM: any;
	private allPowerPlansSubject: BehaviorSubject<AllPowerPlans>;
	private currentPowerPlanObs: Observable<PowerPlan>;
	private allPowerPlansCache: AllPowerPlans;
	private refreshInterval;
	private currentRequestId = 0;

	constructor(
		private loggerService: LoggerService,
		private shellService: VantageShellService,
		private localCacheService: LocalCacheService
	) {
		this.devicePowerDPM = this.shellService.getPowerDPM();
	}
	ngOnDestroy(): void {
		if (this.refreshInterval) {
			clearInterval(this.refreshInterval);
			this.refreshInterval = null;
		}
	}
	getAllPowerPlansObs(): Observable<AllPowerPlans> {
		if (!this.allPowerPlansSubject) {
			const localCacheVal = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.DPMAllPowerPlans,
				null
			);
			this.allPowerPlansCache = JSON.parse(localCacheVal);
			this.allPowerPlansSubject = new BehaviorSubject<AllPowerPlans>(this.allPowerPlansCache);
			this.startRefreshPowerPlans();
		}
		return this.allPowerPlansSubject.pipe(
			map((allPowerPlans) => this.preprocessAllPowerPlans(allPowerPlans))
		);
	}

	private preprocessAllPowerPlans(allPowerPlans: AllPowerPlans): AllPowerPlans {
		if (allPowerPlans) {
			allPowerPlans.powerPlanList.forEach((p) => {
				p.settingList.forEach((s) => {
					switch (s.key) {
						case 'PowerPlan':
							p.powerPlanName = s.value;
							break;
						case 'PreDefined':
							p.preDefined = s.value === 'SystemDefined';
							break;
						case 'HDDTimeoutAC':
							p.hddTimeoutAC = Number(s.value);
							break;
						case 'HiberTimeoutAC':
							p.hiberTimeoutAC = Number(s.value);
							break;
						case 'SuspendTimeoutAC':
							p.suspendTimeoutAC = Number(s.value);
							break;
						case 'VideoTimeoutAC':
							p.videoTimeoutAC = Number(s.value);
							break;
						case 'Performance':
							p.performance = Number(s.value);
							break;
						case 'Temperature':
							p.temperature = Number(s.value);
							break;
						case 'PowerUsage':
							p.powerUsage = Number(s.value);
							break;
						case 'CPUSpeed':
							p.cpuSpeed = s.value;
							break;
						case 'Brightness':
							p.brightness = Number(s.value);
							break;
						default:
							break;
					}
				});
			});
		}

		return allPowerPlans;
	}

	private startRefreshPowerPlans() {
		if (this.refreshInterval) {
			clearInterval(this.refreshInterval);
			this.refreshInterval = null;
		}
		this.getAllPowerPlans();
		this.refreshInterval = setInterval(() => {
			this.getAllPowerPlans();
		}, 30000);
	}

	private getAllPowerPlans() {
		if (this.devicePowerDPM) {
			const requestId = new Date().getTime();
			this.currentRequestId = requestId;
			this.loggerService.info('DPM getAllPowerPlans, requestId:' + requestId);
			this.devicePowerDPM.getAllPowerPlans().then((response) => {
				// response = this.mockResponse;
				this.resolveCommonResponse(response, requestId);
			});
		}
	}

	private resolveCommonResponse(response: any, requestId: number) {
		if (response && this.currentRequestId === requestId) {
			if (this.allPowerPlansSubject) {
				this.loggerService.info(
					'DPM resolveCommonResponse notify UI to refresh, requestId:' +
						requestId +
						',currentRequestId:' +
						this.currentRequestId
				);
				this.allPowerPlansSubject.next(response);
			}
			this.updateCache(response);
		}
	}

	private updateCache(allPowerPlans) {
		if (allPowerPlans) {
			const localCacheVal = JSON.stringify(allPowerPlans);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.DPMAllPowerPlans,
				localCacheVal
			);
			this.allPowerPlansCache = allPowerPlans;
		}
	}
}

@Injectable({
	providedIn: 'root',
})
export class CameraFeedService {
	private _stream: MediaStream;
	public isShellAvailable = false;
	private cameraBlur: any;

	constructor(shellService: VantageShellService) {
		this.cameraBlur = shellService.getCameraBlur();

		if (this.cameraBlur) {
			this.isShellAvailable = true;
		}
	}

	public getCameraBlurSettings(): Promise<any> {
		if (this.cameraBlur) {
			return this.cameraBlur.getCameraBlurSettings();
		}
		return undefined;
	}

	public setCameraBlurSettings(isEnabling: boolean, mode: string): Promise<any> {
		if (this.cameraBlur) {
			if (mode === '') {
				const enable = isEnabling ? '1' : '0';
				return this.cameraBlur.setCameraBlurSettings(true, enable);
			} else {
				return this.cameraBlur.setCameraBlurSettings(false, mode);
			}
		}
		return undefined;
	}
}

@Injectable({
	providedIn: 'root',
})
export class InputAccessoriesService {
	keyboardManager: any;
	isShellAvailable = false;
	keyboard;
	private mouseAndTouchPad: any;
	private voipHotkeys;

	constructor(shellService: VantageShellService) {
		this.voipHotkeys = shellService.getVoipHotkeysObject();
		this.keyboardManager = shellService.getKeyboardManagerObject();
		this.mouseAndTouchPad = shellService.getMouseAndTouchPad();
		this.keyboard = shellService.getKeyboardObject();
		if (this.keyboardManager) {
			this.isShellAvailable = true;
		}
		if (this.keyboard) {
			this.isShellAvailable = true;
		}
	}

	setUserDefinedKeySetting(
		type: string,
		actionType: string,
		settingKey: string,
		settingValue: string
	): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.setUserDefinedKeySetting(
					type,
					actionType,
					settingKey,
					settingValue
				);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	StartSpecialKeyMonitor(installDirectory: string): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.StartSpecialKeyMonitor(installDirectory);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	EndSpecialKeyMonitor(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.EndSpecialKeyMonitor();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	Initialize(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.Initialize();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	AddApplicationOrFiles(selectedUDK: string, appSelectorType: string): Promise<any> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.AddApplicationOrFiles(selectedUDK, appSelectorType);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	DeleteUDKApplication(udkType: string, itemId: string, displayName: string): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.DeleteUDKApplication(udkType, itemId, displayName);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	//  Check Keyboard UDK Compatability Status and KeyboardMapCapability
	GetAllCapability(): Promise<any> {
		try {
			if (this.keyboardManager) {
				const value = this.keyboardManager.GetAllCapability();
				return value;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	//  Get the UDKTypeList
	GetUDKTypeList(): Promise<any> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetUDKTypeList();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKeyboardVersion(): Promise<string> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetKeyboardVersion();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKBDLayoutName(): Promise<any> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKBDLayoutName();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKBDMachineType(): Promise<any> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKBDMachineType();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKbdHiddenKeyPrivacyFilterCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKbdHiddenKeyPrivacyFilterCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKbdHiddenKeyBackLightCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKbdHiddenKeyBackLightCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKbdHiddenKeyMagnifierCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKbdHiddenKeyMagnifierCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetKbdHiddenKeyPerformanceModeCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetKbdHiddenKeyPerformanceModeCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// End  Hidden keyboard keys

	// Start Top Row Function keys

	getTopRowFnLockCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetTopRowFnLockCapability();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getTopRowFnStickKeyCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetTopRowFnStickKeyCapability();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getTopRowPrimaryFunctionCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetTopRowPrimaryFunctionCapability();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getFnLockStatus(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetFnLockStatus();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getFnStickKeyStatus(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetFnStickKeyStatus();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getPrimaryFunctionStatus(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.GetPrimaryFunctionStatus();
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setFnStickKeyStatus(value): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.SetFnStickKey(value);
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setFnLock(value): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.SetFnLock(value);
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	setPrimaryFunction(value): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				const response = this.keyboardManager.SetPrimaryFunction(value);
				return response;
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// FnCtrlSwap feature start here
	// fnCtrlSwap & fnAsCtrl features hidden in 3.2.001
	GetFnCtrlSwapCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnCtrlSwapCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetFnCtrlSwap() {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnCtrlSwap();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	SetFnCtrlSwap(value) {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.SetFnCtrlSwap(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// FnCtrlSwap feature end here

	GetFnAsCtrlCapability(): Promise<boolean> {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnAsCtrlCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	GetFnAsCtrl() {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.GetFnAsCtrl();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	SetFnAsCtrl(value) {
		try {
			if (this.keyboardManager) {
				return this.keyboardManager.SetFnCtrlSwap(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// FnAsCtrl feature end here

	getMouseCapability(): Promise<boolean> {
		try {
			if (this.mouseAndTouchPad) {
				return this.mouseAndTouchPad.GetMouseCapability();
			}
			return Promise.resolve(false);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getTouchPadCapability(): Promise<boolean> {
		try {
			if (this.mouseAndTouchPad) {
				return this.mouseAndTouchPad.GetTouchpadCapability();
			}
			return Promise.resolve(false);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// Voiphotkeys Feature
	getVoipHotkeysSettings(): Promise<VoipResponse> {
		try {
			if (this.voipHotkeys) {
				return this.voipHotkeys.getVOIPHotkeysSettings();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setVoipHotkeysSettings(selectedApp: number): Promise<VoipResponse> {
		try {
			if (this.voipHotkeys) {
				return this.voipHotkeys.setVOIPHotkeysSettings(selectedApp);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// Start of Keyboard backlight thinkpad model
	getAutoKBDBacklightCapability(): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.GetAutoKBDBacklightCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getKBDBacklightCapability(): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.GetKBDBacklightCapability();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getAutoKBDStatus(): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.GetAutoKBDStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getKBDBacklightStatus(): Promise<string> {
		try {
			if (this.keyboard) {
				return this.keyboard.GetKBDBacklightStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getKBDBacklightLevel(): Promise<string> {
		try {
			if (this.keyboard) {
				return this.keyboard.GetKBDBacklightLevel();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setKBDBacklightStatus(level: string): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.SetKBDBacklightStaus(level);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setAutomaticKBDBacklight(level: boolean): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.SetAutomaticKBDBacklight(level);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setAutoKBDEnableStatus(): Promise<boolean> {
		try {
			if (this.keyboard) {
				return this.keyboard.SetAutoKBDEnableStatus(true);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	// End of Keyboard backlight thinkpad model

	// To Restart Windows
	restartMachine() {
		this.keyboardManager.RestartMachine();
	}
}

@Injectable({
	providedIn: 'root',
})
export class SmartAssistService {
	private intelligentSensing;
	private intelligentMedia;
	private activeProtectionSystem;
	private lenovoVoice;
	private superResolution;
	private antiTheft;
	public windows;
	private hsaIntelligentSecurity;
	private hpdAdvancedSettings = {
		zeroTouchLoginAdvanced: false,
		zeroTouchLockAdvanced: false,
	};

	public isShellAvailable = false;
	public isHPDShellAvailable = false;
	public isAPSavailable = false;
	private shellVersion: string;

	constructor(shellService: VantageShellService) {
		this.intelligentSensing = shellService.getIntelligentSensing();
		this.intelligentMedia = shellService.getIntelligentMedia();
		this.activeProtectionSystem = shellService.getActiveProtectionSystem(); // getting APS Object from //vantage-shell.service
		this.lenovoVoice = shellService.getLenovoVoice();
		this.superResolution = shellService.getSuperResolution();
		this.hsaIntelligentSecurity = shellService.getHsaIntelligentSecurity();
		// this.shellVersion = commonService.getShellVersion();
		this.antiTheft = shellService.getAntiTheft();
		this.windows = shellService.getWindows();
		this.activeProtectionSystem ? (this.isAPSavailable = true) : (this.isAPSavailable = false);
		if (
			this.intelligentSensing &&
			this.intelligentMedia &&
			this.lenovoVoice &&
			this.superResolution
		) {
			this.isShellAvailable = true;
		}
		if (this.hsaIntelligentSecurity) {
			//means can connect to vantage shell with rpc
			this.isHPDShellAvailable = true;
		}
	}

	//#region HPD section

	/**
	 * IdeaPad Only : User Presence Sensing global toggle can be shown on UI
	 */
	// public getHPDVisibilityInIdeaPad(): Promise<boolean> {
	// 	// HPD global switch status. true means show, false means hide
	// 	return this.intelligentSensing.GetHPDCapability();
	// }

	/**
	 * ThinkPad Only : User Presence Sensing global toggle can be shown on UI
	 */
	public getHPDVisibility(): Promise<boolean> {
		// HPD global switch status. true means show, false means hide
		return this.intelligentSensing.GetHPDCapability();
	}

	/**
	 * User Presence Sensing global toggle enable/disable state on UI,
	 */
	public getHPDStatus(): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		return this.intelligentSensing.GetHPDGlobalSetting();
	}

	/**
	 * set value for global HPD setting
	 */
	public setHPDStatus(value: boolean): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		const option = value ? 'True' : 'False';
		return this.intelligentSensing.SetHPDGlobalSetting(option);
	}

	public getZeroTouchLockVisibility(): Promise<boolean> {
		// Get Auto Screen Lock section visibility
		return this.intelligentSensing.GetHPDLeaveCapability();
	}

	public getZeroTouchLockStatus(): Promise<boolean> {
		// Get Auto Screen Lock setting
		return this.intelligentSensing.GetHPDPresentLeaveSetting();
	}

	// Get Sensitivity Visibility
	public getHPDLeaveSensitivityVisibility(): Promise<boolean> {
		return this.intelligentSensing.GetHPDLeaveSensitivityVisibility();
	}

	// Get HPDLeave Sensitivity
	public getHPDLeaveSensitivity(): Promise<boolean> {
		return this.intelligentSensing.GetHPDLeaveSensitivity();
	}

	// Set HPDLeave Sensitivity Setting
	public SetHPDLeaveSensitivitySetting(value): Promise<boolean> {
		return this.intelligentSensing.SetHPDLeaveSensitivitySetting(value);
	}
	// set auto adjust for IdeaPad models
	public setZeroTouchLockStatus(value: boolean): Promise<boolean> {
		const option = value ? 'True' : 'False';
		return this.intelligentSensing.SetHPDPresentLeaveSetting(option);
	}

	public getZeroTouchLockFacialRecoStatus(): Promise<boolean> {
		return this.intelligentSensing.getLockFacialRecognitionSettings();
	}

	public setZeroTouchLockFacialRecoStatus(value: boolean): Promise<boolean> {
		const option = value ? 'True' : 'False';
		return this.intelligentSensing.setLockFacialRecognitionSettings(option);
	}

	public resetFacialRecognitionStatus(): Promise<boolean> {
		return this.intelligentSensing.resetFacialRecognitionStatus();
	}

	public getZeroTouchLoginVisibility(): Promise<boolean> {
		// Get Auto Screen Lock section visibility
		return this.intelligentSensing.GetHPDApproachCapability();
	}

	public getZeroTouchLoginStatus(): Promise<boolean> {
		// Get Auto Screen Login setting
		return this.intelligentSensing.GetHPDApproachSetting();
	}

	public getZeroTouchLoginDistance(): Promise<number> {
		// Get Auto Screen Login setting
		return this.intelligentSensing.GetHPDApproachDistance();
	}

	/**
	 * Set Zero Touch Login toggle button status,
	 */
	public setZeroTouchLoginStatus(value: boolean): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		const option = value ? 'True' : 'False';
		return this.intelligentSensing.SetHPDApproachSetting(option);
	}

	public getZeroTouchLoginAdjustVisibility(): Promise<number> {
		// Get Auto Screen Login setting
		return this.intelligentSensing.GetHPDAutoAdjustCapability();
	}

	public getZeroTouchLoginAdjustStatus(): Promise<number> {
		// Get Auto Screen Login setting
		return this.intelligentSensing.GetHPDAutoAdjustSetting();
	}

	/**
	 * Set Zero Touch Login toggle button status,
	 */
	public setZeroTouchLoginAdjustStatus(value: boolean): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		const option = value ? 'True' : 'False';
		return this.intelligentSensing.SetHPDAutoAdjustSetting(option);
	}

	/**
	 * Get currently selected lock screen timer value
	 * 1 = Near,
	 * 2 = Middle/Medium,
	 * 3 = Far
	 */
	public setZeroTouchLoginDistance(value: number): Promise<boolean> {
		// HPD global switch status. true means enable, false means disable
		const option = value.toString();
		return this.intelligentSensing.SetHPDApproachDistanceSetting(option);
	}

	/**
	 * Get currently selected lock screen timer value
	 * 1 = Fast,
	 * 2 = Medium,
	 * 3 = Slow
	 */
	public getSelectedLockTimer(): Promise<number> {
		// Get Auto Screen Lock setting
		return this.intelligentSensing.GetHPDLeaveWait();
	}

	/**
	 * Get currently selected lock screen timer value
	 * '1' = Fast
	 * '2' = Medium
	 * '3' = Slow
	 */
	public setSelectedLockTimer(value: string): Promise<boolean> {
		return this.intelligentSensing.SetHPDLeaveWaitSetting(value);
	}

	public getHPDAdvancedSetting() {
		return Promise.resolve(this.hpdAdvancedSettings);
	}

	public setHPDAdvancedSetting(section: string, value: boolean) {
		if (section === 'zeroTouchLogin') {
			this.hpdAdvancedSettings.zeroTouchLoginAdvanced = value;
		} else {
			this.hpdAdvancedSettings.zeroTouchLockAdvanced = value;
		}
		return Promise.resolve(true);
	}

	public getHsaIntelligentSecurityStatus() {
		const intelligentSecurityDate = new HsaIntelligentSecurityResponse(false, false);
		try {
			if (this.isHPDShellAvailable) {
				const obj = JSON.parse(this.hsaIntelligentSecurity.getAllSetting());
				if (obj && obj.errorCode === 0) {
					intelligentSecurityDate.capacity = obj.capacity;
					intelligentSecurityDate.capability = obj.capability;
					intelligentSecurityDate.sensorType = obj.sensorType;
					intelligentSecurityDate.zeroTouchLockDistanceAutoAdjust =
						obj.presenceLeaveDistanceAutoAdjust;
					intelligentSecurityDate.zeroTouchLockDistance = obj.presenceLeaveDistance;
					intelligentSecurityDate.videoAutoPauseResumeVersion =
						obj.videoAutoPauseResumeVersion;
				}
				return Promise.resolve(intelligentSecurityDate);
			}
			return Promise.resolve(intelligentSecurityDate);
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

	public registerHPDRpcCallback() {
		if (this.isHPDShellAvailable) {
			const result = this.hsaIntelligentSecurity.registerCallback();
			return Promise.resolve(result);
		}
		return undefined;
	}

	public unRegisterHPDRpcCallback() {
		if (this.isHPDShellAvailable) {
			const result = this.hsaIntelligentSecurity.unRegisterCallback();
			return Promise.resolve(result);
		}
		return undefined;
	}

	public setZeroTouchLockDistanceSensitivityAutoAdjust(value: boolean): Promise<number> {
		if (this.isHPDShellAvailable) {
			const result = this.hsaIntelligentSecurity.setPresenceLeaveDistanceAutoAdjust(value);
			return Promise.resolve(result);
		}
		return undefined;
	}

	public setZeroTouchLockDistanceSensitivity(value: number): Promise<number> {
		if (this.isHPDShellAvailable) {
			const result = this.hsaIntelligentSecurity.setPresenceLeaveDistance(value);
			return Promise.resolve(result);
		}
		return undefined;
	}

	public resetHSAHPDSetting(): Promise<number> {
		if (this.isHPDShellAvailable) {
			const result = this.hsaIntelligentSecurity.resetAllSetting();
			return Promise.resolve(result);
		}
		return undefined;
	}

	public startMonitorHsaIntelligentSecurityStatus(callback: any): Promise<boolean> {
		if (this.isHPDShellAvailable) {
			this.hsaIntelligentSecurity.onstatusupdated = (data: any) => {
				callback(data);
			};
			return Promise.resolve(true);
		}
		return undefined;
	}

	public resetHPDSetting(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.HPDSettingReset();
		}
		return undefined;
	}

	public getWindowsHelloStatus(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetFacialFeatureRegistered();
		}
		return undefined;
	}

	//#endregion

	//#region Intelligent Media section

	/**
	 * HDP auto video pause
	 */
	public getVideoPauseResumeStatus(): Promise<FeatureStatus> {
		try {
			if (this.isShellAvailable) {
				return this.intelligentMedia.getVideoPauseResumeStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setVideoPauseResumeStatus(value: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.intelligentMedia.setVideoPauseResumeStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public getSuperResolutionStatus(): Promise<SuperResolutionResponse> {
		try {
			if (this.isShellAvailable) {
				return this.superResolution.getSuperResolutionStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public setSuperResolutionStatus(value: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.superResolution.setSuperResolutionStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	//#endregion

	//region Intelligent Sensting (anti theft) section

	public async getAntiTheftStatus(): Promise<AntiTheftResponse> {
		const antiTheftDate = {
			available: false,
			status: false,
			isSupportPhoto: false,
			photoAddress: '',
			cameraPrivacyState: true,
			authorizedAccessState: true,
			alarmOften: 0,
			photoNumber: 5,
		};
		try {
			if (this.isShellAvailable && this.antiTheft !== undefined) {
				const data = this.antiTheft.getMotionAlertSetting();
				const obj = JSON.parse(data);
				if (obj && obj.errorCode === 0) {
					antiTheftDate.available = obj.available;
					antiTheftDate.status = obj.enabled;
					antiTheftDate.isSupportPhoto = obj.cameraAllowed;
					antiTheftDate.photoAddress = obj.photoAddress;
					antiTheftDate.alarmOften = obj.alarmDuration;
					antiTheftDate.photoNumber = obj.photoNumber;
				}
			}
			return Promise.resolve(antiTheftDate);
		} catch (error) {
			return Promise.resolve(antiTheftDate);
		}
	}

	public setAntiTheftStatus(value: boolean): Promise<boolean> {
		if (this.isShellAvailable && this.antiTheft !== undefined) {
			const ret = this.antiTheft.setMotionAlertEnabled(value);
			if (ret === 0) {
				return Promise.resolve(true);
			}
			return Promise.resolve(false);
		}
		return undefined;
	}

	public setAlarmOften(value: number): Promise<boolean> {
		if (this.isShellAvailable && this.antiTheft !== undefined) {
			const ret = this.antiTheft.setMotionAlertAlarmDuration(value);
			if (ret === 0) {
				return Promise.resolve(true);
			}
			return Promise.resolve(false);
		}
		return undefined;
	}

	public setPhotoNumber(value: number): Promise<boolean> {
		if (this.isShellAvailable && this.antiTheft !== undefined) {
			const ret = this.antiTheft.setMotionAlertPhotoNumber(value);
			if (ret === 0) {
				return Promise.resolve(true);
			}
			return Promise.resolve(false);
		}
		return undefined;
	}

	public setAllowCamera(value: boolean): Promise<boolean> {
		if (this.isShellAvailable && this.antiTheft !== undefined) {
			const ret = this.antiTheft.setMotionAlertCameraAllowed(value);
			if (ret === 0) {
				return Promise.resolve(true);
			}
			return Promise.resolve(false);
		}
		return undefined;
	}

	public startMonitorAntiTheftStatus(callback: any): Promise<number> {
		if (this.isShellAvailable && this.antiTheft !== undefined) {
			const ret = this.antiTheft.registerCallback();
			this.antiTheft.onstatusupdated = (data: any) => {
				callback(data);
			};
			return Promise.resolve(ret);
		}
		return undefined;
	}

	public stopMonitorAntiTheftStatus(): Promise<number> {
		if (this.isShellAvailable && this.antiTheft !== undefined) {
			const ret = this.antiTheft.unRegisterCallback();
			return Promise.resolve(ret);
		}
		return undefined;
	}

	//endregion

	//#region Intelligent Sensing (Intelligent screen) section

	public getIntelligentScreenVisibility(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetSmartSensecapability();
		}
		return undefined;
	}

	public getAutoScreenOffVisibility(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetWalkingCapability();
		}
		return undefined;
	}

	public getAutoScreenOffStatus(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetWalkingSetting();
		}
		return undefined;
	}

	public setAutoScreenOffStatus(value: boolean): Promise<boolean> {
		if (this.isShellAvailable) {
			const option = value ? 'True' : 'False';
			return this.intelligentSensing.SetWalkingMode(option);
		}
		return undefined;
	}

	/**
	 * if value returned is true then show note.
	 * API Shell 3.1.6 or older version shell
	 */
	public getAutoScreenOffNoteStatus(): Promise<boolean> {
		if (this.isShellAvailable) {
			// TODO: compare shell version and call respective API when JS Bridge is ready
			// this.shellVersion = this.commonService.getShellVersion();
			return this.intelligentSensing.GetWalkingCautionVisibility();

			// TODO: If Shell 3.2 or newer version shell
			// return this.intelligentSensing.GetWalkingCautionVisibilityByNever();
		}
		return undefined;
	}

	public getReadingOrBrowsingVisibility(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetBrowsingCapability();
		}
		return undefined;
	}

	public getReadingOrBrowsingStatus(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetBrowsingSetting();
		}
		return undefined;
	}

	public setReadingOrBrowsingStatus(value: boolean): Promise<boolean> {
		if (this.isShellAvailable) {
			const option = value ? 'True' : 'False';
			return this.intelligentSensing.setBrowsingMode(option);
		}
		return undefined;
	}

	public getReadingOrBrowsingTime(): Promise<boolean> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetBrowsingTime();
		}
		return undefined;
	}

	public setReadingOrBrowsingTime(value: number): Promise<boolean> {
		if (this.isShellAvailable) {
			const option = value * 60;
			return this.intelligentSensing.SetBrowsingTime(option);
		}
		return undefined;
	}

	//#endregion

	//#region Active Protection System APS
	//  APS Capability
	public getAPSCapability(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getAPSCapability();
		}
		return undefined;
	}
	// APS Sensor(G-Sensor) Capability
	public getSensorStatus(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getSensorStatus();
		}
		return undefined;
	}
	// HDD Status
	public getHDDStatus(): Promise<number> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getHDDStatus();
		}
		return undefined;
	}
	// APS Mode
	public getAPSMode(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getAPSMode();
		}
		return undefined;
	}
	// SET APS MODE
	public setAPSMode(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setAPSMode(value);
		}
		return undefined;
	}
	// Get Sensitivity Level
	public getAPSSensitivityLevel(): Promise<number> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getAPSSensitivityLevel();
		}
		return undefined;
	}
	// Get Sensitivity Level
	public setAPSSensitivityLevel(value: number): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setAPSSensitivityLevel(value);
		}
		return undefined;
	}
	// Get Repetitive Shock
	public getAutoDisableSetting(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getAutoDisableSetting();
		}
		return undefined;
	}
	// Set Repetitive Shock
	public setAutoDisableSetting(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setAutoDisableSetting(value);
		}
		return undefined;
	}
	// GET Manual suspention of APS
	public getSnoozeSetting(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getSnoozeSetting();
		}
		return undefined;
	}
	// SET Manual Suspension of APS
	public setSnoozeSetting(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setSnoozeSetting(value);
		}
		return undefined;
	}
	// GET Snooze value
	public getSnoozeTime(): Promise<number> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getSnoozeTime();
		}
		return undefined;
	}
	// SET Snooze time
	public setSnoozeTime(value: string): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setSnoozeTime(value);
		}
		return undefined;
	}
	// Suspend APS
	public sendSnoozeCommand(value: string): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.sendSnoozeCommand(value);
		}
		return undefined;
	}
	//  Get Pen Capability
	public getPenCapability(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getPenCapability();
		}
		return undefined;
	}
	// Get Touch Capability
	public getTouchCapability(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getTouchCapability();
		}
		return undefined;
	}
	// Get PSensor Capability
	public getPSensorCapability(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getPSensorCapability();
		}
		return undefined;
	}
	// Get Pen Status
	public getPenSetting(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getPenSetting();
		}
		return undefined;
	}
	// Get Pen Delay
	public getPenDelayTime(): Promise<number> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getPenDelayTime();
		}
		return undefined;
	}
	// Get Touch Status
	public getTouchInputSetting(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getTouchInputSetting();
		}
		return undefined;
	}
	// Get PSensor Status
	public getPSensorSetting(): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.getPSensorSetting();
		}
		return undefined;
	}
	// Set Pen settings
	public setPenSetting(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setPenSetting(value);
		}
		return undefined;
	}
	// Set Pen Delay
	public setPenDelayTime(value: number): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setPenDelayTime(value);
		}
		return undefined;
	}
	//  Set Touch settings
	public setTouchInputSetting(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setTouchInputSetting(value);
		}
		return undefined;
	}
	// Set PSensor Settings
	public setPSensorSetting(value: boolean): Promise<boolean> {
		if (this.isAPSavailable) {
			return this.activeProtectionSystem.setPSensorSetting(value);
		}
		return undefined;
	}
	//#endregion

	//#region Start Lenovo Voice
	public isLenovoVoiceAvailable(): Promise<boolean> {
		if (this.lenovoVoice) {
			return this.lenovoVoice.getCapability();
		}
		return undefined;
	}

	public isLenovoVoiceInstalled(): Promise<boolean> {
		if (this.lenovoVoice) {
			return this.lenovoVoice.getInstallStatus();
		}
		return undefined;
	}

	public downloadLenovoVoice(): Promise<string> {
		if (this.lenovoVoice) {
			return this.lenovoVoice.downloadAndInstallVoiceApp();
		}
		return undefined;
	}

	public launchLenovoVoice(): Promise<boolean> {
		if (this.lenovoVoice) {
			return this.lenovoVoice.launchVoiceApp();
		}
		return undefined;
	}
	//#endregion

	public getHPDSensorType(): Promise<number> {
		if (this.isShellAvailable) {
			return this.intelligentSensing.GetHPDSensorType();
		}
		return undefined;
	}
}

const CACHE_SIZE = 1;

@Injectable({
	providedIn: 'root',
})
export class TopRowFunctionsIdeapadService {
	topRowFunctionsIdeaPadFeature: TopRowFunctionsIdeapad;
	private capability$: Observable<CapabilityTemp[]>;
	private primaryKey$: Observable<PrimaryKeySetting>;
	private fnLockStatus$: Observable<FnLockStatus>;

	constructor(private shellService: VantageShellService) {
		this.topRowFunctionsIdeaPadFeature = this.shellService.getTopRowFunctionsIdeapad();
	}

	get capability() {
		if (!this.capability$) {
			this.capability$ = this.requestCapability().pipe(shareReplay(CACHE_SIZE));
		}
		return this.capability$;
	}

	requestCapability(): Observable<CapabilityTemp[]> {
		return from(this.topRowFunctionsIdeaPadFeature.getCapability()).pipe(
			map((res) => res.capabilityList.Items)
		);
	}

	get primaryKey(): Observable<PrimaryKeySetting> {
		if (!this.primaryKey$) {
			this.primaryKey$ = this.requestPrimaryKey().pipe(shareReplay(CACHE_SIZE));
		}
		return this.primaryKey$;
	}

	requestPrimaryKey(): Observable<PrimaryKeySetting> {
		return from(this.topRowFunctionsIdeaPadFeature.getPrimaryKey()).pipe(
			map((res) => res.settingList.setting.find((item) => item.key === 'PrimeKey'))
		);
	}

	get fnLockStatus(): Observable<FnLockStatus> {
		if (!this.fnLockStatus$) {
			this.fnLockStatus$ = this.requestFnLockStatus().pipe(shareReplay(CACHE_SIZE));
		}
		return this.fnLockStatus$;
	}

	requestFnLockStatus(): Observable<FnLockStatus> {
		return from(this.topRowFunctionsIdeaPadFeature.getFnLockStatus()).pipe(
			map((res) => res.settingList.setting.find((item) => item.key === 'FnLock'))
		);
	}

	setFnLockStatus(fnLock: StringBoolean) {
		// Every time set new fnLock status clear the cache.
		this.fnLockStatus$ = null;
		return from(this.topRowFunctionsIdeaPadFeature.setFnLockStatus(fnLock));
	}
}

@Injectable({
	providedIn: 'root',
})
export class BacklightService {
	backlightFeature: Backlight;
	cache$: Observable<Array<BacklightStatus | BacklightLevel>>;
	reload$ = new Subject();

	constructor(private shellService: VantageShellService) {
		this.backlightFeature = this.shellService.getBacklight();
	}

	get backlight(): Observable<Array<BacklightStatus | BacklightLevel>> {
		if (!this.cache$) {
			this.cache$ = this.requestBacklight().pipe(
				takeUntil(this.reload$),
				shareReplay(CACHE_SIZE)
			);
		}
		return this.cache$;
	}

	requestBacklight(): Observable<Array<BacklightStatus | BacklightLevel>> {
		return from(this.backlightFeature.getBacklight()).pipe(
			map((res) => res.settingList.setting)
		);
	}

	forceReload() {
		this.reload$.next();
		this.cache$ = null;
	}

	clearCache() {
		this.cache$ = null;
	}

	setBacklight(mode: BacklightMode) {
		return from(
			this.backlightFeature.setBacklight({
				settingList: [
					{
						setting: [
							{
								key: 'KeyboardBacklightStatus',
								value: mode.value,
							},
						],
					},
				],
			})
		);
	}

	getBacklightOnSystemChange(): Observable<GetBacklightResponse> {
		return new Observable((observer) => {
			this.backlightFeature
				.getBacklightOnSystemChange(
					{
						settingList: [
							{
								setting: [
									{
										key: 'IntermediateResponseDuration',
										value: '00:00:30',
										enabled: 0,
									},
								],
							},
						],
					},
					(response) => {
						observer.next(response.payload);
					}
				)
				.then(
					(response) => {
						observer.next(response);
						observer.complete();
					},
					(result) => {
						if (result.errorcode && result.errorcode === 606) {
							observer.complete();
						} else {
							observer.error(result);
						}
					}
				);

			return () => {};
		});
	}
}
