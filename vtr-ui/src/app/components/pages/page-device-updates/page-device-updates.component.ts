import { Component, OnInit, NgZone, OnDestroy, DoCheck } from '@angular/core';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { UpdateProgress } from 'src/app/enums/update-progress.enum';
import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { InstallUpdate } from 'src/app/data-models/system-update/install-update.model';
import { UpdateInstallAction } from 'src/app/enums/update-install-action.enum';
import { UpdateInstallSeverity } from 'src/app/enums/update-install-severity.enum';
import { ModalCommonConfirmationComponent } from '../../modal/modal-common-confirmation/modal-common-confirmation.component';
import { UpdateRebootType } from 'src/app/enums/update-reboot-type.enum';
import { SystemUpdateStatusMessage } from 'src/app/data-models/system-update/system-update-status-message.model';
import { CMSService } from 'src/app/services/cms/cms.service';
import { UpdateActionResult } from 'src/app/enums/update-action-result.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { UpdateFailToastMessage } from 'src/app/enums/update.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { AdPolicyEvent } from 'src/app/enums/ad-policy-id.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { ContentActionType } from 'src/app/enums/content.enum';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { AntivirusService } from 'src/app/services/security/antivirus.service';
import { SelfSelectEvent } from 'src/app/enums/self-select.enum';
import { SelfSelectService, SegmentConstHelper } from 'src/app/services/self-select/self-select.service';
import { UpdateInstallTitleId } from 'src/app/enums/update-install-id.enum';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

declare var Windows;

@Component({
	selector: 'vtr-page-device-updates',
	templateUrl: './page-device-updates.component.html',
	styleUrls: ['./page-device-updates.component.scss']
})
export class PageDeviceUpdatesComponent implements OnInit, DoCheck, OnDestroy {
	title = 'systemUpdates.title';
	back = 'systemUpdates.back';
	backArrow = '< ';
	updateToDateTitle = 'systemUpdates.banner.title';

	supportWebsiteCard: FeatureContent = new FeatureContent();
	cardContentPositionA: FeatureContent = new FeatureContent();
	securityWidgetCard: FeatureContent = new FeatureContent();

	rightCards = [{
		cardContent: null,
		id: 'su-security-widget-cardcontent',
		ariaLabel: 'su-security-widget-cardcontent',
		type: 'subpage-partner-corner',
		order: 2,
		show: false
	}, {
		cardContent: null,
		id: 'su-web-support-cardcontent',
		ariaLabel: 'su-web-support-cardcontent',
		type: 'subpage-partner-corner',
		order: 3,
		show: true
	}, {
		cardContent: null,
		id: 'su-positionA-cardcontent',
		ariaLabel: 'su-positionA-cardcontent',
		type: 'subpage-corner',
		cornerShift: 'large',
		order: 4,
		show: true
	}];

	private lastUpdatedText = 'systemUpdates.banner.last';
	private nextScanText = 'systemUpdates.banner.next';
	private neverCheckedText = 'systemUpdates.banner.neverChecked';
	private metrics: any;
	private lastInstallTime: string;
	// private lastScanTime = new Date('1970-01-01T01:00:00');
	private nextScheduleScanTime: string;
	private isScheduleScanEnabled = false;
	public criticalUpdates: AvailableUpdateDetail[];
	public recommendedUpdates: AvailableUpdateDetail[];
	public optionalUpdates: AvailableUpdateDetail[];
	public ignoredUpdates: AvailableUpdateDetail[];
	public criticalUpdatesToInstall: AvailableUpdateDetail[];
	public recommendedUpdatesToInstall: AvailableUpdateDetail[];
	public optionalUpdatesToInstall: AvailableUpdateDetail[];
	public ignoredUpdatesToInstall: AvailableUpdateDetail[];
	public updatesToInstall: AvailableUpdateDetail[] = [];
	public isUpdateCheckInProgress = false;
	public isRebootRequested = false;
	public showFullHistory = false;
	public showSecurityWidget = false;
	private notificationSubscription: Subscription;
	private isComponentInitialized = false;
	public updateTitle = '';
	private isUserCancelledUpdateCheck = false;
	private protocolAction: string;
	private shouldCheckingUpdateByProtocol = false;
	private backButton = 'system-update-back-btn';

	public isInstallationSuccess = false;
	public isInstallationCompleted = false;
	public percentCompleted = 0;
	public isCheckingStatus = false;
	public isUpdatesAvailable = false;
	public isUpdateDownloading = false;
	public isCheckingPluginStatus = true;
	public isCancelingStatus = false;
	public installationPercent = 0;
	public downloadingPercent = 0;
	public isInstallingAllUpdates = true;
	public isInstallFailedMessageToasted = false;
	private systemVolumeSpace = 0;

	public isOnline = true;
	public offlineSubtitle: string;
	public supportLink = 'https://support.lenovo.com/';

	nextUpdatedDate = '11/12/2018 at 10:00 AM';
	installationHistory = 'systemUpdates.installationHistory';

	installationHistoryList = [
		{
			status: 'fail',
			icon: 'times',
			installationDate: '14 FEB 2018',
			path: '/'
		},
		{
			status: 'pause',
			icon: 'minus',
			installationDate: '16 MAR 2018',
			path: '/'
		},
		{
			status: 'success',
			icon: 'check',
			installationDate: '21 JUL 2018',
			path: '/'
		}
	];

	public autoUpdateOptions = [
		{
			readMoreText: '',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: 'assets/icons/Icon_Critical_Update.svg',
			header: 'systemUpdates.autoUpdateSettings.critical.title',
			name: 'critical-updates',
			subHeader: '',
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			isChecked: true,
			isDisabled: false,
			tooltipText: 'systemUpdates.autoUpdateSettings.critical.tooltip',
			type: 'auto-updates'
		},
		{
			readMoreText: '',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: 'assets/icons/Icon_Recommended_Update.svg',
			header: 'systemUpdates.autoUpdateSettings.recommended.title',
			name: 'recommended-updates',
			subHeader: '',
			isCheckBoxVisible: false,
			isSwitchVisible: true,
			isChecked: true,
			isDisabled: false,
			tooltipText: 'systemUpdates.autoUpdateSettings.recommended.tooltip',
			type: 'auto-updates'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: 'assets/icons/Icon_Windows_Update_20px.svg',
			header: 'systemUpdates.autoUpdateSettings.windows.title',
			name: 'windows-updates',
			subHeader: '',
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			isChecked: true,
			isDisabled: false,
			linkText: 'systemUpdates.autoUpdateSettings.windows.url',
			linkPath: 'ms-settings:windowsupdate',
			type: 'auto-updates'

		}
	];

	public updateDetails = {
		manufacturer: 'Lenovo',
		version: '11.85.45.123',
		installedVersion: 'Not available',
		downloadSize: '7.3 MB',
		diskSpaceNeeded: '30.5 MB'
	};

	private cmsSubscription: Subscription;

	constructor(
		public systemUpdateService: SystemUpdateService,
		private commonService: CommonService,
		private ngZone: NgZone,
		private modalService: NgbModal,
		private cmsService: CMSService,
		private activatedRoute: ActivatedRoute,
		private translate: TranslateService,
		shellService: VantageShellService,
		private deviceService: DeviceService,
		private router: Router,
		private logger: LoggerService,
		private hypSetting: HypothesisService,
		private antiVirusService: AntivirusService,
		private selfSelectService: SelfSelectService,
		private localCacheService: LocalCacheService,
		private metricService: MetricService
	) {
		this.isOnline = this.commonService.isOnline;
		this.metrics = shellService.getMetrics();
		this.fetchCMSArticles();

		this.getSpecificSupportLink();
		this.translateStrings();
		this.getCachedValue();
	}

	ngDoCheck(): void {
		const lastAction = this.protocolAction;
		this.protocolAction = this.activatedRoute.snapshot.queryParams.action;
		if (this.protocolAction && lastAction !== this.protocolAction) {
			if (this.protocolAction.toLowerCase() === 'enable') {
				this.systemUpdateService.setUpdateSchedule(true, false);
				const metricData = {
					ItemType: 'FeatureClick',
					ItemName: 'chk.critical-updates',
					ItemValue: 'True',
					ItemParent: 'Device.SystemUpdate'
				};
				this.metrics.sendAsync(metricData);
			} else if (this.protocolAction.toLowerCase() === 'start') {
				this.shouldCheckingUpdateByProtocol = true;
			}
		}
	}

	ngOnInit() {
		this.isInstallationSuccess = this.systemUpdateService.isInstallationSuccess;
		this.isInstallationCompleted = this.systemUpdateService.isInstallationCompleted;
		this.percentCompleted = this.systemUpdateService.percentCompleted;
		this.isUpdatesAvailable = this.updateAvailableAfterCheck();
		this.isInstallingAllUpdates = this.systemUpdateService.isInstallingAllUpdates;

		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

		if (this.systemUpdateService.isUpdatesAvailable && !this.systemUpdateService.isInstallationCompleted && this.systemUpdateService.updateInfo) {
			this.systemUpdateService.isUpdatesAvailable = true;
			this.setUpdateByCategory(this.systemUpdateService.updateInfo.updateList);
		} else if (this.systemUpdateService.isInstallationCompleted && this.systemUpdateService.installedUpdates && this.systemUpdateService.installedUpdates.length > 0) {
			this.setUpdateByCategory(this.systemUpdateService.installedUpdates);
			if (this.systemUpdateService.isToastMessageNeeded) {
				this.showToastMessage(this.systemUpdateService.installedUpdates);
			}
		} else if (this.systemUpdateService.isInstallationCompleted && this.systemUpdateService.ignoredRebootDelayUpdates && this.systemUpdateService.ignoredRebootDelayUpdates.length > 0) {
			this.setUpdateByCategory(this.systemUpdateService.ignoredRebootDelayUpdates);
		}

		this.systemUpdateService.retryTimes = 0;
		this.getScheduleUpdateStatus(false);
		this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
		this.installationPercent = this.systemUpdateService.installationPercent;
		this.downloadingPercent = this.systemUpdateService.downloadingPercent;
		this.isComponentInitialized = true;

		this.getLastUpdateScanDetail();
		this.systemUpdateService.getUpdateSchedule();
		this.systemUpdateService.getUpdateHistory();
		this.setUpdateTitle();
		this.popRebootDialogIfNecessary();
		this.initSupportCard();
		this.initSecurityCard();
		this.getSystemVolumeSpace();
	}

	private initSupportCard() {
		this.translate.stream('systemUpdates.support.title').subscribe((value) => {
			this.supportWebsiteCard = {
				Id: 'LenovoSupportWebsite',
				Title: value,
				FeatureImage: 'assets/images/support.jpg',
				ActionType: ContentActionType.External,
				ActionLink: this.supportLink,
			};
			this.rightCards[1].cardContent = this.supportWebsiteCard;
		});
	}

	private async initSecurityCard() {
		try {
			const settingValue = await this.isSecurityWidgetEnabled();
			const segmentValue = await this.selfSelectService.getSegment();
			const currentPage = this.antiVirusService.GetAntivirusStatus().currentPage;
			if (settingValue
				&& (SegmentConstHelper.includedInCommonConsumer(segmentValue))
				&& currentPage !== 'mcafee') {
				this.translate.stream('systemUpdates.security.title').subscribe((title) => {
					this.securityWidgetCard = {
						Id: 'SecurityWidgetCard',
						Title: title,
						FeatureImage: 'assets/images/security-bg.jpg',
						ActionType: ContentActionType.Internal,
						ActionLink: 'lenovo-vantage3:anti-virus',
						SupportOffline: true
					};
					this.showSecurityWidget = true;
					this.rightCards[0].cardContent = this.securityWidgetCard;
					this.rightCards[0].show = this.showSecurityWidget;
				});
			} else {
				this.showSecurityWidget = false;
				this.rightCards[0].show = this.showSecurityWidget;
			}
		} catch (ex) {
			this.showSecurityWidget = false;
			this.rightCards[0].show = this.showSecurityWidget;
			this.logger.exception('initSecurityCard failed with exception', ex.message);
		}
	}

	private isSecurityWidgetEnabled(): Promise<boolean> {
		let enabled = true;
		return this.hypSetting.getFeatureSetting('SystemUpdateSecurityWidget').then((result) => {
			if (result === 'false') {
				enabled = false;
			}
			return enabled;
		}, (error) => {
			this.logger.error('PageDeviceUpdatesComponent.isSecurityWidgetEnabled: promise rejected ', error);
			return enabled;
		});
	}

	popRebootDialogIfNecessary() {
		if (this.systemUpdateService.isRebootRequiredDialogNeeded) {
			this.checkRebootRequested();
		}
	}

	private getCachedValue() {
		let cachedData = this.localCacheService.getLocalCacheValue(LocalStorageKey.SystemUpdateCriticalUpdateStatus);
		if (typeof (cachedData) !== 'undefined') {
			this.autoUpdateOptions[0].isChecked = cachedData;
			this.isScheduleScanEnabled = cachedData;
		}
		cachedData = this.localCacheService.getLocalCacheValue(LocalStorageKey.SystemUpdateRecommendUpdateStatus);
		if (typeof (cachedData) !== 'undefined') {
			this.autoUpdateOptions[1].isChecked = cachedData;
			if (!this.autoUpdateOptions[0].isChecked) {
				this.autoUpdateOptions[1].isDisabled = true;
			}
		}
		cachedData = this.localCacheService.getLocalCacheValue(LocalStorageKey.SystemUpdateLastInstallTime);
		if (cachedData) {
			this.lastInstallTime = cachedData;
		}
		cachedData = this.localCacheService.getLocalCacheValue(LocalStorageKey.SystemUpdateNextScheduleScanTime);
		if (cachedData) {
			this.nextScheduleScanTime = cachedData;
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'system-updates'
		};

		this.cmsSubscription = this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
					}
					this.rightCards[2].cardContent = this.cardContentPositionA;
				}
			},
			error => {
				this.logger.error('fetchCMSContent error', error);
			}
		);
	}

	ngOnDestroy() {
		try {
			if (this.notificationSubscription) {
				this.notificationSubscription.unsubscribe();
			}

			if (this.cmsSubscription) {
				this.cmsSubscription.unsubscribe();
			}
		} catch (error) {
			this.logger.error('PageDeviceUpdatesComponent.ngOnDestroy: ', error);
		}
	}

	private getSpecificSupportLink() {
		let machineInfo = this.deviceService.getMachineInfoSync();
		if (!machineInfo) {
			this.deviceService.getMachineInfo().then((info) => {
				machineInfo = info;
				this.adjustSupportLinkByMachineInfo(machineInfo);
			});
		} else {
			this.adjustSupportLinkByMachineInfo(machineInfo);
		}
	}

	private adjustSupportLinkByMachineInfo(machineInfo) {
		if (machineInfo && machineInfo.serialnumber) {
			this.supportLink = `https://support.lenovo.com/contactus?serialnumber=${machineInfo.serialnumber}`;
		} else {
			this.supportLink = 'https://support.lenovo.com/contactus';
		}
		this.supportWebsiteCard.ActionLink = this.supportLink;
	}

	private setUpdateTitle(titleStatusCode: number = 0) {
		if (titleStatusCode < 0 || titleStatusCode > SystemUpdateStatusMessage.StatusMessageMap.length - 1) {
			titleStatusCode = 1; // For unknown status code, display common failure error message
		}
		this.translate.stream(SystemUpdateStatusMessage.StatusMessageMap[titleStatusCode].message).subscribe((res) => {
			this.updateTitle = res;
		});
	}

	private getLastUpdateScanDetail() {
		if (this.systemUpdateService.isShellAvailable) {
			this.systemUpdateService.getMostRecentUpdateInfo()
				.then((value: any) => {
					if (value.lastInstallTime && value.lastInstallTime.length > 0) {
						this.lastInstallTime = value.lastInstallTime;
						this.localCacheService.setLocalCacheValue(LocalStorageKey.SystemUpdateLastInstallTime, this.lastInstallTime);
					}
					// this.lastScanTime = new Date(value.lastScanTime);
					this.nextScheduleScanTime = value.nextScheduleScanTime;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.SystemUpdateNextScheduleScanTime, this.nextScheduleScanTime);
					this.isScheduleScanEnabled = value.scheduleScanEnabled;
					this.getNextUpdatedScanText();
					// lastInstallTime: "2019-03-01T10:09:53"
					// lastScanTime: "2019-03-12T18:24:03"
					// nextScheduleScanTime: "2019-03-15T10:07:42"
					// scheduleScanEnabled: true
				});
		}
	}

	public getLastUpdatedText() {
		if (this.lastInstallTime && this.lastInstallTime.length > 0) {
			const installDate = this.commonService.formatLocalDate(this.lastInstallTime);
			const installTime = this.commonService.formatLocalTime(this.lastInstallTime);
			return `${this.lastUpdatedText} ${installDate} ${installTime}`;
		}
		return this.neverCheckedText;
	}

	public getNextUpdatedScanText() {
		if (!this.isScheduleScanEnabled) {
			return '';
		} else if (this.nextScheduleScanTime && this.nextScheduleScanTime.length > 0) {
			const scanDate = this.commonService.formatLocalDate(this.nextScheduleScanTime);
			const scanTime = this.commonService.formatLocalTime(this.nextScheduleScanTime);
			return `${this.nextScanText} ${scanDate} ${scanTime}`;
		}
		return '';
	}

	public onCheckForUpdates() {
		if (this.systemUpdateService.isShellAvailable) {
			this.setUpdateTitle();
			this.isCancelingStatus = false;
			this.isUserCancelledUpdateCheck = false;
			this.isUpdateCheckInProgress = true;
			this.isUpdatesAvailable = false;
			this.systemUpdateService.isUpdatesAvailable = false;
			this.isInstallingAllUpdates = false;
			this.systemUpdateService.isInstallingAllUpdates = true;
			this.resetState();
			this.isCheckingStatus = false;
			this.systemUpdateService.percentCompleted = 0;
			this.percentCompleted = this.systemUpdateService.percentCompleted;
			this.systemUpdateService.checkForUpdates();
		}
	}

	public onCancelUpdateCheck() {
		if (this.systemUpdateService.isShellAvailable) {
			this.isUserCancelledUpdateCheck = true;
			this.systemUpdateService.cancelUpdateCheck();
			this.focusOnElement(this.backButton);
		}
	}

	public onUpdateSelectionChange($event: any) {
		const item = $event.target;
		this.systemUpdateService.toggleUpdateSelection(item.name, item.checked);
		// set the value twice to trigger the ui refresh, Some times the ui get some strange problems
		document.body.style.zoom = '1.1';
		document.body.style.zoom = '1.0';
	}

	public onIgnoredUpdate($event: any) {
		const packageName = $event.packageName;
		const isIgnored = $event.isIgnored;
		const packageSeverity = $event.packageSeverity;
		let focusIds: UpdateInstallTitleId[] = [];
		if (isIgnored === true) {
			this.systemUpdateService.ignoreUpdate(packageName);
			if (packageSeverity === UpdateInstallSeverity.Optional) {
				focusIds = [UpdateInstallTitleId.OptionalUpdates, UpdateInstallTitleId.IgnoredUpdates];
			} else {
				focusIds = [UpdateInstallTitleId.RecommendedUpdates, UpdateInstallTitleId.IgnoredUpdates];
			}
		} else {
			this.systemUpdateService.unIgnoreUpdate(packageName);
			if (packageSeverity === UpdateInstallSeverity.Optional) {
				focusIds = [UpdateInstallTitleId.IgnoredUpdates, UpdateInstallTitleId.OptionalUpdates];
			} else {
				focusIds = [UpdateInstallTitleId.IgnoredUpdates, UpdateInstallTitleId.RecommendedUpdates];
			}
		}
		this.systemUpdateService.ignoreFocusIds = focusIds;
	}

	// private getAvailablePackageId(packageName) {
	// 	let packId = this.getPackageId(this.criticalUpdates, packageName);
	// 	if (packId === '') {
	// 		packId = this.getPackageId(this.recommendedUpdates, packageName);
	// 	}
	// 	if (packId === '') {
	// 		packId = this.getPackageId(this.optionalUpdates, packageName);
	// 	}
	// 	if (packId === '') {
	// 		packId = this.getPackageId(this.ignoredUpdates, packageName);
	// 	}
	// 	return packId;
	// }

	// private getPackageId(updateList:AvailableUpdateDetail[], packageName) {
	// 	if (updateList && updateList.length > 0) {
	// 		const pack = updateList.find(update => {
	// 			return update.packageName === packageName;
	// 		});
	// 		if (pack && pack.packageID) {
	// 			return pack.packageID;
	// 		}
	// 	}
	// 	return '';
	// }

	// private getNextIgnoreAvailablePackageId(packageName) {
	// 	let packId = this.getNextPackageId(this.recommendedUpdates, packageName);
	// 	if (packId === '') {
	// 		packId = this.getNextPackageId(this.optionalUpdates, packageName);
	// 	} else if (packId === 'last') {
	// 		if( this.optionalUpdates && this.optionalUpdates.length > 0) {
	// 			packId = this.optionalUpdates[0].packageID;
	// 		}
	// 	}
	// 	return packId;
	// }

	// private getNextPackageId(updateList:AvailableUpdateDetail[], packageName) {
	// 	let packId = '';
	// 	if(updateList && updateList.length > 0) {
	// 		const index = updateList.findIndex(update => update.packageName === packageName);
	// 		if (index !== -1 && index + 1 < updateList.length) {
	// 			packId = updateList[index+1].packageID;
	// 		} else if (index + 1 === updateList.length) {
	// 			packId = 'last';
	// 		}
	// 	}
	// 	return packId;
	// }

	private installUpdates(removeDelayedUpdates: boolean, updateList: Array<AvailableUpdateDetail>, isInstallAll: boolean) {
		if (this.systemUpdateService.isShellAvailable && this.systemUpdateService.isUpdatesAvailable) {
			this.isInstallingAllUpdates = isInstallAll;
			this.systemUpdateService.isInstallingAllUpdates = isInstallAll;
			this.resetState();
			this.systemUpdateService.installUpdatesList(removeDelayedUpdates, updateList, isInstallAll);
			this.setInstallUpdateByCategory(updateList);
		}
	}

	public onUpdateToggleOnOff($event) {
		if (this.systemUpdateService.isShellAvailable) {
			const { name, switchValue: checked } = $event;
			let { criticalAutoUpdates, recommendedAutoUpdates } = this.systemUpdateService.autoUpdateStatus;
			if (name === 'critical-updates') {
				criticalAutoUpdates = checked;
				const recommendUpdate = this.autoUpdateOptions.find((update) => {
					return update.name === 'recommended-updates';
				});
				if (!checked) {
					recommendedAutoUpdates = false;
					recommendUpdate.isChecked = false;
					recommendUpdate.isDisabled = true;
				} else {
					recommendUpdate.isDisabled = false;
				}
			} else if (name === 'recommended-updates') {
				recommendedAutoUpdates = checked;
				const criticalUpdate = this.autoUpdateOptions.find((update) => {
					return update.name === 'critical-updates';
				});
				if (checked && !criticalUpdate.isChecked) {
					criticalUpdate.isChecked = true;
					criticalAutoUpdates = true;
				}
			}
			this.systemUpdateService.setUpdateSchedule(criticalAutoUpdates, recommendedAutoUpdates);
		}
	}

	public onToggleFullHistory() {
		this.showFullHistory = !this.showFullHistory;
	}

	public onReinstallUpdate(packageID: string) {
		if (packageID) {
			const update = new InstallUpdate();
			update.packageID = packageID;
			update.action = UpdateInstallAction.DownloadAndInstall;
			update.severity = UpdateInstallSeverity.Recommended;
			this.systemUpdateService.installFailedUpdate(update);
		}
	}

	public isUpdateListVisible() {
		const isVisible = (this.systemUpdateService.isUpdatesAvailable || this.systemUpdateService.isInstallationCompleted)
			&& ((this.criticalUpdates && this.criticalUpdates.length > 0)
				|| (this.recommendedUpdates && this.recommendedUpdates.length > 0)
				|| (this.optionalUpdates && this.optionalUpdates.length > 0)
				|| (this.ignoredUpdates && this.ignoredUpdates.length > 0));
		return isVisible;
	}

	public updateAvailableAfterCheck() {
		return this.systemUpdateService.isUpdatesAvailable
			&& !this.systemUpdateService.isUpdateDownloading
			&& !this.systemUpdateService.isInstallationCompleted;
	}

	public isUpdateSelected() {
		if (this.systemUpdateService.isUpdatesAvailable && this.systemUpdateService.updateInfo && this.systemUpdateService.updateInfo.updateList) {
			const selectedUpdates = this.systemUpdateService.getSelectedUpdates(this.systemUpdateService.updateInfo.updateList);
			return selectedUpdates.length > 0;
		} else {
			return false;
		}
	}

	public onRebootClick($event) {
		this.systemUpdateService.restartWindows();
	}

	public onDismissClick($event) {
	}

	private focusOnElement(element) {
		if (element && document.getElementById(element)) {
			document.getElementById(element).focus();
		}
	}
	private focusOnElementGroup(idArray) {
		for (const element of idArray) {
			if (element && document.getElementById(element)) {
				document.getElementById(element).focus();
				break;
			}
		}
	}

	public showInstallConfirmation(source: string) {
		const isInstallAll = source !== 'selected';
		const modalRef = this.modalService
			.open(ModalCommonConfirmationComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				ariaLabelledBy: 'modal_confirm_title',
				windowClass: 'common-confirmation-modal'
			});
		// VAN-16194 touch screen cannot show this modal
		this.changeCheckboxDisplay('none');
		setTimeout(() => {
			this.changeCheckboxDisplay('');
		}, 0);
		let removeDelayedUpdates = false;
		this.updatesToInstall = [];
		this.systemUpdateService.updateInfo.updateList.map(update => this.updatesToInstall.push(Object.assign({}, update)));
		if (!isInstallAll) {
			this.updatesToInstall = this.systemUpdateService.getSelectedUpdates(this.updatesToInstall);
		} else {
			this.systemUpdateService.selectDependedUpdateForInstallAll(this.updatesToInstall);
			this.updatesToInstall = this.systemUpdateService.getUnIgnoredUpdatesForInstallAll(this.updatesToInstall);
		}
		const { rebootType, packages } = this.systemUpdateService.getRebootType(this.updatesToInstall);

		const diskSpaceEnough = this.checkDiskSpaceEnough(this.updatesToInstall);
		if (!diskSpaceEnough) {
			const header = 'systemUpdates.popup.diskSpaceNeeded';
			const description = 'systemUpdates.popup.diskSpaceNotEnoughMsg';
			modalRef.componentInstance.header = header;
			modalRef.componentInstance.description = description;
			modalRef.componentInstance.OkText = 'systemUpdates.popup.okayButton';
			modalRef.componentInstance.CancelText = '';
			modalRef.componentInstance.metricsParent = 'Pages.SystemUpdate.DiskSpaceNeeded';
			modalRef.result.then(
				(result) => {
					modalRef.close();
				}
			);
		} else {
			if (rebootType === UpdateRebootType.RebootDelayed) {
				this.showRebootDelayedModal(modalRef);
			} else if (rebootType === UpdateRebootType.RebootForced) {
				this.showRebootForceModal(modalRef);
			} else if (rebootType === UpdateRebootType.PowerOffForced) {
				this.showPowerOffForceModal(modalRef);
			} else {
				modalRef.dismiss();
				// its normal update type installation which doesn't require rebooting/power-off
				document.querySelector('.vtr-app.container-fluid').scrollTop = 120;
				this.focusOnElement(this.backButton);
				this.installUpdateBySource(isInstallAll, removeDelayedUpdates, this.updatesToInstall);
				return;
			}
			modalRef.componentInstance.packages = packages;
			modalRef.componentInstance.OkText = 'systemUpdates.popup.okayButton';
			modalRef.componentInstance.CancelText = 'systemUpdates.popup.cancelButton';
			modalRef.result.then(
				result => {
					// on open
					if (result) {
						document.querySelector('.vtr-app.container-fluid').scrollTop = 120;
						if (this.systemUpdateService.getACAttachedStatus()) {
							removeDelayedUpdates = false;
						} else {
							removeDelayedUpdates = true;
						}
						this.focusOnElement(this.backButton);
						this.installUpdateBySource(isInstallAll, removeDelayedUpdates, this.updatesToInstall);
					}
				});

		}
	}

	public onGetSupportClick($event: any) {
	}

	private installUpdateBySource(isInstallAll: boolean, removeDelayedUpdates: boolean, updateList: Array<AvailableUpdateDetail>) {
		this.isInstallFailedMessageToasted = false;
		this.isRebootRequested = false;
		this.installUpdates(removeDelayedUpdates, updateList, isInstallAll);
	}

	private showRebootForceModal(modalRef: NgbModalRef) {
		const header = 'systemUpdates.popup.reboot';
		const description = 'systemUpdates.popup.rebootForceMsg';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
		modalRef.componentInstance.metricsParent = 'Pages.SystemUpdate.RebootForceMsgControl';
	}

	private showPowerOffForceModal(modalRef: NgbModalRef) {
		const header = 'systemUpdates.popup.shutdown';
		const description = 'systemUpdates.popup.shutdownForceMsg';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
		modalRef.componentInstance.metricsParent = 'Pages.SystemUpdate.ShutdownForceMsgControl';
	}

	private showRebootDelayedModal(modalRef: NgbModalRef) {
		const header = 'systemUpdates.popup.reboot';
		const description = 'systemUpdates.popup.rebootDelayedMsg';
		modalRef.componentInstance.header = header;
		modalRef.componentInstance.description = description;
		modalRef.componentInstance.metricsParent = 'Pages.SystemUpdate.RebootDelayedMsgControl';
	}

	private setInstallUpdateByCategory(updateList: Array<AvailableUpdateDetail>) {
		if (updateList) {
			this.ignoredUpdatesToInstall = this.filterIgnoredUpdate(updateList, true);
			const unIgnoredUpdates = this.filterIgnoredUpdate(updateList, false);
			this.optionalUpdatesToInstall = this.filterUpdate(unIgnoredUpdates, 'optional');
			this.recommendedUpdatesToInstall = this.filterUpdate(unIgnoredUpdates, 'recommended');
			this.criticalUpdatesToInstall = this.filterUpdate(unIgnoredUpdates, 'critical');
		}
	}

	private setUpdateByCategory(updateList: Array<AvailableUpdateDetail>) {
		if (updateList) {
			this.ignoredUpdates = this.filterIgnoredUpdate(updateList, true);
			const unIgnoredUpdates = this.filterIgnoredUpdate(updateList, false);
			this.optionalUpdates = this.filterUpdate(unIgnoredUpdates, 'optional');
			this.recommendedUpdates = this.filterUpdate(unIgnoredUpdates, 'recommended');
			this.criticalUpdates = this.filterUpdate(unIgnoredUpdates, 'critical');
		}
	}

	private showToastMessage(updateList: Array<AvailableUpdateDetail>) {
		const failedUpdates = updateList.find((update) => {
			return (update.installationStatus === UpdateActionResult.DownloadFailed
				|| update.installationStatus === UpdateActionResult.InstallFailed);
		});
		if (failedUpdates && !this.isInstallFailedMessageToasted) {
			this.systemUpdateService.queueToastMessage(UpdateFailToastMessage.MessageID, '', '');
			this.isInstallFailedMessageToasted = true;
		}
		this.systemUpdateService.isToastMessageNeeded = false;
	}

	private filterIgnoredUpdate(updateList: Array<AvailableUpdateDetail>, isIgnored: boolean) {
		const updates = updateList.filter((value: AvailableUpdateDetail) => {
			return (value.isIgnored === isIgnored);
		});
		return updates;
	}

	private filterUpdateByResult(updateList: Array<AvailableUpdateDetail>, updateStatusArray: Array<string>) {
		const filterArray = updateStatusArray.map(item => item.toLocaleLowerCase());
		const updates = updateList.filter((value: AvailableUpdateDetail) => {
			return filterArray.indexOf(value.installationStatus.toLowerCase()) > -1;
		});
		return updates;
	}

	private filterUpdate(updateList: Array<AvailableUpdateDetail>, packageSeverity: string) {
		const updates = updateList.filter((value: AvailableUpdateDetail) => {
			return (value.packageSeverity.toLowerCase() === packageSeverity.toLowerCase());
		});
		return updates;
	}

	public mapPackageListToIdString(updateList: Array<AvailableUpdateDetail>) {
		return updateList.map(item => item.packageID).join(',');
	}

	private mapStatusToMessageKey(status: number, defaultValue = 'unknown') {
		let messageKey = defaultValue;
		if (status >= 0 && status < SystemUpdateStatusMessage.StatusMessageMap.length) {
			messageKey = SystemUpdateStatusMessage.StatusMessageMap[status].statusKey;
		}
		return messageKey;
	}

	private sendInstallUpdateMetrics(updateList: Array<AvailableUpdateDetail>, ignoredUpdates: Array<AvailableUpdateDetail>) {
		const successUpdates = this.filterUpdateByResult(updateList, [UpdateActionResult.Success]);
		let failedUpdates = this.filterUpdateByResult(updateList,
			[UpdateActionResult.DownloadFailed, UpdateActionResult.InstallFailed]);

		if (ignoredUpdates && ignoredUpdates.length > 0) {
			failedUpdates = failedUpdates.filter(item => {
				for (const idx in ignoredUpdates) {
					if (ignoredUpdates[idx].packageID === item.packageID) {
						return false;
					}
				}
				return true;
			});

			const packageIds = this.mapPackageListToIdString(ignoredUpdates);
			this.metricService.sendInstallUpdateMetric(ignoredUpdates.length, packageIds, 'Ignored-NotInstallDueToACAdapterNotPluggedIn');
		}

		if (successUpdates.length > 0) {
			const packageIds = this.mapPackageListToIdString(successUpdates);
			this.metricService.sendInstallUpdateMetric(successUpdates.length, packageIds, 'success');
		}

		if (failedUpdates.length > 0) {
			const packageIds = this.mapPackageListToIdString(failedUpdates);
			this.metricService.sendInstallUpdateMetric(failedUpdates.length, packageIds, 'failure');
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case UpdateProgress.UpdateCheckInProgress:
					this.ngZone.run(() => {
						this.isUpdateCheckInProgress = true;
						this.percentCompleted = payload;
					});
					break;
				case UpdateProgress.UpdateCheckCompleted:
					this.isUpdateCheckInProgress = false;
					this.percentCompleted = this.systemUpdateService.percentCompleted;
					let messageKey = 'unknown';
					if (this.isUserCancelledUpdateCheck) {
						// when user cancels update check its throwing unknown exception
						messageKey = 'user cancel';
					} else {
						messageKey = this.mapStatusToMessageKey(payload.status);
						this.setUpdateTitle(payload.status);
					}
					this.focusOnElement(this.backButton);
					this.metricService.sendSystemUpdateMetric(0, '', messageKey, this.systemUpdateService.timeStartSearch);
					break;
				case UpdateProgress.UpdatesAvailable:
					this.isUpdateCheckInProgress = false;
					this.percentCompleted = this.systemUpdateService.percentCompleted;
					this.isUpdatesAvailable = this.updateAvailableAfterCheck();
					this.isInstallationCompleted = this.systemUpdateService.isInstallationCompleted;
					this.setUpdateByCategory(payload.updateList);
					this.systemUpdateService.getIgnoredUpdates();
					if (payload.updateList && this.systemUpdateService.timeStartSearch) {
						this.metricService.sendSystemUpdateMetric(
							payload.updateList.length,
							this.mapPackageListToIdString(payload.updateList),
							'success',
							this.systemUpdateService.timeStartSearch);
					}
					this.focusOnElement(this.backButton);
					break;
				case UpdateProgress.InstallingUpdate:
					this.isUpdateCheckInProgress = false;
					this.ngZone.run(() => {
						this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
						this.installationPercent = this.systemUpdateService.installationPercent;
						this.downloadingPercent = this.systemUpdateService.downloadingPercent;
					});
					break;
				case UpdateProgress.InstallationComplete:
					this.isUpdateCheckInProgress = false;
					this.systemUpdateService.getUpdateHistory();
					this.getLastUpdateScanDetail();
					this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
					this.isInstallationCompleted = this.systemUpdateService.isInstallationCompleted;
					this.isInstallationSuccess = this.systemUpdateService.isInstallationSuccess;
					if (!this.isRebootRequested) {
						this.checkRebootRequested();
					}
					this.showToastMessage(payload.updateList);
					this.setUpdateByCategory(payload.updateList);
					this.sendInstallUpdateMetrics(payload.updateList, this.systemUpdateService.ignoredRebootDelayUpdates);
					this.getSystemVolumeSpace();
					break;
				case UpdateProgress.AutoUpdateStatus:
					this.autoUpdateOptions[0].isChecked = payload.criticalAutoUpdates;
					this.autoUpdateOptions[1].isChecked = payload.recommendedAutoUpdates;
					this.isScheduleScanEnabled = payload.criticalAutoUpdates;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.SystemUpdateCriticalUpdateStatus, payload.criticalAutoUpdates);
					this.localCacheService.setLocalCacheValue(LocalStorageKey.SystemUpdateRecommendUpdateStatus, payload.recommendedAutoUpdates);
					if (!payload.criticalAutoUpdates) {
						this.autoUpdateOptions[1].isDisabled = true;
					} else {
						this.autoUpdateOptions[1].isDisabled = false;
					}
					this.getNextUpdatedScanText();
					break;
				case NetworkStatus.Online:
					if (this.isCheckingPluginStatus
						|| this.systemUpdateService.isImcErrorOrEmptyResponse) {
						this.getScheduleUpdateStatus(false);
					}
					this.isOnline = notification.payload.isOnline;
					this.offlineSubtitle = `${this.getLastUpdatedText()}<br>${this.getNextUpdatedScanText()}`;
					break;
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					this.offlineSubtitle = `${this.getLastUpdatedText()}<br>${this.getNextUpdatedScanText()}`;
					break;
				case UpdateProgress.UpdateDownloadCancelled:
					this.ngZone.run(() => {
						this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
						this.isInstallingAllUpdates = this.systemUpdateService.isInstallingAllUpdates;
						this.percentCompleted = this.systemUpdateService.percentCompleted;
						this.isUpdatesAvailable = this.updateAvailableAfterCheck();
						this.installationPercent = this.systemUpdateService.installationPercent;
						this.downloadingPercent = this.systemUpdateService.downloadingPercent;
					});
					if (this.systemUpdateService && this.systemUpdateService.updateInfo && this.systemUpdateService.updateInfo.updateList) {
						this.setUpdateByCategory(this.systemUpdateService.updateInfo.updateList);
					}
					break;
				case UpdateProgress.UpdateCheckCancelled:
					this.isCancelingStatus = false;
					break;
				case UpdateProgress.IgnoredUpdates:
					this.setUpdateByCategory(notification.payload);
					setTimeout(() => { this.focusOnElementGroup(this.systemUpdateService.ignoreFocusIds); }, 0);
					break;
				case AdPolicyEvent.AdPolicyUpdatedEvent:
					if (!payload.IsSystemUpdateEnabled) {
						if (this.isUpdateCheckInProgress) {
							this.onCancelUpdateCheck();
						}
						if (this.isUpdateDownloading) {
							this.onCancelUpdateDownload();
						}
						this.router.navigateByUrl('/dashboard');
					}
					break;
				case SelfSelectEvent.SegmentChange:
					this.initSecurityCard();
					break;
				default:
					break;
			}
			this.onScheduleUpdateNotification(type, payload);
		}
	}

	// handle background update notification
	private onScheduleUpdateNotification(type: string, payload: any) {
		if (this.isComponentInitialized) {
			switch (type) {
				case UpdateProgress.ScheduleUpdateChecking:
					this.isUpdateCheckInProgress = true;
					this.isCheckingPluginStatus = false;
					this.percentCompleted = this.systemUpdateService.percentCompleted;
					this.isCheckingStatus = true;
					break;
				case UpdateProgress.ScheduleUpdateCheckComplete:
					this.isUpdateCheckInProgress = false;
					this.isCheckingPluginStatus = false;
					this.percentCompleted = this.systemUpdateService.percentCompleted;
					this.isCheckingStatus = false;
					this.setUpdateTitle(payload);
					break;
				case UpdateProgress.ScheduleUpdatesAvailable:
					this.isUpdateCheckInProgress = false;
					this.isCheckingPluginStatus = false;
					this.percentCompleted = this.systemUpdateService.percentCompleted;
					this.isUpdatesAvailable = this.updateAvailableAfterCheck();
					this.isInstallationCompleted = this.systemUpdateService.isInstallationCompleted;
					this.setUpdateByCategory(payload.updateList);
					this.systemUpdateService.getIgnoredUpdates();
					break;
				case UpdateProgress.ScheduleUpdateDownloading:
					this.ngZone.run(() => {
						this.isUpdateCheckInProgress = false;
						this.isCheckingPluginStatus = false;
						this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
						this.installationPercent = this.systemUpdateService.installationPercent;
						this.downloadingPercent = this.systemUpdateService.downloadingPercent;
					});
					break;
				case UpdateProgress.ScheduleUpdateInstalling:
					this.ngZone.run(() => {
						this.isUpdateCheckInProgress = false;
						this.isCheckingPluginStatus = false;
						this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
						this.downloadingPercent = this.systemUpdateService.downloadingPercent;
						this.installationPercent = this.systemUpdateService.installationPercent;
					});
					break;
				case UpdateProgress.ScheduleUpdateIdle:
					this.isUpdateCheckInProgress = false;
					this.isCheckingPluginStatus = false;
					this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
					if (this.shouldCheckingUpdateByProtocol) {
						this.onCheckForUpdates();
						this.shouldCheckingUpdateByProtocol = false;
					}
					break;
				case UpdateProgress.ScheduleUpdateInstallationComplete:
					this.isCheckingPluginStatus = false;
					this.isUpdateCheckInProgress = false;
					this.isUpdateDownloading = this.systemUpdateService.isUpdateDownloading;
					this.isInstallationCompleted = this.systemUpdateService.isInstallationCompleted;
					this.isInstallationSuccess = this.systemUpdateService.isInstallationSuccess;
					this.showToastMessage(payload.updateList);
					this.setUpdateByCategory(payload.updateList);
					this.getLastUpdateScanDetail();
					this.systemUpdateService.getUpdateHistory();
					// using this check to avoid displaying more than on reboot confirm dialogs.
					if (!this.isRebootRequested) {
						this.checkRebootRequested();
					}
					this.getSystemVolumeSpace();
					break;
				default:
					break;
			}
		}
	}

	private resetState() {
		this.systemUpdateService.isUpdateDownloading = false;
		this.systemUpdateService.isInstallationSuccess = false;
		this.systemUpdateService.isInstallationCompleted = false;
		this.systemUpdateService.isDownloadingCancel = false;
		this.systemUpdateService.isCheckingCancel = false;
	}

	private getScheduleUpdateStatus(reportProgress: boolean) {
		this.isInstallFailedMessageToasted = false;
		this.isRebootRequested = false;
		this.systemUpdateService.getScheduleUpdateStatus(reportProgress);
	}

	private checkRebootRequested() {
		this.isRebootRequested = this.systemUpdateService.isRebootRequested();
		if (this.isRebootRequested) {
			const modalRef = this.modalService
				.open(ModalCommonConfirmationComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					ariaLabelledBy: 'modal_confirm_title',
					windowClass: 'common-confirmation-modal'
				});

			const header = 'systemUpdates.popup.rebootPending';
			const description = 'systemUpdates.popup.rebootRequiredMsg';
			modalRef.componentInstance.header = header;
			modalRef.componentInstance.description = description;
			modalRef.componentInstance.OkText = 'systemUpdates.popup.rebootButton';
			modalRef.componentInstance.CancelText = 'systemUpdates.popup.dismissButton';
			modalRef.componentInstance.metricsParent = 'Pages.SystemUpdate.RebootRequiredControl';
			modalRef.result.then(
				(result) => {
					if (result) {
						this.systemUpdateService.restartWindows();
					} else {
						modalRef.close();
					}
					this.systemUpdateService.isRebootRequiredDialogNeeded = false;
				}
			);
		}
	}

	private checkDiskSpaceEnough(updatesToInstall) {
		const diskSpaceNeeded = this.getRequiredDiskSpace(updatesToInstall);
		const diskSpaceEnough = diskSpaceNeeded < this.systemVolumeSpace;
		return diskSpaceEnough;
	}

	private getRequiredDiskSpace(updatesToInstall) {
		let diskSpaceNeeded = 0;
		if (updatesToInstall && updatesToInstall.length > 0) {
			updatesToInstall.forEach( update => {
				const spaceRequired = parseInt(update.diskSpaceRequired, 10);
				if (spaceRequired && spaceRequired > 0) {
					diskSpaceNeeded += spaceRequired;
				} else {
					this.logger.info('Invalid diskSpaceRequired: ' + update.packageID + update.diskSpaceNeeded);
				}
			});
		}
		this.logger.info('DiskSpaceNeeded for install updates: ' + diskSpaceNeeded);
		return diskSpaceNeeded;
	}

	private async getSystemVolumeSpace() {
		const systemVolumeLabel = this.getSystemVolumeLabel();
		const diskUsage = await this.deviceService.getAllDisksUsage();
		if (diskUsage && diskUsage.disks) {
			for (const disk of diskUsage.disks) {
				if (disk && disk.partitions && disk.partitions.length > 0) {
					for (const partition of disk.partitions) {
						if (partition && partition.driveLetter === systemVolumeLabel) {
							this.systemVolumeSpace = parseInt(partition.avaliableSize, 10);
							this.logger.info(`System Volume: ${this.systemVolumeSpace}`);
							return;
						}
					}
				}
			}
		}
	}

	private getSystemVolumeLabel() {
		const path = Windows.ApplicationModel.Package.current.installedLocation.path;
		if (path && path.length > 1) {
			return path[0];
		}
		else {
			return 'C';
		}
	}

	public onCancelUpdateDownload() {
		this.systemUpdateService.cancelUpdateDownload();
		this.focusOnElement(this.backButton);
	}

	private translateStrings() {
		this.translate.stream(this.title).subscribe((res) => {
			this.title = res;
		});
		this.translate.stream(this.back).subscribe((res) => {
			this.back = res;
		});
		this.translate.stream(this.lastUpdatedText).subscribe((res) => {
			this.lastUpdatedText = res;
		});
		this.translate.stream(this.nextScanText).subscribe((res) => {
			this.nextScanText = res;
		});
		this.translate.stream(this.installationHistory).subscribe((res) => {
			this.installationHistory = res;
		});
		this.translate.stream(this.autoUpdateOptions[0].header).subscribe((res) => {
			this.autoUpdateOptions[0].header = res;
		});
		this.translate.stream(this.autoUpdateOptions[0].tooltipText).subscribe((res) => {
			this.autoUpdateOptions[0].tooltipText = res;
		});
		this.translate.stream(this.autoUpdateOptions[1].header).subscribe((res) => {
			this.autoUpdateOptions[1].header = res;
		});
		this.translate.stream(this.autoUpdateOptions[1].tooltipText).subscribe((res) => {
			this.autoUpdateOptions[1].tooltipText = res;
		});
		this.translate.stream(this.autoUpdateOptions[2].header).subscribe((res) => {
			this.autoUpdateOptions[2].header = res;
		});
		this.translate.stream(this.autoUpdateOptions[2].linkText).subscribe((res) => {
			this.autoUpdateOptions[2].linkText = res;
		});
		this.translate.stream(this.updateToDateTitle).subscribe((res) => {
			this.updateToDateTitle = res;
		});
		this.translate.stream(this.neverCheckedText).subscribe((res) => {
			this.neverCheckedText = res;
		});
	}

	private changeCheckboxDisplay(displayValue: string) {
		const elementCheckboxes = document.querySelectorAll('.custom-control-input');
		elementCheckboxes.forEach((elementCheckbox: HTMLElement) => {
			elementCheckbox.style.display = displayValue;
		});
	}
}
