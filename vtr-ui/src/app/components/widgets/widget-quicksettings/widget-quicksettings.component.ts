import { Component, OnInit, Output, EventEmitter, OnDestroy, NgZone } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
import { DisplayService } from 'src/app/services/hwsettings/hwsettings.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { Router } from '@angular/router';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { WidgetQuicksettingsNoteInterface } from './widget-quicksettings-note/widget-quicksettings-note.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-widget-quicksettings',
	templateUrl: './widget-quicksettings.component.html',
	styleUrls: ['./widget-quicksettings.component.scss'],
})
export class WidgetQuicksettingsComponent implements OnInit, OnDestroy {
	@Output() toggle = new EventEmitter<{ sender: string; value: boolean }>();

	public cameraStatus = new FeatureStatus(true, false);
	public microphoneStatus = new FeatureStatus(true, false);
	public eyeCareModeStatus = new FeatureStatus(true, false);
	public vantageToolbarStatus = new FeatureStatus(false, true);
	public isOnline: any = true;
	public batteryInfo: any = [];
	public thresholdStatus = false;
	public machineType: any;
	public thresholdLoadingStatus = false;
	public conservationModeStatus = new FeatureStatus(false, true);
	public cameraPrivacyGreyOut = true;
	public microPhoneGreyOut = true;
	public cameraNoAccessNoteShow = false;
	public isCameraPrivacyCacheExist = false;
	public quickSettingsWidget = [
		{
			// tooltipText: 'MICROPHONE',
			state: true,
		},
		{
			// tooltipText: 'CAMERA PRIVACY',
			state: true,
		},
		{
			// tooltipText: 'EYE CARE MODE',
			state: true,
		},
	];
	public microphoneNote: WidgetQuicksettingsNoteInterface = {
		id: 'microphone',
		text: this.translate.instant('dashboard.quickSettings.note.microphoneNote'),
		path: 'ms-settings:privacy-microphone'
	};

	public cameraPrivacyNote: WidgetQuicksettingsNoteInterface = {
		id: 'camera',
		text: this.translate.instant('dashboard.quickSettings.note.cameraPrivacyNote'),
		path: 'ms-settings:privacy-webcam'
	};

	private notificationSubscription: Subscription;
	private Windows: any;
	private windowsObj: any;
	private audioClient: any;
	private audioData: string;
	private microphoneDevice: any;
	private microphnePermissionHandler: any;
	private cameraStatusChangeBySet = false;
	private cameraAccessChangedHandler: any;

	constructor(
		public dashboardService: DashboardService,
		public displayService: DisplayService,
		private commonService: CommonService,
		private logger: LoggerService,
		public deviceService: DeviceService,
		private ngZone: NgZone,
		private localCacheService: LocalCacheService,
		private router: Router,
		private translate: TranslateService,
		vantageShellService: VantageShellService,
	) {
		this.cameraStatus.permission = false;
		this.cameraStatus.isLoading = false;
		this.microphoneStatus.isLoading = false;
		this.Windows = vantageShellService.getWindows();

		if (this.Windows) {
			this.windowsObj = this.Windows.Devices.Enumeration.DeviceAccessInformation.createFromDeviceClass(
				this.Windows.Devices.Enumeration.DeviceClass.videoCapture
			);

			this.microphoneDevice = this.Windows.Devices.Enumeration.DeviceAccessInformation.createFromDeviceClass(
				this.Windows.Devices.Enumeration.DeviceClass.audioCapture
			);
		}
	}

	ngOnInit() {
		this.initDataFromCache();
		this.notificationSubscription = this.commonService.notification.subscribe(
			(response: AppNotification) => {
				this.onNotification(response);
			}
		);

		this.machineType = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.MachineType,
			undefined
		);

		this.isOnline = this.commonService.isOnline;
		if (this.isOnline) {
			const welcomeTutorial: WelcomeTutorial = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.WelcomeTutorial,
				undefined
			);
			// if welcome tutorial is available and page is 2 then onboarding is completed by user. Load device settings features
			if (welcomeTutorial && welcomeTutorial.isDone) {
				this.initFeatures();
			}
		} else {
			this.initFeatures();
		}

		if (this.microphoneDevice) {
			this.microphnePermissionHandler = (args: any) => {
				if (args && args.status != null) {
					switch (args.status) {
						case 0:
						case 1:
							this.updateMicrophoneStatus();
							break;
						case 2:
							this.microphoneStatus.permission = false;
							break;
						case 3:
							this.microphoneStatus.permission = false;
							break;
					}
				}
			};
			this.microphoneDevice.addEventListener(
				'accesschanged',
				this.microphnePermissionHandler,
				false
			);
		}

		if (this.windowsObj) {
			this.cameraAccessChangedHandler = (args: any) => {
				if (args) {
					this.getCameraPrivacyStatus();
				}
			};
			this.windowsObj.addEventListener('accesschanged', this.cameraAccessChangedHandler);
		}
	}

	initDataFromCache() {
		const cameraState: FeatureStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.DashboardCameraPrivacy
		);
		if (cameraState) {
			if (cameraState.permission) {
				this.cameraPrivacyGreyOut = false;
			} else {
				this.cameraNoAccessNoteShow = true;
			}
			this.isCameraPrivacyCacheExist = true;
			this.cameraStatus.available = cameraState.available;
			this.cameraStatus.status = cameraState.status;
			this.cameraStatus.isLoading = false;
			this.cameraStatus.permission = cameraState.permission;
		}
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.audioClient) {
			try {
				this.audioClient.stopMonitor();
			} catch (error) {
				this.logger.error('core audio stop moniotr error ' + error.message);
			}
		} else {
			this.deviceService.stopMicrophoneMonitor();
		}
		this.stopMonitorForCamera();
		this.deviceService.stopMicrophoneMonitor();

		if (this.microphoneDevice) {
			this.microphoneDevice.removeEventListener(
				'accesschanged',
				this.microphnePermissionHandler,
				false
			);
		}

		if (this.windowsObj) {
			this.windowsObj.removeEventListener('accesschanged', this.cameraAccessChangedHandler);
		}
	}

	startMonitorHandlerForCamera(value: FeatureStatus) {
		this.cameraStatus = { ...this.cameraStatus, ...value };
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.DashboardCameraPrivacy,
			this.cameraStatus
		);
	}

	startMonitorForCameraPrivacy() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService
					.startCameraPrivacyMonitor(this.startMonitorHandlerForCamera.bind(this))
					.then((val) => { })
					.catch((error) => {
						this.logger.error('startMonitorForCameraPrivacy', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			return EMPTY;
		}
	}

	stopMonitorForCamera() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService
					.stopCameraPrivacyMonitor()
					.then((value: any) => { })
					.catch((error) => {
						this.logger.error('stopMonitorForCamera', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			return EMPTY;
		}
	}

	onCameraStatusToggle($event: boolean) {
		this.cameraStatus.isLoading = true;
		this.quickSettingsWidget[1].state = false;
		this.cameraStatusChangeBySet = true;
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService
					.setCameraStatus($event)
					.then((value: boolean) => {
						this.cameraStatus.isLoading = false;
						this.cameraStatus.status = $event;
						this.quickSettingsWidget[1].state = true;
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.DashboardCameraPrivacy,
							this.cameraStatus
						);
					})
					.catch((error) => {
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

	onMicrophoneStatusToggle($event: boolean) {
		this.microphoneStatus.isLoading = true;
		this.quickSettingsWidget[0].state = false;
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService
					.setMicrophoneStatus($event)
					.then((value: boolean) => {
						this.microphoneStatus.isLoading = false;
						this.microphoneStatus.status = $event;
						this.quickSettingsWidget[0].state = true;
					})
					.catch((error) => {
						this.microphoneStatus.isLoading = false;
						this.quickSettingsWidget[0].state = true;
						this.logger.error('setMicrophoneStatus', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.microphoneStatus.isLoading = false;
			this.quickSettingsWidget[0].state = true;
			return EMPTY;
		}
	}

	onSystemUpdateToggle($event: boolean) {
		this.router.navigate(['device/system-updates'], { queryParams: { action: 'start' } });
	}

	showMicrophonePermissionNote() {
		return !this.microphoneStatus.isLoading && !this.microphoneStatus.permission && this.microphoneStatus.available;
	}

	showCameraPrivacyPermissionNote() {
		return !this.cameraStatus.isLoading && !this.cameraStatus.permission && !this.cameraPrivacyGreyOut;
	}

	//#region private functions
	// DeviceMonitorStatus
	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case DeviceMonitorStatus.MicrophoneStatus:
					this.logger.info(
						'DeviceMonitorStatus.MicrophoneStatus ' + JSON.stringify(payload)
					);
					this.ngZone.run(() => {
						// microphone payload data is dynamic, need check one by one
						if (payload.hasOwnProperty('muteDisabled')) {
							this.microphoneStatus.status = payload.muteDisabled;
						}
						if (payload.hasOwnProperty('permission')) {
							this.microphoneStatus.permission = payload.permission;
						}
						if (payload.hasOwnProperty('available')) {
							this.microphoneStatus.available = payload.available === true;
						}
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
	}

	private getCameraPrivacyStatus() {
		try {
			if (this.dashboardService.isShellAvailable) {
				if (this.cameraStatus.permission) {
					// this.cameraStatus.isLoading = true;
				}
				this.logger.debug(
					'WidgetQuicksettingsComponent.getCameraPrivacyStatus: invoke Camera Privacy'
				);

				this.dashboardService
					.getCameraStatus()
					.then((featureStatus: FeatureStatus) => {
						this.logger.debug(
							'WidgetQuicksettingsComponent.getCameraPrivacyStatus: response Camera Privacy',
							featureStatus
						);
						this.cameraPrivacyGreyOut = false;
						this.cameraStatus.available = featureStatus.available;
						this.cameraStatus.permission = featureStatus.permission;
						// add for camera privacy cache
						if (!this.cameraStatusChangeBySet) {
							this.cameraStatus.status = featureStatus.status;
						}
						this.cameraStatusChangeBySet = false;
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.DashboardCameraPrivacy,
							this.cameraStatus
						);
						this.startMonitorForCameraPrivacy();
					})
					.catch((error) => {
						this.logger.error(
							'WidgetQuicksettingsComponent.getCameraPrivacyStatus: promise error',
							error.message
						);
					});
			}
		} catch (error) {
			this.cameraStatus.isLoading = false;
			this.logger.error(
				'WidgetQuicksettingsComponent.getCameraPrivacyStatus: exception',
				error.message
			);
			return EMPTY;
		}
	}

	private getMicrophoneStatus() {
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService
				.getMicrophoneStatus()
				.then((featureStatus) => {
					this.microphoneStatus = { ...this.microphoneStatus, ...featureStatus };
					this.microPhoneGreyOut = false;
					if (featureStatus.available) {
						const win: any = window;
						if (win.VantageShellExtension && win.VantageShellExtension.AudioClient) {
							try {
								// const a = performance.now();
								this.audioClient = win.VantageShellExtension.AudioClient.getInstance();
								// const b = performance.now();
								// this.logger.info('audioclient init ' + (b - a) + 'ms');
								if (this.audioClient) {
									this.audioClient.onchangecallback = (data: string) => {
										if (data) {
											if (
												this.audioData &&
												this.audioData.toString() === data
											) {
												return;
											}
											this.logger.info('data data, got it ' + data);
											this.audioData = data;
											const dic = data.split(',');

											if (['1', '0'].includes(dic[0])) {
												const muteDisabled = dic[0] === '0';

												// if (/^\d+$/.test(dic[1])){
												//   const volume = parseInt(dic[1]);
												// }
												this.commonService.sendNotification(
													DeviceMonitorStatus.MicrophoneStatus,
													{ muteDisabled }
												);
											} else {
												this.logger.info('core audio wrong data format');
											}
										}
									};
								}
								this.audioClient.startMonitor();
							} catch (error) {
								this.logger.error(
									'cannot init core audio for widget quick settings' +
									error.message
								);
							}
						} else {
							this.logger.info('current shell version maybe not support core audio');
						}
					}
				})
				.catch((error) => {
					this.logger.error('getMicrophoneStatus', error.message);
					return EMPTY;
				});
		}
	}

	//#endregion
	private updateMicrophoneStatus() {
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService
				.getMicrophoneStatus()
				.then((featureStatus: any) => {
					this.microphoneStatus = { ...this.microphoneStatus, ...featureStatus };
				})
				.catch((error) => {
					this.logger.error('getMicrophoneStatus', error.message);
				});
		}
	}
}
