import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { Router, NavigationExtras } from '@angular/router';
import { DeviceService } from 'src/app/services/device/device.service';
import { DisplayService } from 'src/app/services/display/display.service';
import { DropDownInterval } from '../../../../data-models/common/drop-down-interval.model';
import { TranslateService } from '@ngx-translate/core';
import { MetricService } from 'src/app/services/metric/metric.service';

@Component({
	selector: 'vtr-anti-theft',
	templateUrl: './anti-theft.component.html',
	styleUrls: ['./anti-theft.component.scss']
})
export class AntiTheftComponent implements OnInit {
	@Input() antiTheftAvailable = true;
	@Input() isChecked = false;
	@Input() isLoading = true;
	@Input() checkboxDisabled = false;
	@Input() isSupportPhoto = false;
	@Input() cameraPrivacyState = false;
	@Input() authorizedAccessState = false;
	@Input() isShowAuthorized = false;
	@Input() isShowfileAuthorizationTips = false;
	@Input() alarmOften = 10;
	@Input() photoNumber = 5;
	@Input() photoAddress = "";
	@Output() antiTheftToggle: EventEmitter<any> = new EventEmitter();
	@Output() tooltipClick = new EventEmitter<boolean>();

	private DeviceInformation: any;
	private DeviceClass: any;
	private Front: any;
	private mediaCapture: any;
	private Capture: any;

	private windowsObj;
	private cameraAccessChangedHandler: any;
	private storageFolder: any;
	public alarmTimeList: DropDownInterval[];
	public photoNumberList: DropDownInterval[];

	constructor(
		private smartAssist: SmartAssistService,
		private logger: LoggerService,
		private router: Router,
		private deviceService: DeviceService,
		private displayService: DisplayService,
		private translate: TranslateService,
		private metrics: MetricService) {
		if (this.smartAssist.windows) {
			this.DeviceInformation = this.smartAssist.windows.Devices.Enumeration.DeviceInformation;
			this.DeviceClass = this.smartAssist.windows.Devices.Enumeration.DeviceClass;
			this.Front = this.smartAssist.windows.Devices.Enumeration.Panel.front;
			this.Capture = this.smartAssist.windows.Media.Capture;
			this.windowsObj = this.smartAssist.windows.Devices.Enumeration.DeviceAccessInformation
				.createFromDeviceClass(this.smartAssist.windows.Devices.Enumeration.DeviceClass.videoCapture);
			this.storageFolder = this.smartAssist.windows.Storage.StorageFolder;
		}
	}

	ngOnInit() {
		this.getCameraAuthorizedAccessState();
		this.populateAlarmTimeList();
		this.populatePhotoNumberList();
		this.startMonitorCameraAuthorized(this.cameraAuthorizedChange.bind(this));
		this.startMonitorForCameraPrivacy();
		this.startMonitorAntiTheftStatus();
	}

	ngOnDestroy() {
		this.stopMonitorCameraAuthorized();
		this.stopMonitorForCameraPrivacy();
	}

	private populateAlarmTimeList() {
		const time1 = this.translate.instant('device.smartAssist.antiTheft.alarm.option1');
		const time2 = this.translate.instant('device.smartAssist.antiTheft.alarm.option2');
		const time3 = this.translate.instant('device.smartAssist.antiTheft.alarm.option3');
		const time4 = this.translate.instant('device.smartAssist.antiTheft.alarm.option4');
		const time5 = this.translate.instant('device.smartAssist.antiTheft.alarm.option5');
		this.alarmTimeList = [{
			name: time1,
			value: 10,
			placeholder: '',
			text: `${time1}`
		},
		{
			name: time2,
			value: 20,
			placeholder: '',
			text: `${time2}`
		},
		{
			name: time3,
			value: 30,
			placeholder: '',
			text: `${time3}`
		},
		{
			name: time4,
			value: 60,
			placeholder: '',
			text: `${time4}`
		},
		{
			name: time5,
			value: 0,
			placeholder: '',
			text: `${time5}`
		},
		];
	}

	private populatePhotoNumberList() {
		const number1 = this.translate.instant('device.smartAssist.antiTheft.photo.option1');
		const number2 = this.translate.instant('device.smartAssist.antiTheft.photo.option2');
		const number3 = this.translate.instant('device.smartAssist.antiTheft.photo.option3');
		const number4 = this.translate.instant('device.smartAssist.antiTheft.photo.option4');
		const number5 = this.translate.instant('device.smartAssist.antiTheft.photo.option5');
		const number6 = this.translate.instant('device.smartAssist.antiTheft.photo.option6');
		this.photoNumberList = [{
			name: number1,
			value: 5,
			placeholder: '',
			text: `${number1}`
		},
		{
			name: number2,
			value: 10,
			placeholder: '',
			text: `${number2}`
		},
		{
			name: number3,
			value: 15,
			placeholder: '',
			text: `${number3}`
		},
		{
			name: number4,
			value: 20,
			placeholder: '',
			text: `${number4}`
		},
		{
			name: number5,
			value: 25,
			placeholder: '',
			text: `${number5}`
		},
		{
			name: number6,
			value: 30,
			placeholder: '',
			text: `${number6}`
		},
		];
	}

	public onRightIconClick(tooltip: any, $event: any) {
		this.toggleToolTip(tooltip, true);
		this.tooltipClick.emit($event);
	}

	public toggleToolTip(tooltip: any, canOpen = false) {
		if (tooltip) {
			if (tooltip.isOpen()) {
				tooltip.close();
			} else if (canOpen) {
				tooltip.open();
			}
		}
	}

	public setAntiTheftStatus(event: any) {
		this.isChecked = event.switchValue;
		const metricsData = {
			itemParent: 'Device.SmartAssist',
			itemName: 'Smart-motion-alarm.toggle-button',
			value: event.switchValue
		};
		this.metrics.sendMetrics(metricsData);
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.setAntiTheftStatus(event.switchValue)
					.then((value: boolean) => {
						this.logger.info('setAntiTheftStatus.then', value);
					}).catch(error => {
						this.logger.error('setAntiTheftStatus', error.message);
					});
			}
		} catch (error) {
			this.logger.error('setAntiTheftStatus' + error.message);
		}
	}

	public setAlarmOften(value: number) {
		this.antiTheftToggle.emit(value);
		const metricsData = {
			itemParent: 'Device.SmartAssist',
			itemName: 'Smart-motion-alarm.alarm-drop-down',
			value: value
		};
		this.metrics.sendMetrics(metricsData);
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.setAlarmOften(value)
					.then((value: boolean) => {
						this.logger.info('setAlarmOften.then', value);
					}).catch(error => {
						this.logger.error('setAlarmOften', error.message);
					});
			}
		} catch (error) {
			this.logger.error('setAlarmOften' + error.message);
		}
	}

	public setPhotoNumber(value: number) {
		this.antiTheftToggle.emit(value);
		const metricsData = {
			itemParent: 'Device.SmartAssist',
			itemName: 'Smart-motion-alarm.photo-drop-down',
			value: value
		};
		this.metrics.sendMetrics(metricsData);
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.setPhotoNumber(value)
					.then((value: boolean) => {
						this.logger.info('setPhotoNumber.then', value);
					}).catch(error => {
						this.logger.error('setPhotoNumber', error.message);
					});
			}
		} catch (error) {
			this.logger.error('setPhotoNumber' + error.message);
		}
	}

	public setAllowCamera(value: boolean) {
		this.isSupportPhoto = value;
		const metricsData = {
			itemParent: 'Device.SmartAssist',
			itemName: 'Smart-motion-alarm.photo-checkbox',
			value: value
		};
		this.metrics.sendMetrics(metricsData);
		try {
			this.smartAssist.setAllowCamera(value)
				.then((value: boolean) => {
					this.logger.info('setAllowCamera.then', value);
				}).catch(error => {
					this.logger.error('setAllowCamera', error.message);
				});
		} catch (error) {
			this.logger.error('setAllowCamera' + error.message);
		}
	}

	public showCameraPrivacyPage() {
		try {
			const navigationExtras: NavigationExtras = {
				queryParams: { cameraSession_id: 'camera' },
				fragment: 'anchor'
			};
			this.router.navigate(['/device/device-settings/display-camera'], navigationExtras);
		} catch (error) {
			this.logger.error('showCameraPrivacyPage' + error.message);
		}
	}

	public showCameraAuthorizedAccess() {
		try {
			this.deviceService.launchUri('ms-settings:privacy-webcam');
		} catch (error) {
			this.logger.error('showCameraAuthorizedAccess' + error.message);
		}
	}

	async showPhotoFolder(photoAddress: string) {
		try {
			if (this.smartAssist.isShellAvailable) {
				const folder = await this.storageFolder.getFolderFromPathAsync(photoAddress);
				await this.smartAssist.windows.System.Launcher.launchFolderAsync(folder);
			}
		} catch (error) {
			this.logger.error('showPhotoFolder error message:' + error.message + "error number:" + error.number);
			if (error.number === -2147024891) {
				this.isShowfileAuthorizationTips = true;
			}
		}
	}

	public showAccessingFileSystem() {
		try {
			this.deviceService.launchUri('ms-settings:privacy-broadfilesystemaccess');
			this.isShowfileAuthorizationTips = false;
		} catch (error) {
			this.logger.error('showAccessingFileSystem' + error.message);
		}
	}

	public startMonitorCameraAuthorized(callback: any) {
		try {
			if (this.smartAssist.isShellAvailable) {
				if (this.windowsObj) {
					this.cameraAccessChangedHandler = (args: any) => {
						if (args) {
							switch (args.status) {
								case 2:
								case 3:
									callback({ status: false });
									break;
								case 1:
									callback({ status: true });
								default:
									break;
							}
						}
					}
					this.windowsObj.addEventListener('accesschanged', this.cameraAccessChangedHandler);
				}
			}
		} catch (error) {
			this.logger.error('startMonitorCameraAuthorized' + error.message);
		}
	}

	public cameraAuthorizedChange(data: any) {
		this.authorizedAccessState = data.status;
		this.isShowAuthorized = !this.authorizedAccessState;
		this.checkboxDisabled = !(this.cameraPrivacyState && this.authorizedAccessState);
	}

	public stopMonitorCameraAuthorized() {
		try {
			if (this.smartAssist.isShellAvailable) {
				if (this.windowsObj) {
					this.windowsObj.removeEventListener('accesschanged', this.cameraAccessChangedHandler);
				}
			}
		} catch (error) {
			this.logger.error('stopMonitorCameraAuthorized' + error.message);
		}
	}

	public startMonitorForCameraPrivacy() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.startCameraPrivacyMonitor(this.cameraPrivacyChange.bind(this))
					.then((value) => {
						this.logger.info('startMonitorForCameraPrivacy.then', value);
					}).catch(error => {
						this.logger.error('startMonitorForCameraPrivacy', error.message);
					});
			}
		} catch (error) {
			this.logger.error('startMonitorForCameraPrivacy', error.message);
		}
	}

	public cameraPrivacyChange(data: any) {
		this.cameraPrivacyState = !data.status;
		this.isShowAuthorized = !this.authorizedAccessState;
		this.checkboxDisabled = !(this.cameraPrivacyState && this.authorizedAccessState);
	}

	public stopMonitorForCameraPrivacy() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.stopCameraPrivacyMonitor()
					.then((value: any) => {
						this.logger.info('stopMonitorForCameraPrivacy.then', value);
					}).catch(error => {
						this.logger.error('stopMonitorForCameraPrivacy', error.message);
					});
			}
		} catch (error) {
			this.logger.error('stopMonitorForCameraPrivacy', error.message);
		}
	}

	public startMonitorAntiTheftStatus() {
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.startMonitorAntiTheftStatus(this.antiTheftStatusChange.bind(this))
					.then((value) => {
						this.logger.info('startMonitorAntiTheftStatus.then', value);
					}).catch(error => {
						this.logger.error('startMonitorAntiTheftStatus', error.message);
					});
			}
		} catch (error) {
			this.logger.error('startMonitorAntiTheftStatus', error.message);
		}
	}

	public antiTheftStatusChange(data: any) {
		try {
			const obj = JSON.parse(data);
			if (obj && obj.errorCode === 0) {
				this.antiTheftAvailable = obj.available;
				this.isChecked = obj.enabled;
				this.isSupportPhoto = obj.cameraAllowed;
				this.photoAddress = obj.photoAddress;
				this.alarmOften = obj.alarmDuration;
				this.photoNumber = obj.photoNumber;
			}
			this.logger.info(`antiTheftStatusChange return data:`, data);
		} catch (error) {
			this.logger.error('antiTheftStatusChange', error.message);
		}
	}

	public getCameraAuthorizedAccessState() {
		try {
			this.getWinCameraAuthorizedAccessState()
				.then((value: boolean) => {
					this.authorizedAccessState = value;
					this.isShowAuthorized = !this.authorizedAccessState;
					this.checkboxDisabled = !(this.cameraPrivacyState && this.authorizedAccessState);
				}).catch(error => {
					this.logger.error('setCameraAuthorizedAccessState', error.message);
				});

		} catch (error) {
			this.logger.error('setCameraAuthorizedAccessState' + error.message);
		}
	}

	public getWinCameraAuthorizedAccessState() {
		let deviceInfo = null;
		return this.DeviceInformation.findAllAsync(this.DeviceClass.videoCapture)
			.then((devices: any) => {
				devices.forEach((cameraDeviceInfo: any) => {
					if (cameraDeviceInfo.enclosureLocation != null && cameraDeviceInfo.enclosureLocation.panel === this.Front) {
						deviceInfo = cameraDeviceInfo;
					}
				});
				if (deviceInfo && devices.length > 0) {
					deviceInfo = devices.getAt(0);
					this.mediaCapture = new this.Capture.MediaCapture();
					const settings = new this.Capture.MediaCaptureInitializationSettings();
					settings.videoDeviceId = deviceInfo.id;
					settings.streamingCaptureMode = 2;
					settings.photoCaptureSource = 0;
					return this.mediaCapture.initializeAsync(settings).then(() => {
						return Promise.resolve(true);
					}, (error: any) => {
						if (error && error.number === -2147024891) {
							return Promise.resolve(false);
						}
					});
				}
				return Promise.resolve(false);
			}, (error: any) => {
				return Promise.resolve(false);
			});
	}
}
