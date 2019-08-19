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

@Component({
	selector: 'vtr-widget-quicksettings',
	templateUrl: './widget-quicksettings.component.html',
	styleUrls: ['./widget-quicksettings.component.scss']
})
export class WidgetQuicksettingsComponent implements OnInit, OnDestroy {
	public cameraStatus = new FeatureStatus(true, true);
	public microphoneStatus = new FeatureStatus(false, true);
	public eyeCareModeStatus = new FeatureStatus(true, true);
	private notificationSubscription: Subscription;
	public quickSettingsWidget = [
		{
			tooltipText: 'MICROPHONE',
			state: true
		},
		{
			tooltipText: 'CAMERA PRIVACY',
			state: true
		},
		{
			tooltipText: 'EYE CARE MODE',
			state: true
		}
	];

	@Output() toggle = new EventEmitter<{ sender: string; value: boolean }>();

	constructor(
		public dashboardService: DashboardService,
		public displayService: DisplayService,
		private commonService: CommonService,
		private deviceService: DeviceService,
		private ngZone: NgZone) {
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

		const welcomeTutorial: WelcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial, undefined);
		// if welcome tutorial is available and page is 2 then onboarding is completed by user. Load device settings features
		if (welcomeTutorial && welcomeTutorial.page === 2) {
			this.initFeatures();
		}
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		this.stopMonitorForCamera();
		this.deviceService.stopMicrophoneMonitor();
		this.stopEyeCareMonitor();
		this.displayService.stopMonitorForCameraPermission();
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
		this.displayService.startMonitorForCameraPermission();
		this.getCameraPrivacyStatus();
		this.initEyecaremodeSettings();
		this.startEyeCareMonitor();
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
							this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, this.cameraStatus);
							this.cameraStatus.isLoading = false;
						}
					}).catch(error => {
						console.error('getCameraPermission', error);
						this.cameraStatus.isLoading = false;
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	public initEyecaremodeSettings() {
		try {
			if (this.displayService.isShellAvailable) {
				this.eyeCareModeStatus.isLoading = true;
				this.displayService.initEyecaremodeSettings()
					.then((result: boolean) => {
						this.eyeCareModeStatus.isLoading = false;
						console.log('initEyecaremodeSettings.then', result);
						if (result === true) {
							const eyeCare = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardEyeCareMode);
							if (eyeCare) {
								this.eyeCareModeStatus = eyeCare;
							} else {
								this.getEyeCareModeStatus();
							}
						}
					}).catch(error => {
						console.error('initEyecaremodeSettings', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	private getCameraPrivacyStatus() {
		try {
			if (this.dashboardService.isShellAvailable) {
				this.cameraStatus.isLoading = true;
				if (this.cameraStatus.permission) {
					this.cameraStatus.isLoading = true;
				}
				this.dashboardService
					.getCameraStatus()
					.then((featureStatus: FeatureStatus) => {
						this.cameraStatus.isLoading = false;
						console.log('getCameraStatus.then', featureStatus);
						this.cameraStatus = featureStatus;
						this.cameraStatus.available = featureStatus.available;
						this.cameraStatus.status = featureStatus.status;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, featureStatus);
						// if privacy available then start monitoring
						if (featureStatus.available) {
							this.getCameraPermission();
							this.startMonitorForCameraPrivacy();
						}
					})
					.catch(error => {
						console.error('getCameraStatus', error);
					});
			}
		} catch (error) {
			this.cameraStatus.isLoading = false;
			console.error(error.message);
		}
	}

	startMonitorHandlerForCamera(value: FeatureStatus) {
		console.log('startMonitorHandlerForCamera', value);
		// this.cameraStatus = value;
		this.cameraStatus.available = value.available;
		this.cameraStatus.status = value.status;
		this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, this.cameraStatus);
	}

	startMonitorForCameraPrivacy() {
		console.log('startMonitorForCameraPrivacy');
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.startCameraPrivacyMonitor(this.startMonitorHandlerForCamera.bind(this))
					.then((val) => {
						console.log('startMonitorForCameraPrivacy.then', val);

					}).catch(error => {
						console.error('startMonitorForCameraPrivacy', error);
					});
			}
		} catch (error) {
			console.log('startMonitorForCameraPrivacy', error);
		}
	}

	stopMonitorForCamera() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.stopCameraPrivacyMonitor()
					.then((value: any) => {
						console.log('stopMonitorForCamera.then', value);
					}).catch(error => {
						console.error('stopMonitorForCamera', error);
					});
			}
		} catch (error) {
			console.log('stopMonitorForCamera', error);
		}
	}

	private getMicrophoneStatus() {
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService
				.getMicrophoneStatus()
				.then((featureStatus: FeatureStatus) => {
					console.log('getMicrophoneStatus.then', featureStatus);
					this.microphoneStatus = featureStatus;
					// this.commonService.setSessionStorageValue(SessionStorageKey.DashboardMicrophone, featureStatus);
					if (featureStatus.available) {
						this.deviceService.startMicrophoneMonitor();
					}
				})
				.catch(error => {
					console.error('getCameraStatus', error);
				});
		}
	}

	private getEyeCareModeStatus() {
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService
				.getEyeCareMode()
				.then((featureStatus: FeatureStatus) => {
					console.log('getEyeCareMode.then', featureStatus);
					this.eyeCareModeStatus.available = featureStatus.available;
					this.eyeCareModeStatus.status = featureStatus.status;
					// this.commonService.setSessionStorageValue(SessionStorageKey.DashboardEyeCareMode, featureStatus);
				})
				.catch(error => {
					console.error('getEyeCareMode', error);
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
						// this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, this.cameraStatus);
					}).catch(error => {
						this.cameraStatus.isLoading = false;
						this.quickSettingsWidget[1].state = true;
						console.error('getCameraStatus', error);
					});
			}
		} catch (error) {
			this.cameraStatus.isLoading = false;
			this.quickSettingsWidget[1].state = true;
			console.log('onCameraStatusToggle', error);
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
						// this.commonService.setSessionStorageValue(SessionStorageKey.DashboardMicrophone, this.microphoneStatus);
					}).catch(error => {
						this.microphoneStatus.isLoading = false;
						this.quickSettingsWidget[0].state = true;
						console.error('setMicrophoneStatus', error);
					});
			}
		} catch (error) {
			this.microphoneStatus.isLoading = false;
			this.quickSettingsWidget[0].state = true;
			console.log('onMicrophoneStatusToggle', error);
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
						// this.commonService.setSessionStorageValue(SessionStorageKey.DashboardEyeCareMode, this.eyeCareModeStatus);
					}).catch(error => {

						this.eyeCareModeStatus.isLoading = false;
						this.quickSettingsWidget[2].state = true;
						console.error('setEyeCareMode', error);
					});
			}
		} catch (error) {
			this.eyeCareModeStatus.isLoading = false;
			this.quickSettingsWidget[2].state = true;
			console.log('onEyeCareModeToggle', error);
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
					console.error('startEyeCareMonitor', error);
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
}
