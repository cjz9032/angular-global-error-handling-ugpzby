import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EMPTY, Subscription } from 'rxjs';
import { FeatureStatus } from '../../../../../data-models/common/feature-status.model';
import { SessionStorageKey } from '../../../../../enums/session-storage-key-enum';
import { Microphone } from '../../../../../data-models/audio/microphone.model';
import { DolbyModeResponse } from '../../../../../data-models/audio/dolby-mode-response';
import { MicrophoneOptimizeModes } from '../../../../../data-models/audio/microphone-optimize-modes';
import { LocalStorageKey } from '../../../../../enums/local-storage-key.enum';
import { AppNotification } from '../../../../../data-models/common/app-notification.model';
import { AudioService } from '../../../../../services/audio/audio.service';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { LoggerService } from '../../../../../services/logger/logger.service';
import { CommonService } from '../../../../../services/common/common.service';
import { TranslateService } from '@ngx-translate/core';
import { VantageShellService } from '../../../../../services/vantage-shell/vantage-shell.service';
import { BatteryDetailService } from '../../../../../services/battery-detail/battery-detail.service';
import { LocalCacheService } from '../../../../../services/local-cache/local-cache.service';
import { DeviceService } from '../../../../../services/device/device.service';
import { UiCircleRadioWithCheckBoxListModel } from '../../../../ui/ui-circle-radio-with-checkbox-list/ui-circle-radio-with-checkbox-list.model';
import { DolbyAudioToggleCapability } from '../../../../../data-models/device/dolby-audio-toggle-capability';
import CommonMetricsModel from '../../../../../data-models/common/common-metrics.model';
import { AudioVendorService } from '../../../page-device-settings/children/subpage-device-settings-audio/audio-vendor.service';
import { WinRT } from '@lenovo/tan-client-bridge';
import { MetricService } from 'src/app/services/metric/metrics.service';

@Component({
	selector: 'vtr-subpage-meeting-manager',
	templateUrl: './subpage-meeting-manager.component.html',
	styleUrls: ['./subpage-meeting-manager.component.scss'],
})
export class SubpageMeetingManagerComponent implements OnInit, OnDestroy {
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
	eCourseLoader = true;
	isNewplugin = true;
	microphoneModesUIModel: Array<UiCircleRadioWithCheckBoxListModel> = [];
	isAMMInstalled = false; // Ai meeting manager
	isLSAInstalled = false; // Smart appearance
	isSupportSmartAppearance = true;

	headerMenuItems = [
		{
			title: 'smb.meetingExperience.meetingManager.aiMeetingManager.title',
			path: 'meetingManager',
			metricsItem: 'AIMeetingManager',
			order: 1,
		},
		{
			title: 'smb.meetingExperience.meetingManager.microPhone.title',
			path: 'microphone',
			metricsItem: 'MicroPhone',
			order: 2,
		},
		{
			title: 'smb.meetingExperience.meetingManager.smartAppearance.title',
			path: 'smartAppearance',
			metricsItem: 'SmartAppearance',
			order: 3,
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

	isAudioVendorSupported = false;
	isAudioVendorPanelAvailable = false;

	readonly metricsParent = 'Smb.MeetingManager';
	readonly helpIcon = ['far', 'question-circle'];
	private notificationSubscription: Subscription;
	private readonly microphoneDevice: any;
	private microphnePermissionHandler: any;
	private readonly Windows: any;

	public voiceToText = 'voiceToText';
	public translation = 'translation';
	public AMMBannerAriaLabel: string;
	private isAMMInstalledInterval: any;

	constructor(
		private audioService: AudioService,
		private dashboardService: DashboardService,
		private logger: LoggerService,
		public commonService: CommonService,
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

			if (!this.isSupportSmartAppearance) {
				this.headerMenuItems = this.commonService.removeObjFrom(
					this.headerMenuItems,
					'smartAppearance'
				);
			}
		}
	}

	ngOnDestroy() {
		clearInterval(this.isAMMInstalledInterval);
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		this.stopMicrophoneMonitor();

		if (this.microphoneDevice) {
			this.microphoneDevice.removeEventListener(
				'accesschanged',
				this.microphnePermissionHandler,
				false
			);
		}
		// this.Windows.Media.Devices.MediaDevice.removeEventListener("defaultaudiocapturedevicechanged", this.defaultAudioCaptureDeviceChanged);
	}

	private initAMM() {
		this.isLSAInstalled = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.AiMeetingManagerInstalled,
			false
		);
		this.checkAMMInstallationStatus();
	}

	private checkAMMInstallationStatus() {
		WinRT.queryUriSupport(
			'ai-meeting-mamager:',
			'E046963F.AIMeetingManager_k1h2ywk1493x8'
		).then((result) => {
			switch (result) {
				case 0:
				case 3:
					this.isAMMInstalled = true;
					this.AMMBannerAriaLabel =
						this.translate.instant(
							'smb.meetingExperience.meetingManager.aiMeetingManager.banner.title'
						) +
						this.translate.instant(
							'smb.meetingExperience.meetingManager.aiMeetingManager.launch'
						);
					clearInterval(this.isAMMInstalledInterval);
					break;
				default:
					this.isAMMInstalled = false;
					this.AMMBannerAriaLabel =
						this.translate.instant(
							'smb.meetingExperience.meetingManager.aiMeetingManager.banner.title'
						) +
						this.translate.instant(
							'smb.meetingExperience.meetingManager.aiMeetingManager.downloadNow'
						);
					break;
			}
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.AiMeetingManagerInstalled,
				this.isAMMInstalled
			);
		});
	}

	public launchOrDownloadAiMeetingManager() {
		if (this.isAMMInstalled) {
			try {
				WinRT.launchUri('ai-meeting-mamager:');
			} catch (error) {
				this.logger.error('launchAiMeetingManager' + error.message);
			}
		} else {
			try {
				WinRT.launchUri('ms-windows-store://pdp/?productid=9NJ7W58DLL4N');
				this.isAMMInstalledInterval = setInterval(() => {
					this.logger.debug(
						'Trying after 30 seconds for getting isAiMeetingManagerInstalled status'
					);
					this.checkAMMInstallationStatus();
				}, 30000);
			} catch (error) {
				this.logger.error('downloadAiMeetingManager' + error.message);
			}
		}
	}

	launchPanel() {
		this.audioVendorService.launchPanel();
	}

	launchDownloadLink() {
		this.audioVendorService.launchDownloadLink();
	}

	private initFeatures() {
		this.initAMM();
		this.initMockData();
		this.initMicrophoneFromCache();
		this.getMicrophoneSettingsAsync();
		this.startMicrophoneMonitor();
		this.initLSA();
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

	updateOptimizeMicrophoneSelection() {
		if (this.microphoneModesUIModel && this.microphoneModesUIModel.length > 0) {
			this.microphoneModesUIModel.forEach((element) => {
				element.isChecked = element.value === this.microOptimizeModeResponse.current;
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

		// const optimizeMode = ['Only My Voice', 'Normal', 'Multiple Voice', 'Voice Recogntion'];
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
		this.checkMenuItemsLength();
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

	// private defaultAudioCaptureDeviceChanged(args: any) {
	// 	this.getMicrophoneSettingsAsync();
	// }

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

	initLSA() {
		this.isSupportSmartAppearance = this.deviceService.supportSmartAppearance;
		this.isLSAInstalled = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SmartAppearanceInstalled,
			false
		);
		WinRT.queryUriSupport(
			'lenovo-smartappearance:',
			'E0469640.SmartAppearance_5grkq8ppsgwt4'
		).then((result) => {
			switch (result) {
				case 0:
				case 3:
					this.isLSAInstalled = true;
					break;
				default:
					this.isLSAInstalled = false;
					break;
			}
		});
	}

	smartAppearanceButtonClick() {
		this.launchOrDownloadSmartAppearance();
		const metricsData = {
			ItemParent: 'Page.MeetingManager',
			metricsEvent: 'FeatureClick',
			ItemName: this.isLSAInstalled
				? 'SmartAppearanceLaunchClick'
				: 'SmartAppearanceDownloadClick',
		};
		this.metricsService.sendMetrics(metricsData);
	}

	smartAppearanceBannerButtonClick() {
		this.launchOrDownloadSmartAppearance();
		const metricsData = {
			ItemParent: 'Page.MeetingManager',
			metricsEvent: 'FeatureClick',
			ItemName: this.isLSAInstalled
				? 'SmartAppearanceBannerLaunchClick'
				: 'SmartAppearanceBannerDownloadClick',
		};
		this.metricsService.sendMetrics(metricsData);
	}

	launchOrDownloadSmartAppearance() {
		if (this.isLSAInstalled) {
			WinRT.launchUri('lenovo-smartappearance:');
		} else {
			WinRT.launchUri('ms-windows-store://pdp/?productid=9NRLFDZ54PZB');
		}
	}
}