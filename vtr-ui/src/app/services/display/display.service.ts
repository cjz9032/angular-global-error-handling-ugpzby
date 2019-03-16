import { Injectable, Output, EventEmitter } from '@angular/core';
import { DevService } from '../dev/dev.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
@Injectable()
export class DisplayService {
	private displayEyeCareMode: any;
	private cameraPrivacyStatus: any ;
	private cameraSettings: any;

	public isShellAvailable = false;
	@Output() windowResize: EventEmitter<any> = new EventEmitter();

	loading = 0;
	windowWidth = 0;
	windowHeight = 0;

	constructor(
		private devService: DevService,
		shellService: VantageShellService
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
		const delay = setTimeout(function () {
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
	public setEyeCareModeState(value: boolean): Promise<boolean> {
		if (this.displayEyeCareMode) {
			return this.displayEyeCareMode.setEyecareMode(value);
		}
		return undefined;
	}
	public setCameraPrivacyModeState(value: boolean): Promise<boolean> {
		if (this.cameraPrivacyStatus) {
			return this.cameraPrivacyStatus.setCameraPrivacyStatus(value);
		}
		return undefined;
	}
	public getCameraSettingsInfo(): Promise<any> {
		if (this.cameraSettings) {
			console.log('this.cameraSettings', this.cameraSettings);
			return this.cameraSettings.getCameraSettings();
		}
		return undefined;
	}
	public setCameraBrightness(value: number): Promise<boolean> {
		if (this.cameraSettings) {
			return this.cameraSettings.setCameraBrightness(value);
		}
		return undefined;
	}
	public setCameraContrst(value: number): Promise<boolean> {
		if (this.cameraSettings) {
			return this.cameraSettings.setCameraContrast(value);
		}
		return undefined;
	}
	public setCameraAutoExposure(value: number): Promise<boolean> {
		if (this.cameraSettings) {
			return this.cameraSettings.setCameraAutoExposure(value);
		}
		return undefined;
	}
	public setCameraExposureValue(value: number): Promise<boolean> {
		if (this.cameraSettings) {
			return this.cameraSettings.setCameraExposureValue(value);
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
}
