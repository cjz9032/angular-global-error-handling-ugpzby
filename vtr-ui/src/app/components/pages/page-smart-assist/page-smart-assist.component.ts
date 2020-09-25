import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { IntelligentSecurity } from 'src/app/data-models/smart-assist/intelligent-security.model';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { QaService } from 'src/app/services/qa/qa.service';
import { IntelligentScreen } from 'src/app/data-models/smart-assist/intelligent-screen.model';
import { PageAnchorLink } from 'src/app/data-models/common/page-achor-link.model';
import { SmartAssistCapability } from 'src/app/data-models/smart-assist/smart-assist-capability.model';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationExtras } from '@angular/router';
import { throttleTime } from 'rxjs/operators';
import { EMPTY, fromEvent, Subscription } from 'rxjs';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SmartAssistCache } from 'src/app/data-models/smart-assist/smart-assist-cache.model';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { HsaIntelligentSecurityResponse } from 'src/app/data-models/smart-assist/hsa-intelligent-security.model/hsa-intelligent-security.model';
import { UiRoundedRectangleRadioModel } from '../../ui/ui-rounded-rectangle-custom-radio-list/ui-rounded-rectangle-radio-list.model';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-page-smart-assist',
	templateUrl: './page-smart-assist.component.html',
	styleUrls: ['./page-smart-assist.component.scss']
})

export class PageSmartAssistComponent implements OnInit, OnDestroy {
	title = 'Smart Assist';
	back = 'BACK';
	backarrow = '< ';
	parentPath = 'device';
	@Output() distanceChange: any = new EventEmitter();
	public isThinkPad = true;
	public tooltipText = 'device.smartAssist.intelligentSecurity.zeroTouchLock.autoScreenLockTimer.toolTipContent';
	public humanPresenceDetectStatus = new FeatureStatus(false, true);
	public autoIrCameraLoginStatus = new FeatureStatus(false, true);
	public intelligentSecurity: IntelligentSecurity = new IntelligentSecurity();
	// public intelligentSecurityCopy: IntelligentSecurity;
	public autoScreenLockTimer = false;
	public zeroTouchLoginStatus = new FeatureStatus(false, true);
	public zeroTouchLockTitle: string;
	public options: any;
	// public keepMyDisplay: boolean;
	public getAutoScreenOffNoteStatus: any;
	public intelligentScreen: IntelligentScreen = new IntelligentScreen();
	public intelligentMedia = new FeatureStatus(false, true);
	public lenovoVoice = new FeatureStatus(false, true);
	public isIntelligentMediaLoading = true;
	public isAPSAvailable = false;
	private visibilityChange: any;
	private Windows: any;
	private windowsObj: any;
	public hpdSensorType = 0;
	public sensitivityVisibility = false;
	public sensitivityAdjustVal: number;
	smartAssistCache: SmartAssistCache;
	public isSuperResolutionLoading = true;
	public superResolution = new FeatureStatus(false, true);
	public hsaIntelligentSecurity = new HsaIntelligentSecurityResponse(false, false);
	public image = '/assets/images/smart-assist/intelligent-security/HPD_Img.png';
	public zeroTouchLoginShowAdvancedSection: boolean;
	public zeroTouchLockShowAdvancedSection: boolean;
	public zeroTouchPresenceLeaveDistanceCapability = false;
	public zeroTouchPresenceLeaveDistanceAutoAdjustCapability = false;
	public isRegisterHPDRpcCallback = false;
	private cameraAccessChangedHandler: any;
	public readonly metricsParent = CommonMetricsModel.ParentDeviceSettings;

	public featureInitialize = {
		security: true,
		sensing: false,
		screen: true,
		media: false,
		superResolution: false,
		aps: false,
		voice: true
	};

	headerMenuItems: PageAnchorLink[] = [];

	cardContentPositionA: any = {};
	private machineType: number;
	private smartAssistCapability: SmartAssistCapability = undefined;
	public jumpToSettingsTitle: string;
	public readonly FAST = '1';
	public readonly MEDIUM = '2';
	public readonly SLOW = '3';
	public zeroTouchLockTimersUIModel: Array<UiRoundedRectangleRadioModel> = [{
		componentId: 'autoScreenLockTimer_fast',
		label: 'device.smartAssist.intelligentSecurity.zeroTouchLock.autoScreenLockTimer.radioButton.fast',
		value: this.FAST,
		isChecked: this.intelligentSecurity.autoScreenLockTimer === this.FAST,
		isDisabled: !this.intelligentSecurity.isZeroTouchLockEnabled || (this.isThinkPad && !this.intelligentSecurity.isHPDEnabled),
		metricsItem: 'radio.screen-lock-timer.fast'
	},
	{
		componentId: 'autoScreenLockTimer_medium',
		label: 'device.smartAssist.intelligentSecurity.zeroTouchLock.autoScreenLockTimer.radioButton.medium',
		value: this.MEDIUM,
		isChecked: this.intelligentSecurity.autoScreenLockTimer === this.MEDIUM,
		isDisabled: !this.intelligentSecurity.isZeroTouchLockEnabled || (this.isThinkPad && !this.intelligentSecurity.isHPDEnabled),
		metricsItem: 'radio.screen-lock-timer.medium'
	},
	{
		componentId: 'autoScreenLockTimer_slow',
		label: 'device.smartAssist.intelligentSecurity.zeroTouchLock.autoScreenLockTimer.radioButton.slow',
		value: this.SLOW,
		isChecked: this.intelligentSecurity.autoScreenLockTimer === this.SLOW,
		isDisabled: !this.intelligentSecurity.isZeroTouchLockEnabled || (this.isThinkPad && !this.intelligentSecurity.isHPDEnabled),
		metricsItem: 'radio.screen-lock-timer.slow'
	}];

	private cmsSubscription: Subscription;


	constructor(
		routeHandler: RouteHandlerService, // logic is added in constructor, no need to call any method
		private smartAssist: SmartAssistService,
		private deviceService: DeviceService,
		public qaService: QaService,
		private cmsService: CMSService,
		private logger: LoggerService,
		private commonService: CommonService,
		private translate: TranslateService,
		public modalService: NgbModal,
		private router: Router,
		private vantageShellService: VantageShellService,
		private localCacheService: LocalCacheService,
		private metrics: CommonMetricsService
	) {
		this.jumpToSettingsTitle = this.translate.instant('device.smartAssist.jumpTo.title');

		this.fetchCMSArticles();

		// below logic required to getZeroTouchLockFacialRecoStatus when window is maximized from minimized state
		this.visibilityChange = this.onVisibilityChanged.bind(this);
		document.addEventListener('visibilitychange', this.visibilityChange);
		fromEvent(document.body, 'mouseenter')
			.pipe(
				throttleTime(2500)
			)
			.subscribe(() => {
				this.onMouseEnterEvent();
			});
		this.Windows = vantageShellService.getWindows();
		if (this.Windows) {
			this.windowsObj = this.Windows.Devices.Enumeration.DeviceAccessInformation
				.createFromDeviceClass(this.Windows.Devices.Enumeration.DeviceClass.videoCapture);
		}
	}

	private setSmartAssistCacheStorageValue(): void {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
	}

	async ngOnInit() {
		if (this.smartAssist.isShellAvailable) {
			this.machineType = this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineType);
			this.smartAssistCapability = this.localCacheService.getLocalCacheValue(LocalStorageKey.SmartAssistCapability, undefined);
			this.getHPDAdvancedSetting();
			this.initVisibility();
			this.setIsThinkPad(this.machineType === 1);
			this.setIntelligentSecurity();
			this.initHPDSensorType();
			this.setIntelligentScreen();
			this.initDataFromCache();
			this.initSmartAssist(true);
			this.getHPDLeaveSensitivityVisibilityStatus();
			this.startMonitorHsaIntelligentSecurityStatus();
		}

		if (this.windowsObj) {
			this.cameraAccessChangedHandler = (args: any) => {
				if (args && this.intelligentSecurity.isZeroTouchLockFacialRecoVisible) {
					this.permissionChanged();
				}
			};
			this.windowsObj.addEventListener('accesschanged', this.cameraAccessChangedHandler);
		}
	}

	ngOnDestroy() {
		document.removeEventListener('visibilitychange', this.visibilityChange);

		if (this.isRegisterHPDRpcCallback) {
			this.smartAssist.unRegisterHPDRpcCallback()
				.then((response) => {
					if (response === 0) {// response is the count of the registered callback_event
						this.logger.info('UnRegister HPD RPC Callback done.');
					}
				});
		}

		if (this.windowsObj) {
			this.windowsObj.removeEventListener('accesschanged', this.cameraAccessChangedHandler);
		}

		if (this.cmsSubscription) {
			this.cmsSubscription.unsubscribe();
		}
	}

	initDataFromCache() {
		try {
			this.smartAssistCache = this.localCacheService.getLocalCacheValue(LocalStorageKey.SmartAssistCache, undefined);
			if (this.smartAssistCache !== undefined) {
				this.intelligentSecurity = this.smartAssistCache.intelligentSecurity;
				this.intelligentScreen = this.smartAssistCache.intelligentScreen;
				this.intelligentMedia = this.smartAssistCache.intelligentMedia;
				this.isAPSAvailable = this.smartAssistCache.isAPSAvailable;
				this.hpdSensorType = this.smartAssistCache.hpdSensorType;
				this.sensitivityVisibility = this.smartAssistCache.sensitivityVisibility;
			} else {
				this.smartAssistCache = new SmartAssistCache();
				this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
				this.smartAssistCache.intelligentScreen = this.intelligentScreen;
				this.smartAssistCache.intelligentMedia = this.intelligentMedia;
				this.smartAssistCache.isAPSAvailable = this.isAPSAvailable;
				this.smartAssistCache.hpdSensorType = this.hpdSensorType;
				this.smartAssistCache.sensitivityVisibility = this.sensitivityVisibility;
				this.setSmartAssistCacheStorageValue();
			}
			this.smartAssistCache.intelligentSecurity.isIntelligentSecuritySupported = this.smartAssistCapability.isIntelligentSecuritySupported;
			this.updateZeroTouchLockTimersUIModel();
		} catch (error) {
			this.logger.exception('initDataFromCache', error);
		}
	}

	initVisibility() {
		try {
			this.logger.info('initVisibility: ', this.smartAssistCapability);
			if (this.smartAssistCapability.isIntelligentSecuritySupported) {
				this.checkHeaderMenuItems(true, 'security');
			}
			this.lenovoVoice.available = this.smartAssistCapability.isLenovoVoiceSupported;
			if (this.smartAssistCapability.isLenovoVoiceSupported) {
				this.checkHeaderMenuItems(true, 'voice');
			}
			if (this.smartAssistCapability.isIntelligentMediaSupported.available || this.smartAssistCapability.isSuperResolutionSupported.available) {
				this.checkHeaderMenuItems(true, 'media');
			}
			if (this.smartAssistCapability.isIntelligentScreenSupported) {
				this.checkHeaderMenuItems(true, 'screen');
			}
			if (this.smartAssistCapability.isAPSSupported) {
				this.checkHeaderMenuItems(true, 'aps');
			}
			if (this.smartAssistCapability.isAntiTheftSupported.available) {
				this.checkHeaderMenuItems(true, 'sensing');
			}
		} catch (error) {
			this.logger.exception('initVisibility', error.message);
		}
	}

	private setIntelligentSecurity() {
		this.intelligentSecurity = new IntelligentSecurity();
		this.intelligentSecurity.isHPDEnabled = true;
		this.intelligentSecurity.zeroTouchLoginDistance = 1;
		this.intelligentSecurity.isZeroTouchLoginEnabled = true;
		this.intelligentSecurity.isZeroTouchLockEnabled = true;
		this.intelligentSecurity.autoScreenLockTimer = '0';
		this.intelligentSecurity.isZeroTouchLockVisible = true;
		this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = false;
		this.intelligentSecurity.isZeroTouchLoginVisible = false;
		this.intelligentSecurity.isIntelligentSecuritySupported = false;
		this.intelligentSecurity.isWindowsHelloRegistered = false;
		this.intelligentSecurity.isZeroTouchLockFacialRecoVisible = false;
		this.intelligentSecurity.isZeroTouchLockFacialRecoEnabled = false;
		this.intelligentSecurity.facilRecognitionCameraAccess = true;
		this.intelligentSecurity.facialRecognitionCameraPrivacyMode = false;
		this.intelligentSecurity.isDistanceSensitivityVisible = false;
		this.updateZeroTouchLockTimersUIModel();
	}

	private setIntelligentScreen() {
		this.intelligentScreen = new IntelligentScreen();
		this.intelligentScreen.isIntelligentScreenVisible = false;
		this.intelligentScreen.isAutoScreenOffVisible = false;
		this.intelligentScreen.isAutoScreenOffEnabled = false;
		this.intelligentScreen.isAutoScreenOffNoteVisible = false;
		this.intelligentScreen.isReadingOrBrowsingVisible = false;
		this.intelligentScreen.isReadingOrBrowsingEnabled = false;
		this.intelligentScreen.readingOrBrowsingTime = 0;
	}

	// invoke HPD related JS bridge calls
	private initSmartAssist(isFirstTimeLoad: boolean) {
		this.logger.info('PageSmartAssistComponent.initSmartAssist', { isFirstTimeLoad });
		this.apsAvailability();

		if (this.smartAssistCapability === undefined) {
			this.initZeroTouchLock();
			this.initZeroTouchLogin();
			this.initIntelligentScreen();
			this.getVideoPauseResumeStatus();
			this.getSuperResolutionStatus();
			this.getHsaIntelligentSecurityStatus();
		} else {
			if (this.smartAssistCapability.isIntelligentSecuritySupported) {
				this.intelligentSecurity.isIntelligentSecuritySupported = true;

				this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
				this.initZeroTouchLock();
				this.initZeroTouchLogin();
			}
			if (this.smartAssistCapability.isIntelligentMediaSupported && isFirstTimeLoad) {
				this.intelligentMedia = this.smartAssistCapability.isIntelligentMediaSupported;
				this.smartAssistCache.intelligentMedia = this.intelligentMedia;
				this.getVideoPauseResumeStatus();
			}
			if (this.smartAssistCapability.isIntelligentScreenSupported) {
				this.intelligentScreen.isIntelligentScreenVisible = true;
				this.smartAssistCache.intelligentScreen = this.intelligentScreen;
				this.initIntelligentScreen();
			}
			if (this.smartAssistCapability.isSuperResolutionSupported) {
				this.superResolution = this.smartAssistCapability.isSuperResolutionSupported;
				this.getSuperResolutionStatus();
			}
			if (this.smartAssistCapability.isHsaIntelligentSecuritySupported && isFirstTimeLoad) {
				this.hsaIntelligentSecurity = this.smartAssistCapability.isHsaIntelligentSecuritySupported;
				this.getHsaIntelligentSecurityStatus();
			}
			this.setSmartAssistCacheStorageValue();
		}
	}

	public getHPDLeaveSensitivityVisibilityStatus() {
		try {
			this.logger.info('getHPDLeaveSensitivityVisibility API call----->');
			this.smartAssist.getHPDLeaveSensitivityVisibility().then((value: any) => {
				this.logger.info('getHPDLeaveSensitivityVisibility value----->', value);
				this.sensitivityVisibility = value;
				this.smartAssistCache.sensitivityVisibility = value;
				this.setSmartAssistCacheStorageValue();

				if (this.sensitivityVisibility) {
					this.getHPDLeaveSensitivityStatus();
				}
			});

		} catch (error) {
			this.logger.error('getHPDLeaveSensitivityVisibilityStatus', error.message);
			return EMPTY;
		}
	}

	public async getHPDLeaveSensitivityStatus() {
		try {
			this.logger.info('getHPDLeaveSensitivity API call----->');
			await this.smartAssist.getHPDLeaveSensitivity().then((value: any) => {
				this.sensitivityAdjustVal = value || 2;
				this.logger.info('getHPDLeaveSensitivity value----->', value);
			});
		} catch (error) {
			this.logger.error('getHPDLeaveSensitivityStatus', error.message);
			return EMPTY;
		}
	}

	public setHPDLeaveSensitivitySetting($event: number) {
		const value = $event;
		this.sensitivityAdjustVal = value;
		try {
			this.smartAssist.SetHPDLeaveSensitivitySetting(value).then((response: any) => {
				this.logger.info('setHPDLeaveSensitivitySetting value----->', { value, response });
			});
		} catch (error) {
			this.logger.error('setHPDLeaveSensitivitySetting', error.message);
			return EMPTY;
		}
	}


	private apsAvailability() {
		Promise
			.all([this.smartAssist.getAPSCapability(), this.smartAssist.getSensorStatus(), this.smartAssist.getHDDStatus()])
			.then((response: any[]) => {
				this.logger.info('APS Capability ---------------------------------', response);
				(response[0] && response[1] && response[2] > 0) ? this.isAPSAvailable = true : this.isAPSAvailable = false;

				this.featureInitialize.aps = true;
				this.checkHeaderMenuItems(this.isAPSAvailable, 'aps');

				this.smartAssistCache.isAPSAvailable = this.isAPSAvailable;
				this.setSmartAssistCacheStorageValue();
			})
			.catch((error) => { this.logger.info('APS ERROR------------------', error.message); });
	}

	private initIntelligentScreen() {
		Promise.all([
			this.smartAssist.getIntelligentScreenVisibility(),
			this.smartAssist.getAutoScreenOffVisibility(),
			this.smartAssist.getAutoScreenOffStatus(),
			this.smartAssist.getAutoScreenOffNoteStatus(),
			this.smartAssist.getReadingOrBrowsingVisibility(),
			this.smartAssist.getReadingOrBrowsingStatus(),
			this.smartAssist.getReadingOrBrowsingTime(),
		]).then(([
			intelligentScreenVisibilityResponse,
			autoScreenOffVisibilityResponse,
			autoScreenOffStatusResponse,
			autoScreenOffNoteStatusResponse,
			readingOrBrowsingVisibilityResponse,
			readingOrBrowsingStatusResponse,
			readingOrBrowsingTimeResponse
		]: any) => {
			this.intelligentScreen.isIntelligentScreenVisible = intelligentScreenVisibilityResponse;
			this.intelligentScreen.isAutoScreenOffVisible = autoScreenOffVisibilityResponse;
			this.intelligentScreen.isAutoScreenOffEnabled = autoScreenOffStatusResponse;
			this.intelligentScreen.isAutoScreenOffNoteVisible = autoScreenOffNoteStatusResponse;
			this.intelligentScreen.isReadingOrBrowsingVisible = readingOrBrowsingVisibilityResponse;
			this.intelligentScreen.isReadingOrBrowsingEnabled = readingOrBrowsingStatusResponse;
			this.intelligentScreen.readingOrBrowsingTime = readingOrBrowsingTimeResponse;

			this.featureInitialize.screen = true;
			this.checkHeaderMenuItems(this.intelligentScreen.isIntelligentScreenVisible, 'screen');

			this.smartAssistCache.intelligentScreen = this.intelligentScreen;
			this.setSmartAssistCacheStorageValue();
			this.getAutoScreenOffNoteStatusFunc();
		}).catch(error => {
			this.logger.error('error in PageSmartAssistComponent.Promise.IntelligentScreen()', error.message);
			return EMPTY;
		});
	}

	private getAutoScreenOffNoteStatusFunc() {
		this.getAutoScreenOffNoteStatus = setInterval(() => {
			// this.logger.info('Trying after 30 seconds for getting auto screenOffNoteStatus');
			this.smartAssist.getAutoScreenOffNoteStatus().then((response) => {
				this.intelligentScreen.isAutoScreenOffNoteVisible = response;
			});
		}, 30000);
	}
	private initZeroTouchLogin(): void {
		Promise.all([
			this.smartAssist.getZeroTouchLoginVisibility(),
			this.smartAssist.getZeroTouchLoginStatus(),
			this.smartAssist.getZeroTouchLoginDistance(),
			this.smartAssist.getZeroTouchLoginAdjustVisibility(),
			this.smartAssist.getZeroTouchLoginAdjustStatus(),
			this.smartAssist.getWindowsHelloStatus()
		]).then(([
			zeroTouchLoginVisibilityResponse,
			zeroTouchLoginStatusResponse,
			zeroTouchLoginDistanceResponse,
			zeroTouchLoginAdjustVisibilityResponse,
			zroTouchLoginAdjustStatusResponse,
			windowsHelloStatusResponse
		]: any) => {
			this.intelligentSecurity.isZeroTouchLoginVisible = zeroTouchLoginVisibilityResponse;
			this.intelligentSecurity.isZeroTouchLoginEnabled = zeroTouchLoginStatusResponse;
			this.intelligentSecurity.zeroTouchLoginDistance = zeroTouchLoginDistanceResponse;
			this.intelligentSecurity.isDistanceSensitivityVisible = zeroTouchLoginAdjustVisibilityResponse;
			this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = zroTouchLoginAdjustStatusResponse;
			this.intelligentSecurity.isWindowsHelloRegistered = windowsHelloStatusResponse;
			this.logger.info('PageSmartAssistComponent.Promise.ZeroTouchLogin()', this.intelligentSecurity);
			this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
		}).catch(error => {
			this.logger.error('error in PageSmartAssistComponent.Promise.ZeroTouchLogin()', error.message);
			return EMPTY;
		});
	}

	private initZeroTouchLock() {
		Promise.all([
			this.smartAssist.getZeroTouchLockVisibility(),
			this.smartAssist.getZeroTouchLockStatus(),
			this.smartAssist.getSelectedLockTimer(),
			this.smartAssist.getHPDStatus(),
			this.smartAssist.getHPDVisibility(),
			this.getFacialRecognitionStatus()
		]).then(([
			zeroTouchLockVisibilityResponse,
			zeroTouchLockStatusResponse,
			selectedLockTimerResponse,
			HPDStatusResponse,
			HPDVisibilityResponse
		]: any) => {
			this.intelligentSecurity.isZeroTouchLockVisible = zeroTouchLockVisibilityResponse;
			this.intelligentSecurity.isZeroTouchLockEnabled = zeroTouchLockStatusResponse;
			this.intelligentSecurity.autoScreenLockTimer = selectedLockTimerResponse.toString();
			this.intelligentSecurity.isHPDEnabled = HPDStatusResponse;
			this.intelligentSecurity.isIntelligentSecuritySupported = HPDVisibilityResponse;
			this.featureInitialize.security = true;
			this.checkHeaderMenuItems(this.intelligentSecurity.isIntelligentSecuritySupported, 'security');
			this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
			this.setSmartAssistCacheStorageValue();
			this.updateZeroTouchLockTimersUIModel();

			this.logger.info('PageSmartAssistComponent.Promise.initZeroTouchLock()', this.intelligentSecurity);
		}).catch(error => {
			this.logger.error('error in PageSmartAssistComponent.Promise.initZeroTouchLock()', error.message);
			return EMPTY;
		});
	}

	public onHumanPresenceDetectStatusToggle($event): void {
		this.intelligentSecurity.isHPDEnabled = $event.switchValue;
		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.setSmartAssistCacheStorageValue();
		this.updateZeroTouchLockTimersUIModel();
		this.smartAssist.setHPDStatus(this.intelligentSecurity.isHPDEnabled)
			.then((isSuccess: boolean) => {
				this.logger.info(`onHumanPresenceDetectStatusToggle.setHPDStatus ${isSuccess}`, this.intelligentSecurity.isHPDEnabled);
			});
	}

	public onZeroTouchLoginStatusToggle(event): void {
		this.intelligentSecurity.isZeroTouchLoginEnabled = event.switchValue;

		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setZeroTouchLoginStatus(this.intelligentSecurity.isZeroTouchLoginEnabled)
			.then((isSuccess: boolean) => {
				this.logger.info(`onZeroTouchLoginStatusToggle.setZeroTouchLoginStatus ${isSuccess}`, this.intelligentSecurity.isZeroTouchLoginEnabled);
			});
	}

	public setZeroTouchLoginSensitivity($event: number) {
		const value = $event;
		this.logger.info('setZeroTouchLoginSensitivity', value);
		this.intelligentSecurity.zeroTouchLoginDistance = value;

		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setZeroTouchLoginDistance(value)
			.then((isSuccess: boolean) => {
				this.logger.info(`setZeroTouchLoginSensitivity.setSelectedLockTimer ${isSuccess}`, value);
			});
	}

	// this is invoked when auto lock feature is toggled
	public onZeroTouchLockStatusToggle(event): void {
		this.intelligentSecurity.isZeroTouchLockEnabled = event.switchValue;
		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
		this.updateZeroTouchLockTimersUIModel();
		this.smartAssist.setZeroTouchLockStatus(this.intelligentSecurity.isZeroTouchLockEnabled)
			.then((isSuccess: boolean) => {
				this.logger.info(`onChangeZeroTouchLockFlag.setAutoLockStatus ${isSuccess}`, this.intelligentSecurity.isZeroTouchLockEnabled);
			});
	}



	public onZeroTouchLockTimerChange($event) {
		const value = $event.value;
		this.intelligentSecurity.autoScreenLockTimer = value;

		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setSelectedLockTimer(value)
			.then((isSuccess: boolean) => {
				this.logger.info(`onZeroTouchLockTimerChange.setSelectedLockTimer ${isSuccess}`, value);
				// this.setUpZeroTouchLockTimerRadioDetails();
			});

	}

	public onZeroTouchLockFacialRecoChange($event: boolean) {
		this.intelligentSecurity.isZeroTouchLockFacialRecoEnabled = $event;
		this.logger.info(`onZeroTouchLockFacialRecoChange.setZeroTouchLockFacialRecoStatus before API ${$event}`);
		this.smartAssist.setZeroTouchLockFacialRecoStatus($event)
			.then((isSuccess: boolean) => {
				this.logger.info(`onZeroTouchLockFacialRecoChange.setZeroTouchLockFacialRecoStatus after API ${isSuccess} ; ${$event}`);
				this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
				this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
			});
	}

	public onDistanceSensitivityAdjustToggle(event): void {
		this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = event.switchValue;

		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setZeroTouchLoginAdjustStatus(this.intelligentSecurity.isZeroTouchLoginAdjustEnabled)
			.then((isSuccess: boolean) => {
				if (!event.switchValue) { // refresh slider-bar when turn off the autoAdjust toggle
					this.smartAssist.getZeroTouchLoginDistance().then((response) => {
						this.intelligentSecurity.zeroTouchLoginDistance = response;
						this.smartAssistCache.intelligentSecurity.zeroTouchLoginDistance = this.intelligentSecurity.zeroTouchLoginDistance;
					});
				}
				this.logger.info(`onDistanceSensitivityAdjustToggle.setZeroTouchLoginAdjustStatus ${isSuccess}`, this.intelligentSecurity.isZeroTouchLoginAdjustEnabled);
			});
	}

	getHPDAdvancedSetting() {
		this.smartAssist.getHPDAdvancedSetting()
			.then((response) => {
				this.zeroTouchLoginShowAdvancedSection = response.zeroTouchLoginAdvanced;
				this.zeroTouchLockShowAdvancedSection = response.zeroTouchLockAdvanced;
			});
	}

	setHPDAdvancedSetting(section: string) {
		const value = section === 'zeroTouchLogin' ? !this.zeroTouchLoginShowAdvancedSection : !this.zeroTouchLockShowAdvancedSection;
		this.smartAssist.setHPDAdvancedSetting(section, value)
			.then((response) => {
				if (response) {
					this.getHPDAdvancedSetting();
				}
				this.metrics.sendMetrics(value, section + '-advancedSettings', CommonMetricsModel.ParentSmartAssist);
			});
	}

	public getHsaIntelligentSecurityStatus() {
		try {
			if (this.smartAssist.isHPDShellAvailable) {
				this.smartAssist.getHsaIntelligentSecurityStatus()
					.then((response: HsaIntelligentSecurityResponse) => {
						this.zeroTouchPresenceLeaveDistanceAutoAdjustCapability = (response.capability && 0x100) !== 0;
						this.zeroTouchPresenceLeaveDistanceCapability = (response.capability && 0x80) !== 0;
						this.hsaIntelligentSecurity = response;

						if (!this.isRegisterHPDRpcCallback) {
							if (this.zeroTouchPresenceLeaveDistanceCapability || this.zeroTouchPresenceLeaveDistanceAutoAdjustCapability) {
								this.smartAssist.registerHPDRpcCallback()
									.then((hpdResponse) => {
										if (hpdResponse === 1) { // response is the count of the registered callback_event
											this.isRegisterHPDRpcCallback = true;
											this.logger.info('Register HPD RPC Callback done.');
										}
									});
							}
						}
					});
			}
		} catch (error) {
			this.logger.info('getHsaIntelligentSecurityStatus' + error.message);
		}
	}

	public onZeroTouchLockDistanceSensitivityAdjustToggle(event): void {
		this.hsaIntelligentSecurity.zeroTouchLockDistanceAutoAdjust = event.switchValue;
		if (this.smartAssist.isHPDShellAvailable) {
			this.smartAssist.setZeroTouchLockDistanceSensitivityAutoAdjust(event.switchValue)
				.then((response) => {
					if (response === 0 && !event.switchValue) {
						this.getHsaIntelligentSecurityStatus(); // refresh slider-bar when turn off the autoAdjust toggle
					}
				});
		}
	}

	public SetZeroTouchLockDistanceSensitivity($event: number) {
		const value = $event;
		this.hsaIntelligentSecurity.zeroTouchLockDistance = value;
		if (this.smartAssist.isHPDShellAvailable) {
			this.smartAssist.setZeroTouchLockDistanceSensitivity(value)
				.then((response) => {
					if (response !== 0) {
						this.logger.info('SetZeroTouchLockDistanceSensitivity error.');
					}
				});
		}
	}

	public startMonitorHsaIntelligentSecurityStatus() {
		if (this.smartAssist.isHPDShellAvailable) {
			this.smartAssist.startMonitorHsaIntelligentSecurityStatus(this.hsaIntelligentSecurityChange.bind(this))
				.then((value) => {
					this.logger.info('startMonitorHsaIntelligentSecurityStatus.then', value);
				});
		}
	}

	public hsaIntelligentSecurityChange(data: any) {
		const response = JSON.parse(data);
		if (response && response.errorCode === 0) {
			this.hsaIntelligentSecurity.capacity = response.capacity;
			this.hsaIntelligentSecurity.capability = response.capability;
			this.hsaIntelligentSecurity.sensorType = response.sensorType;
			this.hsaIntelligentSecurity.zeroTouchLockDistanceAutoAdjust = response.presenceLeaveDistanceAutoAdjust;
			this.hsaIntelligentSecurity.zeroTouchLockDistance = response.presenceLeaveDistance;
			this.zeroTouchPresenceLeaveDistanceAutoAdjustCapability = (response.capability && 0x100) !== 0;
			this.zeroTouchPresenceLeaveDistanceCapability = (response.capability && 0x80) !== 0;
		}
		this.logger.info('hsaIntelligentSecurityChange', data);
	}

	public onDisplayDimTimeChange($event: number) {
		const value = $event;
		this.intelligentScreen.readingOrBrowsingTime = value;

		this.smartAssistCache.intelligentScreen = this.intelligentScreen;
		this.setSmartAssistCacheStorageValue();

		this.smartAssist.setReadingOrBrowsingTime(value)
			.then((isSuccess: boolean) => {
				this.logger.info(`onZeroTouchLockTimerChange.setSelectedLockTimer ${isSuccess}`, value);
			});
	}

	private setIsThinkPad(isThinkPad) {
		// service call to fetch type of device
		this.isThinkPad = isThinkPad;
	}

	public launchFaceEnrollment() {
		this.deviceService.launchUri('ms-settings:signinoptions');
	}

	public onAutoScreenOffToggle(event): void {
		this.intelligentScreen.isAutoScreenOffEnabled = event.switchValue;
		this.smartAssistCache.intelligentScreen = this.intelligentScreen;
		this.setSmartAssistCacheStorageValue();

		this.smartAssist.setAutoScreenOffStatus(event.switchValue)
			.then((isSuccess: boolean) => {
				this.logger.info(`onAutoScreenOffToggle.setAutoScreenOffStatus ${isSuccess}`, event.switchValue);
			});
	}

	public onKeepMyDisplayToggle(event): void {
		this.intelligentScreen.isReadingOrBrowsingEnabled = event.switchValue;

		this.smartAssistCache.intelligentScreen = this.intelligentScreen;
		this.setSmartAssistCacheStorageValue();

		this.smartAssist.setReadingOrBrowsingStatus(event.switchValue)
			.then((isSuccess: boolean) => {
				this.logger.info(`onKeepMyDisplayToggle.setReadingOrBrowsingStatus ${isSuccess}`, event.switchValue);
			});
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'device-settings'
		};

		this.cmsSubscription = this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
					}
				}
			},
			error => {
				this.logger.info('fetchCMSContent error', error.message);
			}
		);
	}

	public onResetDefaultSettings($event) {
		if (this.smartAssist.isHPDShellAvailable) {
			this.smartAssist.resetHSAHPDSetting()
				.then((response) => {
					if (response === 0) {
						this.logger.info('resetHSAHPDSetting done.');
					}
				});
		}

		this.smartAssist.resetHPDSetting()
			.then((isSuccess: boolean) => {
				this.logger.info('onResetDefaultSettings.resetHPDSetting', isSuccess);
				if (this.smartAssist.isShellAvailable) {
					this.initSmartAssist(false);
				}
				this.getHPDLeaveSensitivityStatus();
			});

		if (this.intelligentSecurity.isZeroTouchLockFacialRecoVisible) {
			this.smartAssist.resetFacialRecognitionStatus().then((res) => {
				this.logger.info(`HPDReset - resetFacialRecognitionStatus ${res}`);
				if (this.smartAssist.isShellAvailable) {
					this.getFacialRecognitionStatus();
				}
			});
		}
	}

	private getVideoPauseResumeStatus() {
		this.logger.debug('PageSmartAssistComponent.getVideoPauseResumeStatus: before check cache');
		try {
			if (this.smartAssist.isShellAvailable) {
				const assistCapability: SmartAssistCapability = this.localCacheService.getLocalCacheValue(LocalStorageKey.SmartAssistCapability, null);

				if (assistCapability && assistCapability.isIntelligentMediaSupported) {
					this.intelligentMedia = assistCapability.isIntelligentMediaSupported;
					this.logger.debug('PageSmartAssistComponent.getVideoPauseResumeStatus: cache found', this.intelligentMedia);
					this.isIntelligentMediaLoading = false;
				}

				// get current value from API
				this.logger.debug('PageSmartAssistComponent.getVideoPauseResumeStatus: get current status from API');
				this.smartAssist.getVideoPauseResumeStatus()
					.then((response: FeatureStatus) => {
						this.isIntelligentMediaLoading = false;
						this.intelligentMedia = response;
						this.logger.debug('PageSmartAssistComponent.getVideoPauseResumeStatus: response from API', response);

						this.featureInitialize.media = true;
						this.checkHeaderMenuItems(response.available, 'media');

						this.smartAssistCache.intelligentMedia = this.intelligentMedia;
						this.setSmartAssistCacheStorageValue();
					}).catch(error => {
						this.logger.error('PageSmartAssistComponent.getVideoPauseResumeStatus: error', error);
					});
			}
		} catch (error) {
			this.logger.exception('PageSmartAssistComponent.getVideoPauseResumeStatus: exception', error);
		}
	}

	initHPDSensorType() {
		try {
			if (this.smartAssist.isShellAvailable) {
				this.logger.info('initHPDSensorType API call', this.hpdSensorType);
				this.smartAssist.getHPDSensorType()
					.then((type: number) => {
						this.hpdSensorType = type;
						this.smartAssistCache.hpdSensorType = this.hpdSensorType;
						this.setSmartAssistCacheStorageValue();
						this.logger.info('initHPDSensorType then', this.hpdSensorType);
					}).catch(error => {
						this.logger.error('initHPDSensorType error', error);
					});
			}
		} catch (error) { }
	}

	public getSuperResolutionStatus() {
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.getSuperResolutionStatus()
					.then((response: FeatureStatus) => {
						this.isSuperResolutionLoading = false;
						this.superResolution = response;
						this.featureInitialize.superResolution = true;
						this.checkHeaderMenuItems(response.available, 'media');
					}).catch(error => {
						this.logger.error('getSuperResolutionStatus.error', error);
					});
			}
		} catch (error) {
			this.logger.error('getSuperResolutionStatus' + error.message);
		}
	}

	public updateSensingHeaderMenu(value: boolean) {
		try {
			this.featureInitialize.sensing = true;
			this.checkHeaderMenuItems(value, 'sensing');
		} catch (error) {
			this.logger.error('updateSensingHeaderMenu' + error.message);
		}
	}

	onClick(path) {
		if (path) {
			this.deviceService.launchUri(path);
		}
	}

	onJumpClick() {
		const navigationExtras: NavigationExtras = {
			queryParams: { cameraSession_id: 'camera' },
			fragment: 'anchor'
		};
		// this.router.navigate(['/device/device-settings/display-camera']);
		this.router.navigate(['/device/device-settings/display-camera'], navigationExtras);
	}

	getFacialRecognitionStatus() {
		this.logger.info(`getFacialRecognitionStatus.getZeroTouchLockFacialRecoStatus before API call`);
		return this.smartAssist.getZeroTouchLockFacialRecoStatus().then((res: any) => {
			if (res) {
				this.intelligentSecurity.isZeroTouchLockFacialRecoVisible = res.available;
				this.intelligentSecurity.isZeroTouchLockFacialRecoEnabled = res.status;
				this.intelligentSecurity.facilRecognitionCameraAccess = res.cameraPermission;
				this.intelligentSecurity.facialRecognitionCameraPrivacyMode = res.privacyModeStatus;
				this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
				this.setSmartAssistCacheStorageValue();
			}
			this.logger.info(`getFacialRecognitionStatus.getZeroTouchLockFacialRecoStatus after API call`, res);
		});
	}

	onVisibilityChanged() {
		if (!document.hidden) {
			this.getFacialRecognitionStatus();
			this.logger.info(`zero touch lock facial recognition visibilityChanged - getFacialRecognitionStatus`);
		}
	}

	onMouseEnterEvent() {
		this.getFacialRecognitionStatus();
		this.logger.info(`zero touch lock facial recognition onMouseEnterEvent - getFacialRecognitionStatus`);
	}

	permissionChanged() {
		this.getFacialRecognitionStatus();
		this.logger.info(`zero touch lock facial recognition permissionChange - getFacialRecognitionStatus`);
	}

	public checkHeaderMenuItems(available: boolean, featurePath: string) {
		let isExist = false;
		this.headerMenuItems.some((item) => {
			if (item.path === featurePath) {
				isExist = true;
			}
		});

		if (available && !isExist) {
			let featureHeaderMenu;
			if (featurePath === 'security') {
				featureHeaderMenu = {
					title: 'device.smartAssist.intelligentSecurity.title',
					path: 'security',
					sortOrder: 1,
					metricsItem: 'IntelligentSecurity'
				};
			}
			else if (featurePath === 'sensing') {
				featureHeaderMenu = {
					title: 'device.smartAssist.antiTheft.heading',
					path: 'sensing',
					sortOrder: 2,
					metricsItem: 'IntelligentSensing'
				};
			}
			else if (featurePath === 'screen') {
				featureHeaderMenu = {
					title: 'device.smartAssist.intelligentScreen.title',
					path: 'screen',
					sortOrder: 3,
					metricsItem: 'IntelligentScreen'
				};
			}
			else if (featurePath === 'media') {
				featureHeaderMenu = {
					title: 'device.smartAssist.intelligentMedia.heading',
					path: 'media',
					sortOrder: 4,
					metricsItem: 'IntelligentMedia'
				};
			}
			else if (featurePath === 'aps') {
				featureHeaderMenu = {
					title: 'device.smartAssist.activeProtectionSystem.title',
					path: 'aps',
					sortOrder: 5,
					metricsItem: 'ActiveProtectionSystem'
				};
			}
			else if (featurePath === 'voice') {
				featureHeaderMenu = {
					title: 'device.smartAssist.voice.title',
					path: 'voice',
					sortOrder: 6,
					metricsItem: 'Voice'
				};
			}
			if (featureHeaderMenu !== undefined) {
				this.headerMenuItems = this.commonService.addToObjectsList(this.headerMenuItems, featureHeaderMenu);
			}
		}

		if (!available && isExist) {
			if (featurePath === 'media') {
				if (this.featureInitialize.media && this.featureInitialize.superResolution && !this.superResolution.available && !this.intelligentMedia.available) {
					this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, featurePath);
				}
			} else {
				this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, featurePath);
			}
		}

		if (this.featureInitialize.aps
			&& this.featureInitialize.media
			&& this.featureInitialize.screen
			&& this.featureInitialize.security
			&& this.featureInitialize.sensing
			&& this.featureInitialize.superResolution
			&& this.featureInitialize.voice) {
			if (this.headerMenuItems.length === 1) {
				this.headerMenuItems = [];
				this.jumpToSettingsTitle = '';
			}
		}

		if (this.headerMenuItems.length >= 2) {
			this.headerMenuItems = this.headerMenuItems.sort((a, b) => a.sortOrder - b.sortOrder);
		}
	}

	updateZeroTouchLockTimersUIModel() {
		if (this.zeroTouchLockTimersUIModel && this.zeroTouchLockTimersUIModel.length > 0) {
			this.zeroTouchLockTimersUIModel.forEach(model => {
				model.isChecked = (this.intelligentSecurity.autoScreenLockTimer === model.value);
				model.isDisabled = !this.intelligentSecurity.isZeroTouchLockEnabled || (this.isThinkPad && !this.intelligentSecurity.isHPDEnabled);
			});
		}
	}

}
