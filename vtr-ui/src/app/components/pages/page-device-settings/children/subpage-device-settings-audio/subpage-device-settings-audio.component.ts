import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Subscription } from 'rxjs';
import { UiCircleRadioWithCheckBoxListModel } from 'src/app/components/ui/ui-circle-radio-with-checkbox-list/ui-circle-radio-with-checkbox-list.model';
import { DolbyModeResponse } from 'src/app/data-models/audio/dolby-mode-response';
import { MicrophoneOptimizeModes } from 'src/app/data-models/audio/microphone-optimize-modes';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { PageAnchorLink } from 'src/app/data-models/common/page-achor-link.model';
import { DolbyAudioToggleCapability } from 'src/app/data-models/device/dolby-audio-toggle-capability';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { AudioService } from 'src/app/services/audio/audio.service';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import sha256 from 'crypto-js/sha256';
import { DeviceService } from '../../../../../services/device/device.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { AudioVendorService } from './audio-vendor.service';
import { MetricService } from '../../../../../services/metric/metrics.service';

@Component({
	selector: 'vtr-subpage-device-settings-audio',
	templateUrl: './subpage-device-settings-audio.component.html',
	styleUrls: ['./subpage-device-settings-audio.component.scss'],
})
export class SubpageDeviceSettingsAudioComponent implements OnInit, OnDestroy {
	@Output() tooltipClick = new EventEmitter<boolean>();

	@Input() dolbyModeDisabled = false;
	@Input() automaticAudioDisabled = false;
	@Input() enumMode = '1';
	title = 'device.deviceSettings.audio.subtitle';
	headerCaption = 'device.deviceSettings.audio.description';
	radioGroupAutoDolbySettings = 'radio-grp-auto-dolby-settings';
	radioOptimiseMicSettings = 'radio-grp-optimise-mic-settings';

	microphoneProperties: Microphone;
	autoDolbyFeatureStatus: FeatureStatus;
	dolbyModeResponse: DolbyModeResponse;
	microOptimizeModeResponse: MicrophoneOptimizeModes;
	microphoneLoader = true;
	autoDolbyFeatureLoader = true;
	isDTmachine = false;
	automaticDolbyHelpIcon = [];
	isOnline: any = true;
	eCourseStatus = new FeatureStatus(false, true);
	voipStatus = new FeatureStatus(false, true);
	entertainmentStatus = new FeatureStatus(false, true);
	entertainmentTooltip;
	eCourseLoader = true;
	isNewplugin = true;
	dolbyToggleButtonStatus = undefined;
	eCourseToggleButtonStatus = undefined;
	dolbyModesUIModel: Array<UiCircleRadioWithCheckBoxListModel> = [];
	microphoneModesUIModel: Array<UiCircleRadioWithCheckBoxListModel> = [];

	headerMenuItems: PageAnchorLink[] = [
		{
			title: 'device.deviceSettings.audio.audioSmartsettings.title',
			path: 'audio',
			sortOrder: 1,
			metricsItem: 'DolbyAudio',
		},
		{
			title: 'device.deviceSettings.audio.microphone.title',
			path: 'microphone',
			sortOrder: 2,
			metricsItem: 'microphone',
		},
	];

	// when initialize page, cacheFlag need change to false if user make changes before getting response back,
	// in this case, need to drop response status.
	cacheFlag = {
		autoOptimization: true,
		keyboardNoiseSuppression: true,
		AEC: true,
		currentMode: true,
	};

	dolbyAudioToggleCache: DolbyAudioToggleCapability;

	canShowMicrophoneOptimization = false;

	isAudioVendorSupported = false;
	isAudioVendorPanelAvailable = false;
	isSMB = false;

	readonly metricsParent = CommonMetricsModel.ParentDeviceSettings;
	readonly helpIcon = ['far', 'question-circle'];
	private notificationSubscription: Subscription;
	private readonly microphoneDevice: any;
	private microphnePermissionHandler: any;
	private readonly Windows: any;

	constructor(
		private audioService: AudioService,
		private dashboardService: DashboardService,
		private logger: LoggerService,
		private commonService: CommonService,
		private translate: TranslateService,
		private vantageShellService: VantageShellService,
		private batteryService: BatteryDetailService,
		private localCacheService: LocalCacheService,
		public deviceService: DeviceService,
		private audioVendorService: AudioVendorService,
		private metricsService: MetricService
	) {
		this.Windows = vantageShellService.getWindows();
		if (this.Windows) {
			this.microphoneDevice = this.Windows.Devices.Enumeration.DeviceAccessInformation.createFromDeviceClass(
				this.Windows.Devices.Enumeration.DeviceClass.audioCapture
			);
		}
		const entertainmentTooltipText = this.translate.instant(
			'device.deviceSettings.audio.audioSmartsettings.dolby.automaticAudioMode.entertainmentMode.tooltip'
		);
		this.entertainmentTooltip = JSON.parse(
			JSON.stringify(entertainmentTooltipText).replace(/<\/?.+?\/?>/g, '')
		);
	}

	ngOnInit() {
		this.isAudioVendorSupported = this.audioVendorService.isVendorSupported;
		if (this.isAudioVendorSupported) {
			this.audioVendorService.isPanelInstalled().then((isInstalled) => {
				this.logger.info('audio isPanelInstalled: ' + isInstalled);
				this.isAudioVendorPanelAvailable = isInstalled;
			});
		}

		this.notificationSubscription = this.commonService.notification.subscribe(
			(response: AppNotification) => {
				this.onNotification(response);
			}
		);
		this.isDTmachine = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.DesktopMachine
		);
		this.batteryService.getBatterySettings();
		this.batteryService.checkPowerPageFlagAndHide();

		this.initFeatures();

		if (this.microphoneDevice) {
			this.microphnePermissionHandler = (args: any) => {
				if (args && args.status != null) {
					switch (args.status) {
						case 1:
							this.microphoneProperties.permission = true;
							this.getMicrophoneSettingsAsync();
							break;
						case 2:
							this.microphoneProperties.permission = false;
							break;
						case 3:
							this.microphoneProperties.permission = false;
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

		// this.Windows.Media.Devices.MediaDevice.addEventListener("defaultaudiocapturedevicechanged", this.defaultAudioCaptureDeviceChanged.bind(this));
		this.isInMicrophoneOptimizationBlockList().then((blocked) => {
			this.canShowMicrophoneOptimization = !blocked;
		});
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		this.stopMicrophoneMonitor();
		this.stopMonitorForDolby();

		if (this.microphoneDevice) {
			this.microphoneDevice.removeEventListener(
				'accesschanged',
				this.microphnePermissionHandler,
				false
			);
		}
		// this.Windows.Media.Devices.MediaDevice.removeEventListener("defaultaudiocapturedevicechanged", this.defaultAudioCaptureDeviceChanged);
	}

	private initFeatures() {
		this.initMockData();

		this.initMicrophoneFromCache();
		this.initDolbyAudioFromCache();

		this.getMicrophoneSettingsAsync();
		this.getDolbyModesStatus();

		this.startMicrophoneMonitor();
		this.startMonitorForDolby();
	}

	initDolbyAudioFromCache() {
		try {
			this.dolbyModeResponse.available = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.IsDolbyModeAvailable,
				true
			);
			const dolbyAudioCache = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.DolbyAudioToggleCache,
				undefined
			);
			if (dolbyAudioCache !== undefined) {
				this.dolbyModeResponse = dolbyAudioCache;
				this.refreshDolbyAudioProfileState();
				this.autoDolbyFeatureLoader = false;
				this.eCourseLoader = false;
			}
		} catch (error) {
			this.logger.exception('initDolbyAudioFromCache', error);
		}
	}

	launchPanel() {
		const metricsData = {
			ItemParent: this.metricsParent,
			ItemType: 'FeatureClick',
			ItemName: 'microphone-link',
			ItemValue: 'launch',
		};
		this.metricsService.sendMetrics(metricsData);
		this.audioVendorService.launchPanel();
	}

	launchDownloadLink() {
		const metricsData = {
			ItemParent: this.metricsParent,
			ItemType: 'FeatureClick',
			ItemName: 'microphone-link',
			ItemValue: 'download',
		};
		this.metricsService.sendMetrics(metricsData);
		this.audioVendorService.launchDownloadLink();
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
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

	onOptimizeModesRadioChange(event: any) {
		try {
			const newVal = event.value;
			if (this.microOptimizeModeResponse.current === newVal) {
				this.logger.info('microphone already set');
				return;
			}
			this.microOptimizeModeResponse.current = newVal;
			if (this.audioService.isShellAvailable) {
				this.cacheFlag.currentMode = false;
				this.audioService
					.setMicrophoneOpitimaztion(this.microOptimizeModeResponse.current)
					.then((value) => {
						this.logger.info('onOptimizeModesRadioChange:', value);
					})
					.catch((error) => {
						this.logger.error('onOptimizeModesRadioChange', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onOptimizeModesRadioChange' + error.message);
			return EMPTY;
		}
	}

	onRightIconClick(tooltip: any, $event: any) {
		this.toggleToolTip(tooltip, true);
		this.tooltipClick.emit($event);
	}

	toggleToolTip(tooltip: any, canOpen = false) {
		if (tooltip) {
			if (tooltip.isOpen()) {
				tooltip.close();
			} else if (canOpen) {
				tooltip.open();
			}
		}
	}

	getDolbyModesStatus() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService
					.getDolbyMode()
					.then((response: DolbyModeResponse) => {
						if (response.entertainmentStatus === undefined) {
							// Old plugin return undefined, Dealing with ui latency issues
							response.entertainmentStatus = this.dolbyModeResponse.entertainmentStatus;
						}
						this.dolbyModeResponse = response;
						this.updateDolbyModeModel(response);
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.DolbyAudioToggleCache,
							this.dolbyModeResponse
						);
						if (this.dolbyModeResponse.eCourseStatus === undefined) {
							this.isNewplugin = false;
							this.dolbyModeResponse.voIPStatus = this.microphoneProperties
								.autoOptimization
								? 'True'
								: 'False';
							this.localCacheService.setLocalCacheValue(
								LocalStorageKey.DolbyAudioToggleCache,
								this.dolbyModeResponse
							);
							this.getDolbyFeatureStatus();
						} else {
							if (response.eCourseStatus !== 'NotSupport') {
								this.dolbyToggleButtonStatus = response.isAudioProfileEnabled;
								this.eCourseToggleButtonStatus =
									response.eCourseStatus === 'True' ? true : false;
							}
						}
						this.initVisibility();
						this.refreshDolbyAudioProfileState();
						this.autoDolbyFeatureLoader = false;
						this.eCourseLoader = false;
						this.logger.info('getDolbyModesStatus:', response);
					})
					.catch((error) => {
						this.logger.error('getDolbyModesStatus', error.message);
					});
			}
		} catch (error) {
			this.logger.error('getDolbyModesStatus' + error.message);
		}
	}

	updateDolbyModeSelection() {
		if (this.dolbyModesUIModel && this.dolbyModesUIModel.length > 0) {
			this.dolbyModesUIModel.forEach((element) => {
				if (element.value === this.dolbyModeResponse.currentMode) {
					element.isChecked = true;
				} else {
					element.isChecked = false;
				}
			});
		}
	}

	updateDolbyModeModel(response: DolbyModeResponse) {
		if (response && response.supportedModes) {
			this.dolbyModesUIModel = [];
			response.supportedModes.forEach((dolbyMode) => {
				this.dolbyModesUIModel.push({
					componentId: `radioDolbyMode${dolbyMode}`.replace(/\s/g, ''),
					label: `device.deviceSettings.audio.audioSmartsettings.dolby.options.${dolbyMode.toLowerCase()}`,
					value: dolbyMode,
					isChecked: dolbyMode === response.currentMode,
					isDisabled: false,
					processIcon: true,
					customIcon: '',
					hideIcon: false,
					processLabel: true,
					metricsItem: `radio.dolby-audio.${dolbyMode}`,
				});
			});
		}
	}

	updateOptimizeMicrophoneSelection() {
		if (this.microphoneModesUIModel && this.microphoneModesUIModel.length > 0) {
			this.microphoneModesUIModel.forEach((element) => {
				if (element.value === this.microOptimizeModeResponse.current) {
					element.isChecked = true;
				} else {
					element.isChecked = false;
				}
			});
		}
	}

	updateMicrophoneModel(response: MicrophoneOptimizeModes) {
		if (response && response.modes) {
			this.microphoneModesUIModel = [];
			response.modes.forEach((micMode) => {
				this.microphoneModesUIModel.push({
					componentId: `radioMicrophone${micMode}`.replace(/\s/g, ''),
					label: `device.deviceSettings.audio.microphone.optimize.options.${micMode}`,
					value: micMode,
					isChecked: micMode === response.current,
					isDisabled: this.microphoneProperties.disableEffect,
					processIcon: true,
					customIcon: micMode.toLowerCase() === 'normal' ? 'LE-VoiceRecognition2x' : '',
					hideIcon: micMode.toLowerCase() === 'normal',
					processLabel: true,
					metricsItem: `radio.optimize-mic.${micMode}`,
				});
			});
		}
	}

	getDolbyFeatureStatus() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService
					.getDolbyFeatureStatus()
					.then((dolbyFeature: FeatureStatus) => {
						this.dolbyModeResponse.entertainmentStatus = !dolbyFeature.available
							? 'NotSupport'
							: dolbyFeature.status
							? 'True'
							: 'False';
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.DolbyAudioToggleCache,
							this.dolbyModeResponse
						);
						this.refreshDolbyAudioProfileState();
						this.logger.info('getDolbyFeatureStatus old plugin', dolbyFeature);
					})
					.catch((error) => {
						this.logger.error('getDolbyFeatureStatus old plugin' + error.message);
					});
			}
		} catch (error) {
			this.logger.error('getDolbyFeatureStatus old plugin' + error.message);
		}
	}

	startMonitorForDolby() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService
					.startMonitorForDolby(this.startMonitorHandlerForDolby.bind(this))
					.then((value: boolean) => {
						this.logger.info('startMonitorForDolby', value);
					})
					.catch((error) => {
						this.logger.error('startMonitorForDolby', error.message);
					});
			}
		} catch (error) {
			this.logger.error('startMonitorForDolby' + error.message);
		}
	}

	stopMonitorForDolby() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService
					.stopMonitorForDolby()
					.then((value: boolean) => {
						this.logger.info('stopMonitorForDolby', value);
					})
					.catch((error) => {
						this.logger.error('stopMonitorForDolby', error.message);
					});
			}
		} catch (error) {
			this.logger.error('stopMonitorForDolby' + error.message);
		}
	}

	refreshDolbyAudioProfileState() {
		this.logger.info('refreshDolbyAudioProfileState', this.dolbyModeResponse);
		if (
			this.dolbyModeResponse.voIPStatus === 'True' ||
			this.dolbyModeResponse.voIPStatus === 'False'
		) {
			this.voipStatus.available = true;
			this.voipStatus.status = this.dolbyModeResponse.voIPStatus === 'True';
		} else {
			this.voipStatus.available = false;
		}

		if (
			this.dolbyModeResponse.entertainmentStatus === 'True' ||
			this.dolbyModeResponse.entertainmentStatus === 'False'
		) {
			this.entertainmentStatus.available = true;
			this.entertainmentStatus.status = this.dolbyModeResponse.entertainmentStatus === 'True';
		} else {
			this.entertainmentStatus.available = false;
		}

		if (
			this.dolbyModeResponse.eCourseStatus === 'True' ||
			this.dolbyModeResponse.eCourseStatus === 'False'
		) {
			this.eCourseStatus.available = true;
			this.eCourseStatus.status =
				this.dolbyModeResponse.eCourseStatus === 'True' ? true : false;
			this.automaticAudioDisabled = this.eCourseStatus.status;
			this.dolbyModeDisabled = this.eCourseStatus.status;
			if (
				this.eCourseStatus.status &&
				this.eCourseToggleButtonStatus !== this.eCourseStatus.status &&
				this.eCourseToggleButtonStatus !== undefined
			) {
				this.dolbyModeResponse.isAudioProfileEnabled = true;
				this.eCourseToggleButtonStatus = this.eCourseStatus.status;
				this.dolbyToggleButtonStatus = true;
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.DolbyAudioToggleCache,
					this.dolbyModeResponse
				);
			}
			if (
				!this.dolbyModeResponse.isAudioProfileEnabled &&
				this.dolbyToggleButtonStatus !== this.dolbyModeResponse.isAudioProfileEnabled &&
				this.dolbyToggleButtonStatus !== undefined
			) {
				this.eCourseStatus.status = false;
				this.dolbyModeResponse.eCourseStatus = 'False';
				this.eCourseToggleButtonStatus = false;
				this.dolbyToggleButtonStatus = this.dolbyModeResponse.isAudioProfileEnabled;
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.DolbyAudioToggleCache,
					this.dolbyModeResponse
				);
			}
		} else {
			this.eCourseStatus.available = false;
			this.automaticAudioDisabled = false;
			this.dolbyModeDisabled = false;
		}
	}

	onDolbyAudioToggleOnOff(event: any) {
		if (!event.switchValue && this.dolbyModeResponse.eCourseStatus === 'True') {
			this.eCourseStatus.status = event.switchValue;
			this.dolbyModeResponse.eCourseStatus = 'False';
			this.eCourseToggleButtonStatus = false;
		} else {
			this.dolbyModeDisabled = !event.switchValue;
			this.automaticAudioDisabled = !event.switchValue;
		}
		this.dolbyModeResponse.isAudioProfileEnabled = event.switchValue;
		this.dolbyToggleButtonStatus = event.switchValue;
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.DolbyAudioToggleCache,
			this.dolbyModeResponse
		);
		if (this.audioService.isShellAvailable) {
			this.audioService
				.setDolbyAudioState(event.switchValue)
				.then((response: boolean) => {
					this.logger.info('onDolbyAudioToggleOnOff:', response);
				})
				.catch((error) => {
					this.logger.error('onDolbyAudioToggleOnOff', error.message);
				});
		}
	}

	onVoipCheckboxChange(value: boolean) {
		this.voipStatus.status = value;
		this.dolbyModeResponse.voIPStatus = value ? 'True' : 'False';
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.DolbyAudioToggleCache,
			this.dolbyModeResponse
		);
		try {
			if (this.isNewplugin) {
				if (this.audioService.isShellAvailable) {
					this.audioService
						.setDolbyAudioProfileState('VoIPStatus', value)
						.then((response: boolean) => {
							this.logger.info('onVoipCheckboxChange New plugin', response);
						})
						.catch((error) => {
							this.logger.error('onVoipCheckboxChange New plugin', error.message);
						});
				}
			} else {
				this.microphoneProperties.autoOptimization = value;
				this.updateMicrophoneCache();
				if (this.audioService.isShellAvailable) {
					this.cacheFlag.autoOptimization = false;
					this.audioService
						.setMicrophoneAutoOptimization(value)
						.then((value1) => {
							this.logger.info('onVoipCheckboxChange old plugin', value1);
						})
						.catch((error) => {
							this.logger.error('onVoipCheckboxChange old plugin', error.message);
						});
				}
			}
		} catch (error) {
			this.logger.error('onVoipCheckboxChange' + error.message);
		}
	}

	onEntertainmentCheckboxChange(value: boolean) {
		this.entertainmentStatus.status = value;
		this.dolbyModeResponse.entertainmentStatus = value ? 'True' : 'False';
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.DolbyAudioToggleCache,
			this.dolbyModeResponse
		);
		try {
			if (this.isNewplugin) {
				this.audioService
					.setDolbyAudioProfileState('EntertainmentStatus', value)
					.then((response: boolean) => {
						this.logger.info('onEntertainmentCheckboxChange New plugin', response);
					})
					.catch((error) => {
						this.logger.error(
							'onEntertainmentCheckboxChange New plugin',
							error.message
						);
					});
			} else {
				if (this.audioService.isShellAvailable) {
					this.audioService
						.setDolbyOnOff(value)
						.then((value1) => {
							this.logger.info('onEntertainmentCheckboxChange old plugin', value1);
						})
						.catch((error) => {
							this.logger.error(
								'onEntertainmentCheckboxChange old plugin',
								error.message
							);
						});
				}
			}
		} catch (error) {
			this.logger.error('onEntertainmentCheckboxChange' + error.message);
		}
	}

	onToggleOfeCourseAutoOptimization(event: any) {
		this.eCourseStatus.status = event.switchValue;
		if (event.switchValue) {
			this.dolbyModeResponse.isAudioProfileEnabled = event.switchValue;
			this.dolbyModeResponse.currentMode = 'Voip';
			this.dolbyToggleButtonStatus = event.switchValue;
		}
		this.dolbyModeDisabled = event.switchValue;
		this.automaticAudioDisabled = event.switchValue;
		this.eCourseToggleButtonStatus = event.switchValue;
		this.dolbyModeResponse.eCourseStatus = event.switchValue ? 'True' : 'False';
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.DolbyAudioToggleCache,
			this.dolbyModeResponse
		);
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService
					.setDolbyAudioProfileState('ECourseStatus', event.switchValue)
					.then((response: boolean) => {
						this.logger.info('onToggleOfeCourseAutoOptimization:', response);
					})
					.catch((error) => {
						this.logger.error('onToggleOfeCourseAutoOptimization', error.message);
					});
			}
		} catch (error) {
			this.logger.error('onToggleOfeCourseAutoOptimization' + error.message);
		}
	}

	startMonitorHandlerForDolby(response: any) {
		this.logger.info('startMonitorHandlerForDolby', response);
		this.dolbyModeResponse.available =
			Object.keys(response).indexOf('available') !== -1 && response.available !== undefined
				? response.available
				: this.dolbyModeResponse.available;
		this.dolbyModeResponse.currentMode =
			Object.keys(response).indexOf('currentMode') !== -1 &&
			response.currentMode !== undefined
				? response.currentMode
				: this.dolbyModeResponse.currentMode;
		this.dolbyModeResponse.isAudioProfileEnabled =
			Object.keys(response).indexOf('isAudioProfileEnabled') !== -1 &&
			response.isAudioProfileEnabled !== undefined
				? response.isAudioProfileEnabled
				: this.dolbyModeResponse.isAudioProfileEnabled;
		this.dolbyModeResponse.eCourseStatus =
			Object.keys(response).indexOf('eCourseStatus') !== -1 &&
			response.eCourseStatus !== undefined
				? response.eCourseStatus
				: this.dolbyModeResponse.eCourseStatus;
		this.dolbyModeResponse.driverAvailability =
			Object.keys(response).indexOf('driverAvailability') !== -1 &&
			response.driverAvailability !== undefined
				? response.driverAvailability
				: this.dolbyModeResponse.driverAvailability;
		this.updateDolbyModeSelection();
		this.refreshDolbyAudioProfileState();
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.DolbyAudioToggleCache,
			this.dolbyModeResponse
		);
		this.initVisibility();
	}

	onDolbySettingRadioChange(event: any) {
		try {
			this.dolbyModeResponse.currentMode = event.value;
			if (this.audioService.isShellAvailable) {
				this.audioService
					.setDolbyMode(this.dolbyModeResponse.currentMode)
					.then((value) => {
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.DolbyAudioToggleCache,
							this.dolbyModeResponse
						);
						this.logger.info('onDolbySettingRadioChange', value);
					})
					.catch((error) => {
						this.logger.error('onDolbySettingRadioChange', error.message);
					});
			}
		} catch (error) {
			this.logger.error('onDolbySettingRadioChange' + error.message);
		}
	}

	onMicrophoneVolumeChange($event: number) {
		const volume = $event;
		try {
			this.microphoneProperties.volume = volume;
			this.updateMicrophoneCache();

			if (this.audioService.isShellAvailable) {
				this.audioService
					.setMicrophoneVolume(volume)
					.then((response) => {
						this.logger.info('onMicrophoneVolumeChange', { response, volume });
					})
					.catch((error) => {
						this.logger.error('onMicrophoneVolumeChange', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onMicrophoneVolumeChange' + error.message);
			return EMPTY;
		}
	}

	onToggleOfMicrophone(event: any) {
		try {
			this.microphoneProperties.muteDisabled = event.switchValue;
			this.updateMicrophoneCache();

			if (this.dashboardService.isShellAvailable) {
				this.dashboardService
					.setMicrophoneStatus(event.switchValue)
					.then((value: boolean) => {
						const status: FeatureStatus = this.commonService.getSessionStorageValue(
							SessionStorageKey.DashboardMicrophone
						);
						status.status = event.switchValue;
						this.commonService.setSessionStorageValue(
							SessionStorageKey.DashboardMicrophone,
							status
						);
						this.logger.info('onToggleOfMicrophone', value);
					})
					.catch((error) => {
						this.logger.error('onToggleOfMicrophone', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onToggleOfMicrophone' + error.message);
			return EMPTY;
		}
	}

	onToggleOfSuppressKbdNoise(event: any) {
		try {
			this.microphoneProperties.keyboardNoiseSuppression = event.switchValue;
			this.updateMicrophoneCache();

			if (this.audioService.isShellAvailable) {
				this.cacheFlag.keyboardNoiseSuppression = false;
				this.audioService
					.setSuppressKeyboardNoise(event.switchValue)
					.then((value: boolean) => {
						this.logger.info('onToggleOfSuppressKbdNoise', value);
					})
					.catch((error) => {
						this.logger.error('onToggleOfSuppressKbdNoise', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onToggleOfSuppressKbdNoise' + error.message);
			return EMPTY;
		}
	}

	setMicrophoneAEC(event: any) {
		try {
			this.microphoneProperties.AEC = event.switchValue;
			this.updateMicrophoneCache();

			if (this.audioService.isShellAvailable) {
				this.cacheFlag.AEC = false;
				this.audioService
					.setMicrophoneAEC(event.switchValue)
					.then((value: boolean) => {
						this.logger.info('setMicrophoneAEC', value);
					})
					.catch((error) => {
						this.logger.error('setMicrophoneAEC', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setMicrophoneAEC' + error.message);
			return EMPTY;
		}
	}

	startMicrophoneMonitor() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService
					.startMicrophoneMonitor(this.startMonitorHandler.bind(this))
					.then((value: boolean) => {
						this.logger.info('startMicrophoneMonitor.then', value);
					})
					.catch((error) => {
						this.logger.error('startMicrophoneMonitor.error', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.exception('startMicrophoneMonitor.exception', error);
			return EMPTY;
		}
	}

	stopMicrophoneMonitor() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService
					.stopMicrophoneMonitor()
					.then((value: boolean) => {
						this.logger.info('stopMonitor', value);
					})
					.catch((error) => {
						this.logger.error('stopMonitor', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('stopMonitor' + error.message);
			return EMPTY;
		}
	}

	startMonitorHandler(microphone: Microphone) {
		// because microphone object only contains the changed properies
		this.microphoneProperties = { ...this.microphoneProperties, ...microphone };
		// this.microphoneProperties = microphone;
		// update microphone mode
		if (this.microphoneProperties.currentMode !== '') {
			this.microOptimizeModeResponse.current = this.microphoneProperties.currentMode;
		}
		this.microphoneLoader = false;
		this.logger.info('startMonitorHandler for microphone', JSON.stringify(microphone));
		this.updateOptimizeMicrophoneSelection();
		this.updateMicrophoneCache();
	}

	initMockData() {
		this.microphoneProperties = new Microphone(
			true,
			false,
			0,
			'',
			undefined,
			false,
			undefined,
			false,
			true
		);

		const dolbySupportedMode = [
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.dynamic',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.movie',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.music',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.games',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.voip',
		];

		this.dolbyModeResponse = new DolbyModeResponse(
			true,
			dolbySupportedMode,
			'Voip',
			true,
			'NotSupport',
			'True',
			'True',
			true
		);

		const optimizeMode = [
			'device.deviceSettings.audio.microphone.optimize.options.OnlyMyVoice',
			'device.deviceSettings.audio.microphone.optimize.options.Normal',
			'device.deviceSettings.audio.microphone.optimize.options.MultipleVoices',
			'device.deviceSettings.audio.microphone.optimize.options.VoiceRecognition',
		];
		this.microOptimizeModeResponse = new MicrophoneOptimizeModes(optimizeMode, '');
	}

	initMicrophoneFromCache() {
		const microphoneCache = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.MicrophoneCapability
		);

		if (microphoneCache) {
			// because autoOptimization is Lenovo feature, so can use cache safely
			if (microphoneCache.data) {
				if (microphoneCache.data.autoOptimization) {
					this.microphoneProperties.autoOptimization =
						microphoneCache.data.autoOptimization;
					if (!this.isNewplugin) {
						this.dolbyModeResponse.voIPStatus = this.microphoneProperties
							.autoOptimization
							? 'True'
							: 'False';
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.DolbyAudioToggleCache,
							this.dolbyModeResponse
						);
					}
				}
				if (microphoneCache.data.keyboardNoiseSuppression) {
					this.microphoneProperties.keyboardNoiseSuppression =
						microphoneCache.data.keyboardNoiseSuppression;
				}
				if (microphoneCache.data.AEC) {
					this.microphoneProperties.AEC = microphoneCache.data.AEC;
				}
			}
			if (microphoneCache.modes && microphoneCache.modes.length > 0) {
				// because microOptimizeModeResponse already initiliazed in initMockData function, here can use directly
				this.microOptimizeModeResponse.modes = microphoneCache.modes;

				if (microphoneCache.data.currentMode) {
					this.microphoneProperties.currentMode = microphoneCache.data.currentMode;
					this.microOptimizeModeResponse.current = microphoneCache.data.currentMode;
				}
			}
		}
	}

	getMicrophoneSettingsAsync() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getMicrophoneSettingsAsync(
					this.updateMicrophoneHandler.bind(this)
				);
			}
		} catch (error) {
			this.logger.error('getMicrophoneSettingsAsync' + error.message);
		}
	}

	updateMicrophoneHandler(msg: any) {
		this.microphoneLoader = false;

		if (msg.hasOwnProperty('available')) {
			this.microphoneProperties.available = msg.available;
		}
		if (msg.hasOwnProperty('muteDisabled')) {
			this.microphoneProperties.muteDisabled = msg.muteDisabled;
		}
		if (msg.hasOwnProperty('volume')) {
			this.logger.info('*****ready to change volume ' + msg.volume);
			this.microphoneProperties.volume = msg.volume;
		}
		if (msg.hasOwnProperty('permission')) {
			this.microphoneProperties.permission = msg.permission;
			// update cache used in dashboard page
			const status = new FeatureStatus(msg.available, msg.muteDisabled, msg.permission);
			this.commonService.setSessionStorageValue(
				SessionStorageKey.DashboardMicrophone,
				status
			);
		}
		if (msg.hasOwnProperty('modes')) {
			this.microOptimizeModeResponse.modes = msg.modes;
			this.updateMicrophoneModel(this.microOptimizeModeResponse);
		}
		if (msg.hasOwnProperty('currentMode')) {
			if (msg.currentMode && this.cacheFlag.currentMode) {
				this.microphoneProperties.currentMode = msg.currentMode;
				this.microOptimizeModeResponse.current = msg.currentMode;
				this.updateOptimizeMicrophoneSelection();
			}
		}
		if (
			msg.hasOwnProperty('keyboardNoiseSuppression') &&
			this.cacheFlag.keyboardNoiseSuppression
		) {
			this.microphoneProperties.keyboardNoiseSuppression = msg.keyboardNoiseSuppression;
		}
		if (msg.hasOwnProperty('AEC') && this.cacheFlag.AEC) {
			this.microphoneProperties.AEC = msg.AEC;
		}
		if (msg.hasOwnProperty('disableEffect')) {
			this.microphoneProperties.disableEffect = msg.disableEffect;
		}
		if (msg.hasOwnProperty('autoOptimization') && this.cacheFlag.autoOptimization) {
			this.microphoneProperties.autoOptimization = msg.autoOptimization;
			if (!this.isNewplugin) {
				this.dolbyModeResponse.voIPStatus = this.microphoneProperties.autoOptimization
					? 'True'
					: 'False';
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.DolbyAudioToggleCache,
					this.dolbyModeResponse
				);
			}
			// because this item need plugin response, so it is the last response
			// this.microphoneLoader = false;
		}
		// if message has finished flag, means already get all the data, now can save to cache
		if (msg.hasOwnProperty('finished')) {
			this.updateMicrophoneCache();
			// reset cacheFlag
			this.cacheFlag.AEC = true;
			this.cacheFlag.autoOptimization = true;
			this.cacheFlag.currentMode = true;
			this.cacheFlag.keyboardNoiseSuppression = true;
		}
		this.updateMicrophoneHeader();
		this.logger.info('updateMicrophoneHandler ' + JSON.stringify(msg));
	}

	updateMicrophoneCache() {
		const info = {
			data: this.microphoneProperties,
			modes: this.microOptimizeModeResponse.modes,
		};
		this.logger.info('ready to update microphone cache');
		this.localCacheService.setLocalCacheValue(LocalStorageKey.MicrophoneCapability, info);
		this.updateMicrophoneHeader();
	}

	updateMicrophoneHeader() {
		if (!this.microphoneProperties.available) {
			this.headerMenuItems = this.commonService.removeObjFrom(
				this.headerMenuItems,
				'microphone'
			);
		}
	}

	initVisibility() {
		try {
			if (!this.dolbyModeResponse.available) {
				this.headerMenuItems = this.commonService.removeObjFrom(
					this.headerMenuItems,
					'audio'
				);
				this.checkMenuItemsLength();
			}
		} catch (error) {
			this.logger.exception('initVisibility', error.message);
		}
	}

	checkMenuItemsLength() {
		if (this.headerMenuItems.length === 1) {
			this.headerMenuItems = [];
		}
	}

	private isInMicrophoneOptimizationBlockList() {
		// noinspection SpellCheckingInspection
		const microphoneOptimizationBlockList = [
			'7da89d20abf717b0b691aa96dac96c4db06f8166e1bb94d88572f1b73d074e6a',
			'95b8d5578d63884142a73dcdeb5fd655415df9dad00db132e798d6e35451033c',
			'dfc2f52c836c5c1fe5f4a50694c4086dc986f04971f61a6a282eccce6b8dd720',
			'a9cd87714fedf41f028d48a089cb534f5a19410b4cd58620d39339eb135d01ff',
			'ed7963f9132c133a3f1c5b21a057c4dd01f1b9990fafce2f3653f928fed2e768',
			'f6c0706d75b35a92860319a48d206dba10b65f23f7db9c43ef7c3ecd727909b0',
			'2b3fb8e006afef2576886d52fa6c34916071d3198c192f8ea8b0851404ff4d7d',
			'7222993c2c7db94f4923f7dcb619ba6181d3653323ae5be9345878f920f600c3',
			'c4d8cfc00eff2d046b67e595ef90c66e30def7213541d9f868a38599350564a9',
			'260fb0097ace3d608b6449409553dcf3eed35a4473e869cffcf179566b699859',
			'03c2c350f85bbe7f1e01e2fa1a306f48ccfcd241862881be14ff5af2886c1f7c',
			'a8d98a3da8b2d3bba4d51042f1cd68ae818412a6a22ae8c2a69aca2703bd4166',
			'092b6df94db39667dd45fa2ce1047cb95476af3cf3603d50c6fbac844e72e19a',
			'cb313ad3661271dc1fa1b4e31413fcb2288c189944e09f067197f2ab5dc9d2aa',
			'3bac0ab1106009b1e566df7de9b5d1ce0e28505e6f52b579ff0482e990f30776',
			'e5a06cb70398b672f739cdb45d4267ef62c56b84fb463f4e0f00171495d77283',
			'da58c3d251e720a7eac85e5a7e982d94b520e41dd12fbe3351583b3cdb4f1ece',
			'6aff308a882ac48f4675bc6e941dc79f3cb783263d14701fad5b06800e1e1334',
			'3c4b4fd7b64b1cd9101bbf5eef654170dd875e1178a2996fb4244434e6f165de',
			'56d9bc8c7ab64d6eb20c6517269b9b19975652fbc7be2da175683b285e578244',
			'750b9f0de71bfb59d4ae96320c04c5151ec0d58ce1b970ab651f161b7684d2eb',
			'd6aed28417c8c1cd30d91e5ea000dfeb4ed9bdcd36ff91d803f5334152266267',
			'defb397f9d1bcba8d03064f99fcc5747a0ace30f19386fd3509ad6fcbf7ce974',
			'72b493aa3cf24878b8bf900fdc3a070f1576d5eef457e90032f62ef13b191e99',
			'08d216335a67479a76fd36bffcba77b75dd75ad9d4959b92475d60c8ed0c0fad',
			'71eb84d8e66bfea45a68dfa9516e3b81ec74883f9d7941cc960f6ef3bdf023cb',
			'1fb2e73decff47160deefe871d52f49e2c881bea8708ff6ee70f56d57e0571cb',
		];
		return this.deviceService
			.getMachineInfo()
			.then(
				(res) =>
					res.hasOwnProperty('mt') &&
					typeof res.mt === 'string' &&
					res.mt.length >= 4 &&
					microphoneOptimizationBlockList.includes(sha256(res.mt.substr(0, 4)).toString())
			);
	}
}
