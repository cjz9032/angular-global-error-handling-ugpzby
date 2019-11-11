import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	OnDestroy,
	NgZone
} from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { DisplayService } from 'src/app/services/display/display.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { PowerService } from 'src/app/services/power/power.service';

@Component({
	selector: 'vtr-widget-quicksettings',
	templateUrl: './widget-quicksettings.component.html',
	styleUrls: ['./widget-quicksettings.component.scss']
})
export class WidgetQuicksettingsComponent implements OnInit, OnDestroy {
	public cameraStatus = new FeatureStatus(true, false);
	public microphoneStatus = new FeatureStatus(false, false);
	public eyeCareModeStatus = new FeatureStatus(true, false);
	public vantageToolbarStatus = new FeatureStatus(false, true);
	private notificationSubscription: Subscription;
	public isOnline: any = true;
	public quickSettingsWidget = [
		{
			// tooltipText: 'MICROPHONE',
			state: true
		},
		{
			// tooltipText: 'CAMERA PRIVACY',
			state: true
		},
		{
			// tooltipText: 'EYE CARE MODE',
			state: true
		}
	];
	private Windows: any;
	private windowsObj: any;

	@Output() toggle = new EventEmitter<{ sender: string; value: boolean }>();

	constructor(
		public dashboardService: DashboardService,
		public displayService: DisplayService,
		private commonService: CommonService,
		private logger: LoggerService,
		private deviceService: DeviceService,
		private ngZone: NgZone,
		public powerService: PowerService,
		private vantageShellService: VantageShellService) {
		this.Windows = vantageShellService.getWindows();
		if (this.Windows) {
			this.windowsObj = this.Windows.Devices.Enumeration.DeviceAccessInformation
				.createFromDeviceClass(this.Windows.Devices.Enumeration.DeviceClass.videoCapture);

			this.windowsObj.addEventListener('accesschanged', () => {
				this.getCameraPrivacyStatus();
			});
		}
	}

	ngOnInit() {
		this.initDataFromCache();
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

		this.isOnline = this.commonService.isOnline;
		if (this.isOnline) {
			const welcomeTutorial: WelcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial, undefined);
			// if welcome tutorial is available and page is 2 then onboarding is completed by user. Load device settings features
			if (welcomeTutorial && welcomeTutorial.page === 2) {
				this.initFeatures();
			}
		} else {
			this.initFeatures();
		}
	}

	initDataFromCache() {
		const cameraState: FeatureStatus = this.commonService.getLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy);
		if (cameraState) {
			this.cameraStatus.available = cameraState.available;
		}
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		this.stopMonitorForCamera();
		this.deviceService.stopMicrophoneMonitor();
		this.stopEyeCareMonitor();
	}

	//#region private functions
	// DeviceMonitorStatus
	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case DeviceMonitorStatus.MicrophoneStatus:
					console.log('DeviceMonitorStatus.MicrophoneStatus', payload);
					this.ngZone.run(() => {
						this.microphoneStatus.status = payload.muteDisabled;
						this.microphoneStatus.permission = payload.permission;
					});
					break;
				case DeviceMonitorStatus.CameraStatus:
					this.cameraStatus.isLoading = false;
					this.cameraStatus.permission = payload;
					break;
				case LocalStorageKey.WelcomeTutorial:
					if (payload.page === 2) {
						this.initFeatures();
					}
					break;
				default:
					break;
			}
		}
	}

	private initFeatures() {
		this.getMicrophoneStatus();
		this.getCameraPrivacyStatus();
		// this.getVantageToolBarStatus();
		// setTimeout(() => {
		// 	this.initEyecaremodeSettings();
		// 	this.startEyeCareMonitor();
		// }, 5);
	}

	public getCameraPermission() {
		try {
			if (this.displayService.isShellAvailable) {
				this.cameraStatus.isLoading = true;
				this.displayService.getCameraSettingsInfo()
					.then((result) => {
						this.cameraStatus.isLoading = false;
						console.log('getCameraPermission.then', result);
						if (result) {
							this.cameraStatus.permission = result.permission;
							this.commonService.setLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy, this.cameraStatus); this.cameraStatus.isLoading = false;
						}
					}).catch(error => {
						this.logger.error('getCameraPermission', error.message);
						this.cameraStatus.isLoading = false;
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getCameraPermission', error.message);
			return EMPTY;
		}
	}

	public initEyecaremodeSettings() {
		try {
			this.eyeCareModeStatus.isLoading = true;
			this.logger.debug('WidgetQuicksettingsComponent.initEyecaremodeSettings: invoke Eye Care Mode');
			this.displayService.initEyecaremodeSettings()
				.then((result: boolean) => {
					this.eyeCareModeStatus.isLoading = false;
					this.logger.debug('WidgetQuicksettingsComponent.initEyecaremodeSettings: response Eye Care Mode', result);
					if (result === true) {
						const eyeCare = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardEyeCareMode);
						if (eyeCare) {
							this.eyeCareModeStatus = eyeCare;
						} else {
							this.getEyeCareModeStatus();
						}
					}
				}).catch(error => {
					this.logger.error('WidgetQuicksettingsComponent.initEyecaremodeSettings: promise error');
				});
		} catch (error) {
			this.logger.error('WidgetQuicksettingsComponent.initEyecaremodeSettings: exception', error.message);
		}
	}

	private getCameraPrivacyStatus() {
		try {
			if (this.dashboardService.isShellAvailable) {
				this.cameraStatus.isLoading = true;
				if (this.cameraStatus.permission) {
					this.cameraStatus.isLoading = true;
				}
				this.logger.debug('WidgetQuicksettingsComponent.getCameraPrivacyStatus: invoke Camera Privacy');

				this.dashboardService
					.getCameraStatus()
					.then((featureStatus: FeatureStatus) => {
						this.cameraStatus.isLoading = false;
						this.logger.debug('WidgetQuicksettingsComponent.getCameraPrivacyStatus: response Camera Privacy', featureStatus);
						this.cameraStatus = featureStatus;
						this.cameraStatus.available = featureStatus.available;
						this.cameraStatus.status = featureStatus.status;
						this.commonService.setLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy, featureStatus);
						// if privacy available then start monitoring
						if (featureStatus.available) {
							this.getCameraPermission();
							this.startMonitorForCameraPrivacy();
						}
					})
					.catch(error => {
						this.logger.error('WidgetQuicksettingsComponent.getCameraPrivacyStatus: promise error', error.message);
					});
			}
		} catch (error) {
			this.cameraStatus.isLoading = false;
			this.logger.error('WidgetQuicksettingsComponent.getCameraPrivacyStatus: exception', error.message);
			return EMPTY;
		}
	}

	startMonitorHandlerForCamera(value: FeatureStatus) {
		console.log('startMonitorHandlerForCamera', value);
		this.cameraStatus.available = value.available;
		this.cameraStatus.status = value.status;
		this.commonService.setLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy, this.cameraStatus);
	}

	startMonitorForCameraPrivacy() {
		console.log('startMonitorForCameraPrivacy');
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.startCameraPrivacyMonitor(this.startMonitorHandlerForCamera.bind(this))
					.then((val) => {
						console.log('startMonitorForCameraPrivacy.then', val);

					}).catch(error => {
						this.logger.error('startMonitorForCameraPrivacy', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			console.log('startMonitorForCameraPrivacy', error.message);
			return EMPTY;
		}
	}

	stopMonitorForCamera() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.stopCameraPrivacyMonitor()
					.then((value: any) => {
						console.log('stopMonitorForCamera.then', value);
					}).catch(error => {
						this.logger.error('stopMonitorForCamera', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			console.log('stopMonitorForCamera', error.message);
			return EMPTY;
		}
	}

	private getMicrophoneStatus() {
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService
				.getMicrophoneStatus()
				.then((featureStatus: FeatureStatus) => {
					console.log('getMicrophoneStatus.then', featureStatus);
					this.microphoneStatus = featureStatus;
					if (featureStatus.available) {
						this.deviceService.startMicrophoneMonitor();
					}
				})
				.catch(error => {
					this.logger.error('getCameraStatus', error.message);
					return EMPTY;
				});
		}
	}

	private getEyeCareModeStatus() {
		if (this.dashboardService.isShellAvailable) {
			this.logger.debug('WidgetQuicksettingsComponent.getEyeCareModeStatus: invoke getEyeCareModeState');
			this.dashboardService
				.getEyeCareMode()
				.then((featureStatus: FeatureStatus) => {
					this.logger.debug('WidgetQuicksettingsComponent.getEyeCareModeStatus: response getEyeCareModeState', featureStatus);
					this.eyeCareModeStatus.available = featureStatus.available;
					this.eyeCareModeStatus.status = featureStatus.status;
					this.eyeCareModeStatus.isLoading = featureStatus.isLoading;
				})
				.catch(error => {
					this.logger.error('WidgetQuicksettingsComponent.getEyeCareModeStatus: promise error');
				});
		}
	}

	//#endregion

	public onCameraStatusToggle($event: boolean) {

		this.cameraStatus.isLoading = true;
		this.quickSettingsWidget[1].state = false;
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setCameraStatus($event)
					.then((value: boolean) => {
						console.log('getCameraStatus.then', value, $event);
						this.cameraStatus.isLoading = false;
						this.cameraStatus.status = $event;
						this.quickSettingsWidget[1].state = true;
						this.commonService.setLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy, this.cameraStatus);
					}).catch(error => {
						this.cameraStatus.isLoading = false;
						this.quickSettingsWidget[1].state = true;
						this.logger.error('getCameraStatus', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.cameraStatus.isLoading = false;
			this.quickSettingsWidget[1].state = true;
			this.logger.error('onCameraStatusToggle', error.message);
			return EMPTY;
		}
	}

	public onMicrophoneStatusToggle($event: boolean) {
		this.microphoneStatus.isLoading = true;
		this.quickSettingsWidget[0].state = false;
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setMicrophoneStatus($event)
					.then((value: boolean) => {
						this.microphoneStatus.isLoading = false;
						console.log('setMicrophoneStatus.then', value, $event);
						this.microphoneStatus.status = $event;
						this.quickSettingsWidget[0].state = true;
					}).catch(error => {
						this.microphoneStatus.isLoading = false;
						this.quickSettingsWidget[0].state = true;
						this.logger.error('setMicrophoneStatus', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.microphoneStatus.isLoading = false;
			this.quickSettingsWidget[0].state = true;
			console.log('onMicrophoneStatusToggle', error.message);
			return EMPTY;
		}
	}

	public onEyeCareModeToggle($event: boolean) {
		this.eyeCareModeStatus.isLoading = true;
		this.quickSettingsWidget[2].state = false;
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setEyeCareMode($event)
					.then((value: boolean) => {

						console.log('setEyeCareMode.then', value, $event);
						this.eyeCareModeStatus.isLoading = false;
						this.eyeCareModeStatus.status = $event;
						this.quickSettingsWidget[2].state = true;
					}).catch(error => {

						this.eyeCareModeStatus.isLoading = false;
						this.quickSettingsWidget[2].state = true;
						this.logger.error('setEyeCareMode', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.eyeCareModeStatus.isLoading = false;
			this.quickSettingsWidget[2].state = true;
			console.log('onEyeCareModeToggle', error.message);
			return EMPTY;
		}
	}

	private getEyeCareModeCallback(response: any) {
		this.eyeCareModeStatus.status = response.eyecaremodeState;
	}

	private startEyeCareMonitor() {
		console.log('start eyecare monitor');
		if (this.displayService.isShellAvailable) {
			this.displayService
				.startEyeCareMonitor(this.getEyeCareModeCallback.bind(this))
				.then((value: any) => {
					console.log('startEyeCareMonitor', value);
				}).catch(error => {
					this.logger.error('startEyeCareMonitor', error.message);
					return EMPTY;
				});

		}
	}

	public stopEyeCareMonitor() {
		console.log('stopEyeCareMonitor');
		if (this.displayService.isShellAvailable) {
			this.displayService
				.stopEyeCareMonitor();
		}
	}
	onClick(path) {
		this.deviceService.launchUri(path);
	}

	public onToolbarStatusToggle($event: boolean) {
		try {
			this.logger.debug('WidgetQuicksettingsComponent.onToolbarStatusToggle: before API call', $event);
			if (this.powerService.isShellAvailable) {
				this.powerService.setVantageToolBarStatus($event)
					.then((value: boolean) => {
						this.logger.debug('WidgetQuicksettingsComponent.onToolbarStatusToggle: API response received', value);
						this.getVantageToolBarStatus();
					}).catch(error => {
						this.logger.error('WidgetQuicksettingsComponent.onToolbarStatusToggle: promise error ', error.message);
					});
			}
		} catch (error) {
			this.logger.error('WidgetQuicksettingsComponent.onToolbarStatusToggle: exception', error.message);
			return EMPTY;
		}
	}

	private async getVantageToolBarStatus() {
		try {
			this.logger.debug('WidgetQuicksettingsComponent.getVantageToolBarStatus: before API call');
			if (this.powerService.isShellAvailable) {
				const featureStatus = await this.powerService.getVantageToolBarStatus();
				this.vantageToolbarStatus = featureStatus;
				this.logger.debug('WidgetQuicksettingsComponent.getVantageToolBarStatus: API response received', featureStatus);
			}
		} catch (error) {
			this.logger.error('WidgetQuicksettingsComponent.getVantageToolBarStatus: promise error ', error.message);
		}
	}
}
