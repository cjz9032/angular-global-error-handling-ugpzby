import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
import { parse } from 'querystring';
import { PageAnchorLink } from 'src/app/data-models/common/page-achor-link.model';
import { SmartAssistCapability } from 'src/app/data-models/smart-assist/smart-assist-capability.model';

@Component({
	selector: 'vtr-page-smart-assist',
	templateUrl: './page-smart-assist.component.html',
	styleUrls: ['./page-smart-assist.component.scss']
})
export class PageSmartAssistComponent implements OnInit {

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
	public intelligentSecurityCopy: IntelligentSecurity;
	public autoScreenLockTimer = false;
	public zeroTouchLoginStatus = new FeatureStatus(false, true);
	public zeroTouchLockTitle: string;
	public options: any;
	// public keepMyDisplay: boolean;
	public intelligentScreen: IntelligentScreen;
	public intelligentMedia = new FeatureStatus(false, true);
	public lenovoVoice = new FeatureStatus(false, true);
	public isIntelligentMediaLoading = true;
	public isAPSavailable = false;

	headerMenuItems: PageAnchorLink[] = [
		// {
		// 	title: 'device.smartAssist.jumpTo.security',
		// 	path: 'security',
		// 	sortOrder: 1
		// },
		// {
		// 	title: 'device.smartAssist.jumpTo.screen',
		// 	path: 'screen',
		// 	sortOrder: 2
		// },
		// {
		// 	title: 'device.smartAssist.jumpTo.media',
		// 	path: 'media',
		// 	sortOrder: 3
		// },
		{
			title: 'device.smartAssist.jumpTo.APS',
			path: 'aps',
			sortOrder: 4
		},
		{
			title: 'device.smartAssist.jumpTo.voice',
			path: 'voice',
			sortOrder: 5
		}
	];

	cardContentPositionA: any = {};
	private machineType: number;
	private smartAssistCapability: SmartAssistCapability = undefined;

	constructor(
		private smartAssist: SmartAssistService,
		private deviceService: DeviceService,
		public qaService: QaService,
		private cmsService: CMSService,
		private logger: LoggerService,
		private commonService: CommonService
	) {
		if (this.smartAssist.isShellAvailable) {
			this.initSmartAssist(true);
		}
		this.fetchCMSArticles();
	}

	ngOnInit() {
		this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		this.smartAssistCapability = this.commonService.getLocalStorageValue(LocalStorageKey.SmartAssistCapability, undefined);
		this.initLenovoVoice();
		this.setIsThinkPad(this.machineType === 1);
		this.setIntelligentSecurity();
		this.setIntelligentScreen();
		this.getVideoPauseResumeStatus();
	}

	private initLenovoVoice() {
		this.lenovoVoice.available = this.commonService.getLocalStorageValue(LocalStorageKey.IsLenovoVoiceSupported);
		if (!this.lenovoVoice.available) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'voice');
		}
	}

	private setIntelligentSecurity() {
		// service call to fetch Intelligent Security Properties
		// this.intelligentSecurity = new IntelligentSecurity(true, 1, true, true, '0', true, false, false, false);
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
		this.initZeroTouchLock(isFirstTimeLoad);
		this.initZeroTouchLogin();
		this.initIntelligentScreen();
		this.apsAvailability();

	}

	private apsAvailability() {
		Promise
			.all([this.smartAssist.getAPSCapability(), this.smartAssist.getSensorStatus(), this.smartAssist.getHDDStatus()])
			.then((response: any[]) => {
				if (response[0], response[1], response[2] >= 0) {
					this.isAPSavailable = true;
				}
			})
			.catch((error) => { console.log('APS ERROR------------------', error); });
	}
	private initIntelligentScreen() {
		Promise.all([
			this.smartAssist.getIntelligentScreenVisibility(),
			this.smartAssist.getAutoScreenOffVisibility(),
			this.smartAssist.getAutoScreenOffStatus(),
			this.smartAssist.getAutoScreenOffNoteStatus(),
			this.smartAssist.getReadingOrBrowsingVisibility(),
			this.smartAssist.getReadingOrBrowsingStatus(),
			this.smartAssist.getReadingOrBrowsingTime()
		]).then((responses: any[]) => {
			this.intelligentScreen.isIntelligentScreenVisible = responses[0];
			this.intelligentScreen.isAutoScreenOffVisible = responses[1];
			this.intelligentScreen.isAutoScreenOffEnabled = responses[2];
			this.intelligentScreen.isAutoScreenOffNoteVisible = responses[3];
			this.intelligentScreen.isReadingOrBrowsingVisible = responses[4];
			this.intelligentScreen.isReadingOrBrowsingEnabled = responses[5];
			this.intelligentScreen.readingOrBrowsingTime = responses[6];
			console.log('PageSmartAssistComponent.Promise.IntelligentScreen()', responses, this.intelligentScreen);

			if (this.intelligentScreen.isIntelligentScreenVisible) {
				if (this.intelligentSecurity.isIntelligentSecuritySupported) {
					this.headerMenuItems.push({
						title: 'device.smartAssist.jumpTo.screen',
						path: 'screen',
						sortOrder: 2
					});

					this.headerMenuItems = this.sortMenuItems(this.headerMenuItems);
				}
			}
		}).catch(error => {
			this.logger.error('error in PageSmartAssistComponent.Promise.IntelligentScreen()', error);
		});
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
			console.log('PageSmartAssistComponent.Promise.ZeroTouchLogin()', responses, this.intelligentSecurity);
		}).catch(error => {
			this.logger.error('error in PageSmartAssistComponent.Promise.ZeroTouchLogin()', error);
		});
	}

	private initZeroTouchLock(isFirstTimeLoad: boolean) {
		Promise.all([
			this.smartAssist.getZeroTouchLockVisibility(),
			this.smartAssist.getZeroTouchLockStatus(),
			this.smartAssist.getSelectedLockTimer(),
			this.smartAssist.getHPDStatus(),
			this.smartAssist.getHPDVisibilityInIdeaPad(),
			this.smartAssist.getHPDVisibilityInThinkPad()
		]).then((responses: any[]) => {
			this.intelligentSecurity.isZeroTouchLockVisible = responses[0];
			this.intelligentSecurity.isZeroTouchLockEnabled = responses[1];
			this.intelligentSecurity.autoScreenLockTimer = responses[2].toString();
			this.intelligentSecurity.isHPDEnabled = responses[3];
			if (this.machineType === 0) {
				this.intelligentSecurity.isIntelligentSecuritySupported = responses[4];
			} else {
				this.intelligentSecurity.isIntelligentSecuritySupported = responses[5];
			}

			if (this.intelligentSecurity.isIntelligentSecuritySupported && isFirstTimeLoad) {
				this.headerMenuItems.push({
					title: 'device.smartAssist.jumpTo.security',
					path: 'security',
					sortOrder: 1
				});

				this.headerMenuItems = this.sortMenuItems(this.headerMenuItems);
			}
			console.log('PageSmartAssistComponent.Promise.initZeroTouchLock()', responses, this.intelligentSecurity);
		}).catch(error => {
			this.logger.error('error in PageSmartAssistComponent.Promise.initZeroTouchLock()', error);
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
		this.intelligentSecurityCopy = { ...this.intelligentSecurity };
		if (!this.intelligentSecurity.isHPDEnabled) {
			this.intelligentSecurity.isZeroTouchLoginEnabled = false;
			this.intelligentSecurity.isZeroTouchLockEnabled = false;
			this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = false;
		} else {
			this.intelligentSecurity.isZeroTouchLoginEnabled = this.intelligentSecurityCopy.isZeroTouchLoginEnabled;
			this.intelligentSecurity.isZeroTouchLockEnabled = this.intelligentSecurityCopy.isZeroTouchLockEnabled;
			this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = this.intelligentSecurityCopy.isZeroTouchLoginAdjustEnabled;
		}

		this.smartAssist.setHPDStatus(this.intelligentSecurity.isHPDEnabled)
			.then((isSuccess: boolean) => {
				console.log('onHumanPresenceDetectStatusToggle.setHPDStatus', isSuccess, this.intelligentSecurity.isHPDEnabled);
			});
	}

	public onZeroTouchLoginStatusToggle(event: any) {
		this.intelligentSecurity.isZeroTouchLoginEnabled = event.switchValue;
		this.smartAssist.setZeroTouchLoginStatus(this.intelligentSecurity.isZeroTouchLoginEnabled)
			.then((isSuccess: boolean) => {
				console.log('onZeroTouchLoginStatusToggle.setZeroTouchLoginStatus', isSuccess, this.intelligentSecurity.isZeroTouchLoginEnabled);
			});
	}

	public setZeroTouchLoginSensitivity(event: ChangeContext) {
		console.log('setZeroTouchLoginSensitivity', event);
		this.intelligentSecurity.zeroTouchLoginDistance = event.value;
		this.smartAssist.setZeroTouchLoginDistance(event.value)
			.then((isSuccess: boolean) => {
				console.log('setZeroTouchLoginSensitivity.setSelectedLockTimer', isSuccess, event.value);
			});
	}

	// this is invoked when auto lock feature is toggled
	public onZeroTouchLockStatusToggle(event: any) {
		this.intelligentSecurity.isZeroTouchLockEnabled = event.switchValue;
		this.smartAssist.setZeroTouchLockStatus(this.intelligentSecurity.isZeroTouchLockEnabled)
			.then((isSuccess: boolean) => {
				console.log('onChangeZeroTouchLockFlag.setAutoLockStatus', isSuccess, this.intelligentSecurity.isZeroTouchLockEnabled);
			});
	}

	public onZeroTouchLockTimerChange(event: any, value: string) {
		this.intelligentSecurity.autoScreenLockTimer = value;
		this.smartAssist.setSelectedLockTimer(value)
			.then((isSuccess: boolean) => {
				console.log('onZeroTouchLockTimerChange.setSelectedLockTimer', isSuccess, value);
			});
	}

	public onDistanceSensitivityAdjustToggle(event: any) {
		this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = event.switchValue;
		this.smartAssist.setZeroTouchLoginAdjustStatus(this.intelligentSecurity.isZeroTouchLoginAdjustEnabled)
			.then((isSuccess: boolean) => {
				console.log('onDistanceSensitivityAdjustToggle.setZeroTouchLoginAdjustStatus', isSuccess, this.intelligentSecurity.isZeroTouchLoginAdjustEnabled);
			});
	}

	public onDisplayDimTimeChange($event: ChangeContext) {
		this.intelligentScreen.readingOrBrowsingTime = $event.value;
		this.smartAssist.setReadingOrBrowsingTime($event.value)
			.then((isSuccess: boolean) => {
				console.log('onZeroTouchLockTimerChange.setSelectedLockTimer', isSuccess, $event.value);
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
		this.smartAssist.setAutoScreenOffStatus(event.switchValue)
			.then((isSuccess: boolean) => {
				console.log('onAutoScreenOffToggle.setAutoScreenOffStatus', isSuccess, event.switchValue);
			});
	}

	public onKeepMyDisplayToggle(event) {
		this.intelligentScreen.isReadingOrBrowsingEnabled = event.switchValue;
		this.smartAssist.setReadingOrBrowsingStatus(event.switchValue)
			.then((isSuccess: boolean) => {
				console.log('onKeepMyDisplayToggle.setReadingOrBrowsingStatus', isSuccess, event.switchValue);
			});
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'device-settings',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
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
				console.log('fetchCMSContent error', error);
			}
		);
	}

	public onResetDefaultSettings($event) {
		this.smartAssist.resetHPDSetting()
			.then((isSuccess: boolean) => {
				if (this.smartAssist.isShellAvailable) {
					this.initSmartAssist(false);
				}
				console.log('onResetDefaultSettings.resetHPDSetting', isSuccess);
			});
	}

	private getVideoPauseResumeStatus() {
		console.log('getVideoPauseResumeStatus');
		try {
			if (this.smartAssist.isShellAvailable) {
				this.smartAssist.getVideoPauseResumeStatus()
					.then((response: FeatureStatus) => {
						this.isIntelligentMediaLoading = false;
						this.intelligentMedia = response;
						console.log('getVideoPauseResumeStatus.then:', response);

						if (response.available) {
							this.headerMenuItems.push({
								title: 'device.smartAssist.jumpTo.media',
								path: 'media',
								sortOrder: 3
							});
							this.headerMenuItems = this.sortMenuItems(this.headerMenuItems);
						}
					}).catch(error => {
						console.error('getVideoPauseResumeStatus.error', error);
					});
			}
		} catch (error) {
			console.error('getVideoPauseResumeStatus' + error.message);
		}
	}
}
