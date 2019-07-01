import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	OnDestroy,
	NgZone,
	ViewChild,
	ElementRef,
	AfterViewInit
} from '@angular/core';




import {FeatureStatus} from 'src/app/data-models/common/feature-status.model';
import {DashboardService} from 'src/app/services/dashboard/dashboard.service';
import {CommonService} from 'src/app/services/common/common.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {AppNotification} from 'src/app/data-models/common/app-notification.model';
import {DeviceMonitorStatus} from 'src/app/enums/device-monitor-status.enum';
import {SessionStorageKey} from 'src/app/enums/session-storage-key-enum';
import {DisplayService} from 'src/app/services/display/display.service';
import {DeviceService} from 'src/app/services/device/device.service';
import {WidgetSwitchIconComponent} from '../widget-switch-icon/widget-switch-icon.component';

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
	@ViewChild('camera')
	camera: WidgetSwitchIconComponent;
	@ViewChild('microphone')
	microphone: WidgetSwitchIconComponent;
	@ViewChild('eyecare')
	eyecare: WidgetSwitchIconComponent;
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
		this.getQuickSettingStatus();
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		this.stopMonitorForCamera();
		this.deviceService.stopMicrophoneMonitor();
	}

	//#region private functions
	// DeviceMonitorStatus
	private onNotification(notification: AppNotification) {
		if (notification) {
			const {type, payload} = notification;
			switch (type) {
				case DeviceMonitorStatus.MicrophoneStatus:
					console.log('DeviceMonitorStatus.MicrophoneStatus', payload);
					this.ngZone.run(() => {
						this.microphoneStatus.status = payload.muteDisabled;
						this.microphoneStatus.permission = payload.permission;
					});
					break;
				case DeviceMonitorStatus.CameraStatus:
					this.camera.isLoading = false;
					this.cameraStatus.permission = payload;
					break;
				default:
					break;
			}
		}
	}

	private getQuickSettingStatus() {
		const microphone = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardMicrophone);
		if (microphone) {
			this.microphoneStatus = microphone;
			if (microphone.available) {
				this.deviceService.startMicrophoneMonitor();
			}
		} else {
			this.getMicrophoneStatus();
		}
		this.displayService.startMonitorForCameraPermission();
		const privacy = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy);
		if (privacy) {
			this.cameraStatus = privacy;
			this.getCameraPermission();
		} else {
			this.getCameraPermission();
			this.getCameraStatus();

		}

		this.initEyecaremodeSettings();
	}

	public getCameraPermission() {
		try {
			if (this.displayService.isShellAvailable) {
				this.camera.isLoading = true;
				this.displayService.getCameraSettingsInfo()
					.then((result) => {
						this.camera.isLoading = false;
						console.log('getCameraPermission.then', result);
						if (result) {
							this.cameraStatus.permission = result.permission;
							this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, this.cameraStatus);
						}
					}).catch(error => {
					console.error('getCameraPermission', error);
				});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	public initEyecaremodeSettings() {
		try {
			if (this.displayService.isShellAvailable) {
				this.eyecare.isLoading = true;
				this.displayService.initEyecaremodeSettings()
					.then((result: boolean) => {
						this.eyecare.isLoading = false;
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

	private getCameraStatus() {
		try {
			if (this.dashboardService.isShellAvailable) {
				if (this.cameraStatus.permission) {
					this.camera.isLoading = true;
				}
				this.dashboardService
					.getCameraStatus()
					.then((featureStatus: FeatureStatus) => {
						this.camera.isLoading = false;
						console.log('getCameraStatus.then', featureStatus);
						this.cameraStatus = featureStatus;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, featureStatus);
						// if privacy available then start monitoring
						if (featureStatus.available) {
							this.startMonitorForCamera();
						}
					})
					.catch(error => {
						console.error('getCameraStatus', error);
					});
			}
		} catch(error) {
			this.camera.isLoading = false;
			console.error(error.message);
		}
	}

	startMonitorHandlerForCamera(value: FeatureStatus) {
		console.log('startMonitorHandlerForCamera', value);
		this.camera.isLoading = false;
		this.cameraStatus = value;
		this.cameraStatus.available = value.available;
		this.cameraStatus.status=value.permission;
		this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, this.cameraStatus);
	}

	startMonitorForCamera() {
		console.log('startMonitorForCamera');
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.startCameraPrivacyMonitor(this.startMonitorHandlerForCamera.bind(this))
					.then((val) => {
						console.log('startMonitorForCamera.then', val);

					}).catch(error => {
					console.error('startMonitorForCamera', error);
				});
			}
		} catch (error) {
			console.log('startMonitorForCamera', error);
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
					this.commonService.setSessionStorageValue(SessionStorageKey.DashboardMicrophone, featureStatus);
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
					this.commonService.setSessionStorageValue(SessionStorageKey.DashboardEyeCareMode, featureStatus);
				})
				.catch(error => {
					console.error('getEyeCareMode', error);
				});
		}
	}

	//#endregion

	public onCameraStatusToggle($event: boolean) {
		this.camera.isLoading = true;
		this.quickSettingsWidget[1].state = false;
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setCameraStatus($event)
					.then((value: boolean) => {
						console.log('getCameraStatus.then', value, $event);
						this.camera.isLoading = false;
						this.cameraStatus.status = $event;
						this.quickSettingsWidget[1].state = true;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, this.cameraStatus);
					}).catch(error => {
						this.camera.isLoading = false;
					this.quickSettingsWidget[1].state = true;
					console.error('getCameraStatus', error);
				});
			}
		} catch (error) {
			this.camera.isLoading = false;
			this.quickSettingsWidget[1].state = true;
			console.log('onCameraStatusToggle', error);
		}
	}

	public onMicrophoneStatusToggle($event: boolean) {
		this.microphone.isLoading = true;
		this.quickSettingsWidget[0].state = false;
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setMicrophoneStatus($event)
					.then((value: boolean) => {
						this.microphone.isLoading = false;
						console.log('setMicrophoneStatus.then', value, $event);
						this.microphoneStatus.status = $event;
						this.quickSettingsWidget[0].state = true;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardMicrophone, this.microphoneStatus);
					}).catch(error => {
					this.microphone.isLoading = false;
					this.quickSettingsWidget[0].state = true;
					console.error('setMicrophoneStatus', error);
				});
			}
		} catch (error) {
			this.microphone.isLoading = false;
			this.quickSettingsWidget[0].state = true;
			console.log('onMicrophoneStatusToggle', error);
		}
	}

	public onEyeCareModeToggle($event: boolean) {
		this.eyecare.isLoading = true;
		this.quickSettingsWidget[2].state = false;
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setEyeCareMode($event)
					.then((value: boolean) => {

						console.log('setEyeCareMode.then', value, $event);
						this.eyecare.isLoading = false;
						this.eyeCareModeStatus.status = $event;
						this.quickSettingsWidget[2].state = true;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardEyeCareMode, this.eyeCareModeStatus);
					}).catch(error => {

					this.eyecare.isLoading = false;
					this.quickSettingsWidget[2].state = true;
					console.error('setEyeCareMode', error);
				});
			}
		} catch (error) {
			this.eyecare.isLoading = false;
			this.quickSettingsWidget[2].state = true;
			console.log('onEyeCareModeToggle', error);
		}
	}



}
