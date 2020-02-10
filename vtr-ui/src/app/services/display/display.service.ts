import { Injectable, Output, EventEmitter } from '@angular/core';
import { DevService } from '../dev/dev.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { CommonService } from '../common/common.service';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
import { WhiteListCapability } from '../../data-models/eye-care-mode/white-list-capability.interface';
@Injectable()
export class DisplayService {
	private displayEyeCareMode: any;
	private cameraPrivacyStatus: any;
	private cameraSettings: any;
	private privacyGuardSettings: any;
	private oledSettings: any;
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
				console.log('this.cameraSettings', this.cameraSettings);
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
	public getDisplayColortemperature(): Promise<any> {
		console.log('inside eycaremode service');
		if (this.displayEyeCareMode) {
			console.log('this.getDisplayColortemperature', this.displayEyeCareMode);
			return this.displayEyeCareMode.getDisplayColortemperature();
		}
		return undefined;
	}
	public setDisplayColortemperature(value: number): Promise<boolean> {
		if (this.displayEyeCareMode) {
			console.log('this.setDisplayColortemperature', this.displayEyeCareMode);
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
			console.log('this.getEyeCareAutoModeState');
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
				console.log(JSON.stringify(this.displayEyeCareMode));
				this.displayEyeCareMode.statusChangedLocationPermission((handler));
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	public startEyeCareMonitor(handler: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.displayEyeCareMode.startMonitor((handler));
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
						this.commonService.sendNotification(DeviceMonitorStatus.CameraStatus, response.permission);
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
				return this.cameraSettings.stopMonitor((response: boolean) => {
					console.log('stopMonitorForCameraPermission', response);
				});
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

	getWhiteListCapability(): Promise<WhiteListCapability> {
		return this.displayEyeCareMode.getWhiteListCapability();
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
