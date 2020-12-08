import { Component, OnInit, OnDestroy } from '@angular/core';
import { SystemEventService } from '../../../services/system-event/system-event.service';
import { CommonService } from '../../../services/common/common.service';
import { Subscription, EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { MetricsTranslateService } from 'src/app/services/mertics-traslate/metrics-translate.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { SupportService } from 'src/app/services/support/support.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { enumSmartPerformance } from 'src/app/enums/smart-performance.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { SmartPerformanceDialogService } from 'src/app/services/smart-performance/smart-performance-dialog.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SPHistoryScanResultsDateTime } from './interface/smart-performance.interface';
import { cloneDeep } from 'lodash';

@Component({
	selector: 'vtr-page-smart-performance',
	templateUrl: './page-smart-performance.component.html',
	styleUrls: ['./page-smart-performance.component.scss'],
})
export class PageSmartPerformanceComponent implements OnInit, OnDestroy {
	private notificationSub: Subscription;
	private protocalListener: Subscription;
	eventName = 'SmartPerformance.ScheduleEventStarted';
	retryCount = 0;

	showSubscribersummary = false;
	public hasSubscribedScanCompleted = false;
	currentSubItemCategory: any = {};
	isScheduleScanRunning = false;
	isScanStarted = false;

	public issueCount = 0;
	public scanResult: SPHistoryScanResultsDateTime;

	public rating = 10;
	public leftAnimator = '0%';

	IsSmartPerformanceFirstRun: any;
	IsScheduleScanEnabled: any;
	isOldVersion = false;
	private subscription: Subscription;
	days: any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	private metrics: any;
	public isOnline = true;
	public subscriptionInfoStatus = false;

	constructor(
		private systemEventService: SystemEventService,
		private translate: TranslateService,
		private localInfoService: LocalInfoService,
		private commonService: CommonService,
		public smartPerformanceService: SmartPerformanceService,
		public smartPerformanceDialogService: SmartPerformanceDialogService,
		private logger: LoggerService,
		public shellServices: VantageShellService,
		public metricsTranslateService: MetricsTranslateService,
		public metricsService: MetricService,
		private localCacheService: LocalCacheService,
		private supportService: SupportService,
		private formatLocaleDate: FormatLocaleDatePipe,
		private activatedRoute: ActivatedRoute
	) {
		this.shellServices.getMetrics();
		this.metrics = this.shellServices.getMetrics();
	}

	ngOnInit() {
		this.smartPerformanceService.isEnterSmartPerformance = true;
		this.registerScanEvent();
		this.isOnline = this.commonService.isOnline;
		this.listenProtocal();

		this.smartPerformanceService.isSubscribed = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.IsFreeFullFeatureEnabled
		);
		if (this.smartPerformanceService.isSubscribed === undefined) {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.IsFreeFullFeatureEnabled,
				false
			);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.IsSmartPerformanceFirstRun,
				true
			);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.IsSPScheduleScanEnabled,
				true
			);
			this.IsSmartPerformanceFirstRun = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.IsSmartPerformanceFirstRun
			);
			this.writeSmartPerformanceActivity('True', 'False', 'InActive');
			this.smartPerformanceService.unregisterScanSchedule(
				enumSmartPerformance.SCHEDULESCANANDFIX
			);
		}
		const isFreePCScanRun = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.IsFreePCScanRun
		);
		if (isFreePCScanRun === undefined || isFreePCScanRun === false) {
			this.writeSmartPerformanceActivity('True', 'False', 'InActive');
		} else if (isFreePCScanRun === true) {
			this.writeSmartPerformanceActivity('True', 'True', 'InActive');
		}

		this.smartPerformanceService.getSubscriptionDataDetail((isSubscribed) => {
			isSubscribed
				? this.writeSmartPerformanceActivity('True', 'True', 'Active')
				: this.writeSmartPerformanceActivity('True', 'True', 'Expired');
		});

		if (this.smartPerformanceService.isShellAvailable) {
			this.checkReadiness();
		}
		this.subscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);

		this.smartPerformanceService.enableNextText = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.IsSPScheduleScanEnabled
		);
		if (this.smartPerformanceService.isScanningCompleted) {
			this.smartPerformanceService.isScanningCompleted = false;
		}
	}

	async registerScanEvent() {
		const isRegistered = await this.systemEventService.registerCustomEvent(this.eventName);
		if (isRegistered) {
			this.notificationSub = this.commonService.notification.subscribe((notification) => {
				if (
					notification &&
					notification.type &&
					notification.type.toString() === this.eventName
				) {
					if (!this.smartPerformanceService.isScanning) {
						this.switchToScanning();
					}
				}
			});
		} else {
			await this.unregisterScanEvent();
			if (this.retryCount < 1) {
				this.registerScanEvent();
			}
			this.retryCount += 1;
		}
	}

	async unregisterScanEvent() {
		await this.systemEventService.unRegisterCustomEvent(this.eventName);
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					if (this.isOnline) {
						this.smartPerformanceService.getLocalYearPrice();
					}
					break;
				default:
					break;
			}
		}
	}
	checkReadiness() {
		this.smartPerformanceService
			.getReadiness()
			.then((getReadinessFromService: any) => {
				this.logger.info(
					'ui-smart-performance.ngOnInit.getReadiness.then',
					getReadinessFromService
				);
				if (!getReadinessFromService) {
					this.switchToScanning();
				} else {
					if (!this.isScanStarted) {
						this.smartPerformanceService.isScanning = false;
					}
				}
			})
			.catch((error) => {
				this.logger.error('ui-smart-performance.ngOnInit.getReadiness.then', error);
			});
	}

	switchToScanning() {
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.HasSubscribedScanCompleted,
			false
		);
		this.smartPerformanceService.isScanning = true;
		this.registerScheduleScanEvent();
		this.getSmartPerformanceScheduleScanStatus();
	}

	registerScheduleScanEvent() {
		this.shellServices.registerEvent(EventTypes.smartPerformanceScheduleScanStatus, (event) => {
			this.smartPerformanceService.scheduleScanObj = null;
			this.updateScheduleScanStatus(event);
		});
	}

	updateSubItemsList(subItem) {
		this.currentSubItemCategory = subItem;
		if (subItem && subItem.items) {
			this.smartPerformanceService.subItems = subItem.items;
		} else {
			this.smartPerformanceService.subItems = [];
		}
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		this.unregisterScanEvent();
		if (this.notificationSub) {
			this.notificationSub.unsubscribe();
		}

		if (this.protocalListener) {
			this.protocalListener.unsubscribe();
		}
	}

	// Scan Now event from Summary Page
	changeScanEvent() {
		this.smartPerformanceService.isScanning = true;
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.HasSubscribedScanCompleted,
			false
		);
		if (this.smartPerformanceService.isShellAvailable) {
			this.smartPerformanceService
				.getReadiness()
				.then((getReadinessFromService: any) => {
					this.logger.info('ScanNow.getReadiness.then', getReadinessFromService);
					if (getReadinessFromService) {
						this.isScheduleScanRunning = false;

						this.shellServices.registerEvent(
							EventTypes.smartPerformanceScanStatus,
							(event) => {
								this.smartPerformanceService.scheduleScanObj = null;
								this.updateScheduleScanStatus(event);
							}
						);
						this.scanAndFixInformation();
						// Subscriber Scan Completed
						if (this.smartPerformanceService.isSubscribed) {
							this.hasSubscribedScanCompleted = true;
						} else {
							this.hasSubscribedScanCompleted = false;
						}
					} else {
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.HasSubscribedScanCompleted,
							false
						);
						this.smartPerformanceService.isScanning = true;
						this.registerScheduleScanEvent();
						this.getSmartPerformanceScheduleScanStatus();
						this.isScheduleScanRunning = true;
					}
				})
				.catch((error) => {
					this.logger.error('Chane scan Event', error);
				});
		}
		this.smartPerformanceService.isScanningCompleted = false;
	}

	updateScheduleScanStatus(response) {
		try {
			if (response && response.payload) {
				this.smartPerformanceService.scheduleScanObj = response;

				// 	this.smartPerformanceService.isScanningCompleted = true;
				// 	this.smartPerformanceService.isScanning = false;
			}
		} catch (err) {
			this.logger.error('ui-smart-performance.updateScheduleScanStatus.then', err);
		}
	}

	public async getSmartPerformanceScheduleScanStatus() {
		const scanStartedTime: any = new Date().getTime;
		let scanEndedTime;
		let timeDeff;
		let res;
		if (this.smartPerformanceService.isShellAvailable) {
			try {
				// this.smartPerformanceService.isSubscribed = this.localCacheService.getLocalCacheValue(
				// 	LocalStorageKey.IsFreeFullFeatureEnabled
				// );
				res = await this.smartPerformanceService.getScheduleScanStatus();
				if (res && res.scanstatus !== 'Idle') {
					const spSubscribeCancelModel = this.localCacheService.getLocalCacheValue(
						LocalStorageKey.HasSubscribedScanCompleted
					);
					if (spSubscribeCancelModel) {
						this.smartPerformanceService.scheduleScanObj = null;
						this.showSubscribersummary = false;
						scanEndedTime = new Date().getTime();
						if (scanStartedTime && scanEndedTime) {
							timeDeff = scanEndedTime - scanStartedTime;
						}
						this.sendsmartPerformanceMetrics('Cancelled', timeDeff);

					}
					else {
						this.setScanResultsAndStatus(res);
						if (res.percentage === 100) {
							scanEndedTime = new Date().getTime();
							if (scanStartedTime && scanEndedTime) {
								timeDeff = scanEndedTime - scanStartedTime;
							}
							this.sendsmartPerformanceMetrics('Success', timeDeff);
							this.shellServices.unRegisterEvent(EventTypes.smartPerformanceScanStatus, event => {
								this.updateScheduleScanStatus(event);
							});
						}
						this.logger.info('ui-smart-performance.getSmartPerformanceScheduleScanStatus', JSON.stringify(res));
					}
				}
			} catch (error) {
				this.logger.error(
					'ui-smart-performance.getSmartPerformanceScheduleScanStatus :: error',
					error.message
				);
				return EMPTY;
			}
		}
	}

	public async scanAndFixInformation() {
		const scanStartedTime: any = new Date().getTime();
		let scanEndedTime;
		let timeDeff;
		let res;
		if (this.smartPerformanceService.isShellAvailable) {
			try {
				this.smartPerformanceService.isSubscribed = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.IsFreeFullFeatureEnabled
				);
				if (this.smartPerformanceService.isSubscribed === true) {
					res = await this.smartPerformanceService.launchScanAndFix();
				} else {
					res = await this.smartPerformanceService.startScan();
				}
				if (res && res.state === true) {
					// Subscriber Scan cancel model
					const spSubscribeCancelModel = this.localCacheService.getLocalCacheValue(
						LocalStorageKey.HasSubscribedScanCompleted
					);
					if (spSubscribeCancelModel) {
						// this.hasSubscribedScanCompleted = false;
						this.smartPerformanceService.scheduleScanObj = null;
						this.showSubscribersummary = false;
						scanEndedTime = new Date().getTime();
						if (scanStartedTime && scanEndedTime) {
							timeDeff = scanEndedTime - scanStartedTime;
						}
						this.sendsmartPerformanceMetrics('Cancelled', timeDeff);
						// this.localCacheService.setLocalCacheValue(LocalStorageKey.HasSubscribedScanCompleted, false);
					}
					else {
						this.setScanResultsAndStatus(res);
						if (res.percentage === 100) {
							scanEndedTime = new Date().getTime();
							if (scanStartedTime && scanEndedTime) {
								timeDeff = scanEndedTime - scanStartedTime;
							}
							this.sendsmartPerformanceMetrics('Success', timeDeff);
							this.shellServices.unRegisterEvent(EventTypes.smartPerformanceScanStatus, event => {
								this.updateScheduleScanStatus(event);
							});
						}
						this.logger.info('ui-smart-performance.scanAndFixInformation ', JSON.stringify(res));
					}
				}
			} catch (error) {
				this.logger.error(
					'ui-smart-performance.scanAndFixInformation :: error',
					error.message
				);
				return EMPTY;
			}
		}
	}
	scanNow() {
		if (this.isOnline) {
			this.writeSmartPerformanceActivity('True', 'True', 'InActive');
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.HasSubscribedScanCompleted,
				false
			);
			if (this.smartPerformanceService.isShellAvailable) {
				this.isScanStarted = true;
				this.smartPerformanceService
					.getReadiness()
					.then((getReadinessFromService: any) => {
						this.logger.info('ScanNow.getReadiness.then', getReadinessFromService);
						if (getReadinessFromService) {
							this.localCacheService.setLocalCacheValue(
								LocalStorageKey.IsFreePCScanRun,
								true
							);
							this.isScheduleScanRunning = false;
							this.shellServices.registerEvent(
								EventTypes.smartPerformanceScanStatus,
								(event) => {
									this.smartPerformanceService.scheduleScanObj = null;
									this.updateScheduleScanStatus(event);
									this.smartPerformanceService.isScanning = true;
								}
							);
							this.smartPerformanceService.isScanning = true;
							this.scanAndFixInformation();
						} else {
							this.localCacheService.setLocalCacheValue(
								LocalStorageKey.HasSubscribedScanCompleted,
								false
							);
							this.smartPerformanceService.isScanning = true;
							this.registerScheduleScanEvent();
							this.getSmartPerformanceScheduleScanStatus();
							this.isScheduleScanRunning = true;
						}
					})
					.catch((error) => {
						this.logger.error('ScanNow.getReadiness.then', error);
					});
			}
		}
	}

	sendsmartPerformanceMetrics(taskResult: any, timeDeff) {
		const taskDuration = Math.round(timeDeff / 1000);
		const data = {
			TaskAction: {
				TaskResult: taskResult,
				TaskCount: this.issueCount || 0,
				TaskName: this.smartPerformanceService.isSubscribed ? 'ScanAndFix' : 'Scan',
				TaskParm: this.smartPerformanceService.isSubscribed ? 'ScanAndFix' : 'Scan',
				TaskDuration: taskDuration || 0,
			},
			ItemType: 'TaskAction',
		};
		if (this.metrics) {
			this.metrics.sendAsync(data);
		}
	}
	cancelScan() {
		this.smartPerformanceService.isScanning = false;
		this.smartPerformanceService.isScanningCompleted = false;
		this.showSubscribersummary = false;
	}

	cancelScanfromScanning() {
		this.smartPerformanceService.isScanning = false;
		this.smartPerformanceService.isScanningCompleted = false;
		this.showSubscribersummary = false;
	}
	changeManageSubscription(event) {
		this.smartPerformanceService.isSubscribed = event;
		if (event === true) {
			this.smartPerformanceService.unregisterScanSchedule(enumSmartPerformance.SCHEDULESCAN);
		} else {
			this.smartPerformanceService.unregisterScanSchedule(
				enumSmartPerformance.SCHEDULESCANANDFIX
			);
		}
	}
	changeSummaryToHome() {
		this.smartPerformanceService.isScanning = false;
		this.smartPerformanceService.isScanningCompleted = false;
		this.showSubscribersummary = false;
	}
	hideBasedOnOldAddInVersion($event) {
		this.isOldVersion = $event;
	}
	subscriptionInfo(event) {
		this.subscriptionInfoStatus = event || false;
	}

	async writeSmartPerformanceActivity(
		issmartperformanceopened,
		hasuserrunfreepcscan,
		issubscribed
	) {
		const payload = {
			issmartperformanceopened,
			hasuserrunfreepcscan,
			issubscribed,
		};
		this.logger.info(
			'subpage-smart-performance-dashboard.writeSmartPerformanceActivity.payload',
			payload
		);
		try {
			const res: any = await this.smartPerformanceService.writeSmartPerformanceActivity(
				payload
			);
		} catch (err) {
			this.logger.error(
				'subpage-smart-performance-dashboard.writeSmartPerformanceActivity.then',
				err
			);
		}
	}

	openSubscribeModal() {
		this.smartPerformanceDialogService.openSubscribeModal();
	}

	changeNextScanDateValue(nextScheduleScanEvent) {
		// retrieved this event from ui-scan-schedule component.
		if (!nextScheduleScanEvent.nextEnable) {
			this.smartPerformanceService.enableNextText = nextScheduleScanEvent.nextEnable;
			return;
		}
		this.smartPerformanceService.enableNextText = nextScheduleScanEvent.nextEnable;
		const nextScheduleScanDayMonth = this.formatLocaleDate.transformWithoutYear(
			nextScheduleScanEvent.nextScanDateWithYear
		);
		const nextDateObj = new Date(
			nextScheduleScanEvent.nextScanDateWithYear +
			', ' +
			nextScheduleScanEvent.nextScanHour +
			':' +
			nextScheduleScanEvent.nextScanMin +
			' ' +
			(nextScheduleScanEvent.nextScanAMPM === 'smartPerformance.scanSettings.am'
				? 'AM'
				: 'PM')
		);
		const timeSection = new Intl.DateTimeFormat(this.translate.currentLang, {
			hour12: true,
			hour: 'numeric',
			minute: 'numeric',
		}).format(nextDateObj);
		this.smartPerformanceService.nextScheduleScan =
			nextScheduleScanDayMonth +
			(this.translate.currentLang === 'en' ? ' at ' : ' ') +
			timeSection;
	}

	hideBasedOnOldAddInVersionInSummaryPage($event) {
		this.isOldVersion = $event;
		this.smartPerformanceService.enableNextText = !$event;
	}

	listenProtocal() {
		this.protocalListener = this.activatedRoute.queryParamMap.subscribe(
			async (params: ParamMap) => {
				if (
					params.has('action') &&
					this.activatedRoute.snapshot.queryParams.action === 'start'
				) {
					this.scanNow();
					await this.commonService.delay(3000);
					let precent = this.smartPerformanceService.scheduleScanObj?.payload?.percentage;
					let retry = 0;
					// retry 3 times if scan does not launched
					while ((!precent || precent < 1) && retry < 3) {
						this.logger.info(`retry to launch scan: ${retry}`);
						this.scanNow();
						await this.commonService.delay(3000);
						precent = this.smartPerformanceService.scheduleScanObj?.payload?.percentage;
						retry++;
					}
				}
			}
		);
	}
	setScanResultsAndStatus(res: any) {
		this.rating = res.rating;
		this.leftAnimator = (this.rating * 10 - 0).toString() + '%';
		this.scanResult = cloneDeep(res.result);
		this.issueCount = res.result.tune + res.result.boost + res.result.secure;
		this.smartPerformanceService.isScanning = false;
		this.smartPerformanceService.isScanningCompleted = true;
		this.showSubscribersummary = true;
	}

}
