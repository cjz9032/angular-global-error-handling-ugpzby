import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { ChangeContext } from 'ng5-slider';

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
import { EMPTY, fromEvent } from 'rxjs';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SmartAssistCache } from 'src/app/data-models/smart-assist/smart-assist-cache.model';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';

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
	@Output() distanceChange: EventEmitter<ChangeContext> = new EventEmitter();
	public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
	public isThinkPad = true;
	public tooltipText = 'device.smartAssist.intelligentSecurity.zeroTouchLock.autoScreenLockTimer.toolTipContent';
	public humanPresenceDetectStatus = new FeatureStatus(false, true);
	public autoIrCameraLoginStatus = new FeatureStatus(false, true);
	public intelligentSecurity: IntelligentSecurity;
	// public intelligentSecurityCopy: IntelligentSecurity;
	public autoScreenLockTimer = false;
	public zeroTouchLoginStatus = new FeatureStatus(false, true);
	public zeroTouchLockTitle: string;
	public options: any;
	// public keepMyDisplay: boolean;
	public getAutoScreenOffNoteStatus: any;
	public intelligentScreen: IntelligentScreen;
	public intelligentMedia = new FeatureStatus(false, true);
	public lenovoVoice = new FeatureStatus(false, true);
	public isIntelligentMediaLoading = true;
	public isAPSAvailable = false;
	private visibilityChange: any;
	private Windows: any;
	private windowsObj: any;
	public hpdSensorType = 0;
	public sensitivityVisibility = false;
	public sesnsitivityAdjustVal: number;
	smartAssistCache: SmartAssistCache;
	public isSuperResolutionLoading = true;
	public superResolution = new FeatureStatus(false, true);

	headerMenuItems: PageAnchorLink[] = [
		{
			title: 'device.smartAssist.intelligentSecurity.title',
			path: 'security',
			sortOrder: 1,
			metricsItem: 'IntelligentSecurity'
		},
		{
			title: 'device.smartAssist.intelligentScreen.title',
			path: 'screen',
			sortOrder: 2,
			metricsItem: 'IntelligentScreen'
		},
		{
			title: 'device.smartAssist.intelligentMedia.heading',
			path: 'media',
			sortOrder: 3,
			metricsItem: 'IntelligentMedia'
		},
		{
			title: 'device.smartAssist.activeProtectionSystem.title',
			path: 'aps',
			sortOrder: 4,
			metricsItem: 'ActiveProtectionSystem'
		},
		{
			title: 'device.smartAssist.voice.title',
			path: 'voice',
			sortOrder: 5,
			metricsItem: 'Voice'
		},

	];

	cardContentPositionA: any = {};
	private machineType: number;
	private smartAssistCapability: SmartAssistCapability = undefined;
	public jumpTosettingsTitle: string;

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
		private vantageShellService: VantageShellService
	) {
		this.jumpTosettingsTitle = this.translate.instant('device.smartAssist.jumpTo.title');
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchCMSArticles();
		});

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

			this.windowsObj.addEventListener('accesschanged', () => {
				this.permissionChanged();
			});
		}
	}

	ngOnInit() {
		if (this.smartAssist.isShellAvailable) {
			this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
			this.smartAssistCapability = this.commonService.getLocalStorageValue(LocalStorageKey.SmartAssistCapability, undefined);
			this.initVisibility();
			this.setIsThinkPad(this.machineType === 1);
			this.setIntelligentSecurity();
			this.initHPDSensorType();
			this.setIntelligentScreen();
			this.initDataFromCache();
			this.initSmartAssist(true);
			this.getHPDLeaveSensitivityVisibilityStatus();
		}
	}

	ngOnDestroy() {
		document.removeEventListener('visibilitychange', this.visibilityChange);
	}

	initDataFromCache() {
		try {
			this.smartAssistCache = this.commonService.getLocalStorageValue(LocalStorageKey.SmartAssistCache, undefined);
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
				this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
			}
		} catch (error) {
			this.logger.exception('initDataFromCache', error);
		}
	}

	initVisibility() {
		try {
			this.logger.info('initVisibility: ', this.smartAssistCapability);
			if (!this.smartAssistCapability.isIntelligentSecuritySupported) {
				this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'security');
				this.checkMenuItemsLength();
			}
			this.lenovoVoice.available = this.smartAssistCapability.isLenovoVoiceSupported;
			if (!this.smartAssistCapability.isLenovoVoiceSupported) {
				this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'voice');
				this.checkMenuItemsLength();
			}
			if (!this.smartAssistCapability.isIntelligentMediaSupported.available) {
				this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'media');
				this.checkMenuItemsLength();
			}
			if (!this.smartAssistCapability.isIntelligentScreenSupported) {
				this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'screen');
				this.checkMenuItemsLength();
			}
			if (!this.smartAssistCapability.isAPSSupported) {
				this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'aps');
				this.checkMenuItemsLength();
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
		this.intelligentSecurity.isZeroTouchLockFacialRecoVisible = false;
		this.intelligentSecurity.isZeroTouchLockFacialRecoEnabled = false;
		this.intelligentSecurity.facilRecognitionCameraAccess = true;
		this.intelligentSecurity.facialRecognitionCameraPrivacyMode = false;
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
		this.apsAvailability();

		if (this.smartAssistCapability === undefined) {
			this.initZeroTouchLock();
			this.initZeroTouchLogin();
			this.initIntelligentScreen();
			this.getVideoPauseResumeStatus();
			this.getSuperResolutionStatus();
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
			this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
		}
	}

	public getHPDLeaveSensitivityVisibilityStatus() {
		try {
			this.smartAssist.getHPDLeaveSensitivityVisibility().then((value: any) => {
				this.logger.info('getHPDLeaveSensitivityVisibility value----->', value);
				this.sensitivityVisibility = value;
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
			await this.smartAssist.getHPDLeaveSensitivity().then((value: any) => {
				this.sesnsitivityAdjustVal = value || 2;
				this.logger.info('getHPDLeaveSensitivity value----->', value);
			});
		} catch (error) {
			this.logger.error('getHPDLeaveSensitivityVisibilityStatus', error.message);
			return EMPTY;
		}
	}

	public setHPDLeaveSensitivitySetting(event) {
		this.sesnsitivityAdjustVal = event.value;
		try {
			this.smartAssist.SetHPDLeaveSensitivitySetting(event.value).then((value: any) => {
				this.logger.info('setHPDLeaveSensitivitySetting value----->', value);
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

				if (!this.isAPSAvailable) {
					this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'aps');
					this.checkMenuItemsLength();
				}
				this.smartAssistCache.isAPSAvailable = this.isAPSAvailable;
				this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
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
		]).then((responses: any[]) => {
			this.intelligentScreen.isIntelligentScreenVisible = responses[0];
			this.intelligentScreen.isAutoScreenOffVisible = responses[1];
			this.intelligentScreen.isAutoScreenOffEnabled = responses[2];
			this.intelligentScreen.isAutoScreenOffNoteVisible = responses[3];
			this.intelligentScreen.isReadingOrBrowsingVisible = responses[4];
			this.intelligentScreen.isReadingOrBrowsingEnabled = responses[5];
			this.intelligentScreen.readingOrBrowsingTime = responses[6];
			this.logger.info('PageSmartAssistComponent.Promise.IntelligentScreen(): responses', responses);
			this.logger.info('PageSmartAssistComponent.Promise.IntelligentScreen(): intelligentScreen', this.intelligentScreen);
			if (!(this.intelligentScreen.isIntelligentScreenVisible &&
				this.smartAssistCapability.isIntelligentScreenSupported)) {
				this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'screen');
				this.checkMenuItemsLength();
			}

			this.smartAssistCache.intelligentScreen = this.intelligentScreen;
			this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
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
	private initZeroTouchLogin() {
		Promise.all([
			this.smartAssist.getZeroTouchLoginVisibility(),
			this.smartAssist.getZeroTouchLoginStatus(),
			this.smartAssist.getZeroTouchLoginDistance(),
			this.smartAssist.getZeroTouchLoginAdjustVisibility(),
			this.smartAssist.getZeroTouchLoginAdjustStatus(),
			this.smartAssist.getWindowsHelloStatus()
		]).then((responses: any[]) => {
			this.intelligentSecurity.isZeroTouchLoginVisible = responses[0];
			this.intelligentSecurity.isZeroTouchLoginEnabled = responses[1];
			this.intelligentSecurity.zeroTouchLoginDistance = responses[2];
			this.intelligentSecurity.isDistanceSensitivityVisible = responses[3];
			this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = responses[4];
			this.intelligentSecurity.isWindowsHelloRegistered = responses[5];
			this.logger.info('PageSmartAssistComponent.Promise.ZeroTouchLogin()', this.intelligentSecurity);
			this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
			this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
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
		]).then((responses: any[]) => {
			this.intelligentSecurity.isZeroTouchLockVisible = responses[0];
			this.intelligentSecurity.isZeroTouchLockEnabled = responses[1];
			this.intelligentSecurity.autoScreenLockTimer = responses[2].toString();
			this.intelligentSecurity.isHPDEnabled = responses[3];
			this.intelligentSecurity.isIntelligentSecuritySupported = responses[4];

			if (!this.intelligentSecurity.isIntelligentSecuritySupported) {
				this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'security');
				this.intelligentSecurity.isIntelligentSecuritySupported = false;
				this.checkMenuItemsLength();
			}
			this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
			this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
			this.logger.info('PageSmartAssistComponent.Promise.initZeroTouchLock()', this.intelligentSecurity);
		}).catch(error => {
			this.logger.error('error in PageSmartAssistComponent.Promise.initZeroTouchLock()', error.message);
			return EMPTY;
		});
	}

	private sortMenuItems(menuItems: PageAnchorLink[]): PageAnchorLink[] {
		if (menuItems) {
			return menuItems.sort((item1, item2) => {
				let comparison = 0;
				if (item1 > item2) {
					comparison = 1;
				} else if (item1 < item2) {
					comparison = -1;
				}
				return comparison;
			});
		}
		return undefined;
	}

	public onCardCollapse(isCollapsed: boolean) {
		if (!isCollapsed) {
			this.manualRefresh.emit();
		}
	}

	public onHumanPresenceDetectStatusToggle($event: any) {
		this.intelligentSecurity.isHPDEnabled = $event.switchValue;
		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setHPDStatus(this.intelligentSecurity.isHPDEnabled)
			.then((isSuccess: boolean) => {
				this.logger.info(`onHumanPresenceDetectStatusToggle.setHPDStatus ${isSuccess}`, this.intelligentSecurity.isHPDEnabled);
			});
	}

	public onZeroTouchLoginStatusToggle(event: any) {
		this.intelligentSecurity.isZeroTouchLoginEnabled = event.switchValue;

		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setZeroTouchLoginStatus(this.intelligentSecurity.isZeroTouchLoginEnabled)
			.then((isSuccess: boolean) => {
				this.logger.info(`onZeroTouchLoginStatusToggle.setZeroTouchLoginStatus ${isSuccess}`, this.intelligentSecurity.isZeroTouchLoginEnabled);
			});
	}

	public setZeroTouchLoginSensitivity(event: ChangeContext) {
		this.logger.info('setZeroTouchLoginSensitivity', event);
		this.intelligentSecurity.zeroTouchLoginDistance = event.value;

		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setZeroTouchLoginDistance(event.value)
			.then((isSuccess: boolean) => {
				this.logger.info(`setZeroTouchLoginSensitivity.setSelectedLockTimer ${isSuccess}`, event.value);
			});
	}

	// this is invoked when auto lock feature is toggled
	public onZeroTouchLockStatusToggle(event: any) {
		this.intelligentSecurity.isZeroTouchLockEnabled = event.switchValue;

		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setZeroTouchLockStatus(this.intelligentSecurity.isZeroTouchLockEnabled)
			.then((isSuccess: boolean) => {
				this.logger.info(`onChangeZeroTouchLockFlag.setAutoLockStatus ${isSuccess}`, this.intelligentSecurity.isZeroTouchLockEnabled);
			});
	}

	public onZeroTouchLockTimerChange(event: any, value: string) {
		this.intelligentSecurity.autoScreenLockTimer = value;

		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setSelectedLockTimer(value)
			.then((isSuccess: boolean) => {
				this.logger.info(`onZeroTouchLockTimerChange.setSelectedLockTimer ${isSuccess}`, value);
			});
	}

	public onZeroTouchLockFacialRecoChange($event: boolean) {
		this.intelligentSecurity.isZeroTouchLockFacialRecoEnabled = $event;
		this.smartAssist.setZeroTouchLockFacialRecoStatus($event)
			.then((isSuccess: boolean) => {
				this.logger.info(`onZeroTouchLockFacialRecoChange.setZeroTouchLockFacialRecoStatus ${isSuccess} ; ${$event}`);
			});
	}

	public onDistanceSensitivityAdjustToggle(event: any) {
		this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = event.switchValue;

		this.smartAssistCache.intelligentSecurity = this.intelligentSecurity;
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setZeroTouchLoginAdjustStatus(this.intelligentSecurity.isZeroTouchLoginAdjustEnabled)
			.then((isSuccess: boolean) => {
				this.logger.info(`onDistanceSensitivityAdjustToggle.setZeroTouchLoginAdjustStatus ${isSuccess}`, this.intelligentSecurity.isZeroTouchLoginAdjustEnabled);
			});
	}

	public onDisplayDimTimeChange($event: ChangeContext) {
		this.intelligentScreen.readingOrBrowsingTime = $event.value;

		this.smartAssistCache.intelligentScreen = this.intelligentScreen;
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setReadingOrBrowsingTime($event.value)
			.then((isSuccess: boolean) => {
				this.logger.info(`onZeroTouchLockTimerChange.setSelectedLockTimer ${isSuccess}`, $event.value);
			});
	}

	private setIsThinkPad(isThinkPad) {
		// service call to fetch type of device
		this.isThinkPad = isThinkPad;
	}

	public launchFaceEnrollment() {
		this.deviceService.launchUri('ms-settings:signinoptions-launchfaceenrollment');
	}

	public onAutoScreenOffToggle(event) {
		this.intelligentScreen.isAutoScreenOffEnabled = event.switchValue;

		this.smartAssistCache.intelligentScreen = this.intelligentScreen;
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setAutoScreenOffStatus(event.switchValue)
			.then((isSuccess: boolean) => {
				this.logger.info(`onAutoScreenOffToggle.setAutoScreenOffStatus ${isSuccess}`, event.switchValue);
			});
	}

	public onKeepMyDisplayToggle(event) {
		this.intelligentScreen.isReadingOrBrowsingEnabled = event.switchValue;

		this.smartAssistCache.intelligentScreen = this.intelligentScreen;
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);

		this.smartAssist.setReadingOrBrowsingStatus(event.switchValue)
			.then((isSuccess: boolean) => {
				this.logger.info(`onKeepMyDisplayToggle.setReadingOrBrowsingStatus ${isSuccess}`, event.switchValue);
			});
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'device-settings'
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
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
		this.smartAssist.resetHPDSetting()
			.then((isSuccess: boolean) => {
				if (this.smartAssist.isShellAvailable) {
					this.initSmartAssist(false);
				}
				this.getHPDLeaveSensitivityStatus();
				this.logger.info('onResetDefaultSettings.resetHPDSetting', isSuccess);
			});

		if (this.intelligentSecurity.isZeroTouchLockFacialRecoVisible) {
			this.smartAssist.resetFacialRecognitionStatus().then((res) => {
				if (this.smartAssist.isShellAvailable) {
					this.getFacialRecognitionStatus();
				}
				this.logger.info(`HPDReset - resetFacialRecognitionStatus ${res}`);
			});
		}
	}

	private getVideoPauseResumeStatus() {
		this.logger.debug('PageSmartAssistComponent.getVideoPauseResumeStatus: before check cache');
		try {
			if (this.smartAssist.isShellAvailable) {
				const assistCapability: SmartAssistCapability = this.commonService.getLocalStorageValue(LocalStorageKey.SmartAssistCapability, null);
				// cache found use it
				if (assistCapability && assistCapability.isIntelligentMediaSupported) {
					this.intelligentMedia = assistCapability.isIntelligentMediaSupported;
					this.logger.debug('PageSmartAssistComponent.getVideoPauseResumeStatus: cache found', this.intelligentMedia);
					this.isIntelligentMediaLoading = false;
					if (!this.intelligentMedia.available) {
						this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'media');
						this.checkMenuItemsLength();
					}
				}

				// get current value from API
				this.logger.debug('PageSmartAssistComponent.getVideoPauseResumeStatus: get current status from API');
				this.smartAssist.getVideoPauseResumeStatus()
					.then((response: FeatureStatus) => {
						this.isIntelligentMediaLoading = false;
						this.intelligentMedia = response;
						this.logger.debug('PageSmartAssistComponent.getVideoPauseResumeStatus: response from API', response);

						if (!response.available) {
							this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'media');
							this.checkMenuItemsLength();
						}
						this.smartAssistCache.intelligentMedia = this.intelligentMedia;
						this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
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
				this.smartAssist.getHPDSensorType()
					.then((type: number) => {
						this.hpdSensorType = type;
						this.smartAssistCache.hpdSensorType = this.hpdSensorType;
						this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCache, this.smartAssistCache);
						this.logger.info('getHPDSensorType: ', this.hpdSensorType);
					}).catch(error => {
						console.error('getHPDSensorType', error);
					});
			}
		} catch (error) {
			console.error('getHPDSensorType' + error.message);
		}
	}

	private getSuperResolutionStatus() {
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.getSuperResolutionStatus()
					.then((response: FeatureStatus) => {
						this.isSuperResolutionLoading = false;
						this.superResolution = response;
					}).catch(error => {
						console.error('getSuperResolutionStatus.error', error);
					});
			}
		} catch (error) {
			console.error('getSuperResolutionStatus' + error.message);
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
		return this.smartAssist.getZeroTouchLockFacialRecoStatus().then((res: any) => {
			if (res) {
				this.intelligentSecurity.isZeroTouchLockFacialRecoVisible = res.available;
				this.intelligentSecurity.isZeroTouchLockFacialRecoEnabled = res.status;
				this.intelligentSecurity.facilRecognitionCameraAccess = res.cameraPermission;
				this.intelligentSecurity.facialRecognitionCameraPrivacyMode = res.privacyModeStatus;
			}
			this.logger.info(`getFacialRecognitionStatus refresh successed`);
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


	public checkMenuItemsLength() {
		if (this.headerMenuItems.length === 1) {
			this.headerMenuItems = [];
			this.jumpTosettingsTitle = '';
		}
	}
}
