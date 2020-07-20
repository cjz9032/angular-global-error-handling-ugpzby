import { Component, OnInit, OnDestroy, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Subscription, EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
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
import { ModalSmartPerformanceSubscribeComponent } from 'src/app/components/modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { ModalSmartPerformanceFeedbackComponent } from 'src/app/components/modal/modal-smart-performance-feedback/modal-smart-performance-feedback.component';

@Component({
  selector: 'vtr-subpage-smart-performance-dashboard',
  templateUrl: './subpage-smart-performance-dashboard.component.html',
  styleUrls: ['./subpage-smart-performance-dashboard.component.scss']
})
export class SubpageSmartPerformanceDashboardComponent implements OnInit, OnDestroy, OnChanges {

	title = 'smartPerformance.title';
	back = 'smartPerformance.back';
	backarrow = '< ';
	isScanning = false;
	isScanningCompleted = false;
	showSubscribersummary = false;
	public hasSubscribedScanCompleted = false;
	subItems = [];
	currentSubItemCategory: any = {};
	isScheduleScanRunning = false;
	@Input() activegroup = 'Tune up performance';
	@Input() isScanningStarted = 0;
	isSubscribed = false;
	public tune = 0;
	public boost = 0;
	public secure = 0;
	public rating = 0;

	scheduleScanObj = null;
	isScheduleScan = false;
	IsSmartPerformanceFirstRun: any;
	IsScheduleScanEnabled: any;
	isOldVersion = false ;
	private subscription: Subscription;
	days: any = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];
	private metrics: any;
	public isOnline = true;

	constructor(
		private translate: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		public smartPerformanceService: SmartPerformanceService,
		private logger: LoggerService,
		public shellServices: VantageShellService,
		public metricsTranslateService: MetricsTranslateService,
		public metricsService: MetricService,
		private supportService: SupportService,

	) {
		this.translateStrings();
		this.shellServices.getMetrics();
		this.metrics = this.shellServices.getMetrics();

	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes && changes.isScanningStarted && !changes.isScanningStarted.firstChange) {
			this.checkReadiness();
		}
	}
	ngOnInit() {
		this.isOnline = this.commonService.isOnline;

		this.isSubscribed = this.commonService.getLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled);
		if (this.isSubscribed === undefined) {
			this.commonService.setLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled, false);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, true);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled, true);
			this.IsSmartPerformanceFirstRun = this.commonService.getLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun);
			// if (this.IsSmartPerformanceFirstRun === true) {
			this.unregisterScheduleScan(enumSmartPerformance.SCHEDULESCANANDFIX);
			// 	this.scheduleScan(enumSmartPerformance.SCHEDULESCAN, 'onceaweek', this.days[new Date().getDay()], new Date(), []);
			// 	//this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, false);
			// }
		}
		this.getSubscriptionDetails();

		if (this.smartPerformanceService.isShellAvailable) {
		this.checkReadiness();
		}
		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}
	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
					default:
					break;
			}
		}
	}
	checkReadiness() {
		this.smartPerformanceService.getReadiness()
			.then((getReadinessFromService: any) => {
				this.logger.info('ui-smart-performance.ngOnInit.getReadiness.then', getReadinessFromService);
				if (!getReadinessFromService) {
					this.commonService.setLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted, false);
					this.isScanning = true;
					this.registerScheduleScanEvent();
					this.getSmartPerformanceScheduleScanStatus();
				}
				else {
					this.isScanning = false;
				}
			})
			.catch(error => {
				this.logger.error('ui-smart-performance.ngOnInit.getReadiness.then', error);
			})
	}

	async scheduleScan(scantype, frequency, day, time, date) {
		const payload = {
			scantype,
			frequency,
			day,
			time,
			date
		};
		try {
			const res: any = await this.smartPerformanceService.setScanSchedule(
				payload
			);

		} catch (err) {
			this.logger.error('ui-smart-performance.scheduleScan.then', err);
		}
	}
	private translateStrings() {
		this.translate.stream(this.title).subscribe((res) => {
			this.title = res;
		});
		this.translate.stream(this.back).subscribe((res) => {
			this.back = res;
		});

	}
	registerScheduleScanEvent() {
		this.shellServices.registerEvent(EventTypes.smartPerformanceScheduleScanStatus,
			event => {
				this.scheduleScanObj = null;
				this.updateScheduleScanStatus(event);
			}
		);
	}
	public changeScanStatus($event) {
		this.isScanningCompleted = true;
		this.isScanning = false;
		this.rating = $event.rating;
		this.tune = $event.tune;
		this.boost = $event.boost;
		this.secure = $event.secure;
		this.logger.info('changeScanStatus', this.isScanningCompleted + '>>>' + this.isScanning);
	}
	openSubscribeModal() {
		this.modalService.open(ModalSmartPerformanceSubscribeComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			windowClass: 'subscribe-modal',
		});
	}
	updateSubItemsList(subItem) {
		this.currentSubItemCategory = subItem;
		if (subItem && subItem.items) {
			this.subItems = subItem.items;
		} else {
			this.subItems = [];
		}
	}

	ngOnDestroy() {
		if(this.subscription){
			this.subscription.unsubscribe();
		}
	}

	// Scan Now event from Summary Page
	changeScanEvent() {
		this.isScanning = true;
		this.commonService.setLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted, false);
		if (this.smartPerformanceService.isShellAvailable) {
			this.smartPerformanceService
				.getReadiness()
				.then((getReadinessFromService: any) => {
					this.logger.info('ScanNow.getReadiness.then', getReadinessFromService);
					if (getReadinessFromService) {
						this.isScheduleScanRunning = false;

						this.shellServices.registerEvent(EventTypes.smartPerformanceScanStatus,
							event => {
								this.scheduleScanObj = null;
								this.updateScheduleScanStatus(event);
							}
						);
						this.scanAndFixInformation();
						// Subscriber Scan Completed
						if (this.isSubscribed) {
							this.hasSubscribedScanCompleted = true;
						}
						else {
							this.hasSubscribedScanCompleted = false;
						}
					}
					else {
						this.commonService.setLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted, false);
						this.isScanning = true;
						this.registerScheduleScanEvent();
						this.getSmartPerformanceScheduleScanStatus();
						this.isScheduleScanRunning = true;
					}
				})
				.catch(error => {
					this.logger.error('Chane scan Event', error);
				});
		}
		this.isScanningCompleted = false;
	}

	updateScheduleScanStatus(response) {
		try {
			if (response && response.payload) {
				this.scheduleScanObj = response;

				// 	this.isScanningCompleted = true;
				// 	this.isScanning = false;

				// if (!this.isScheduleScan) {
				// 	this.isScheduleScan = true;
				// }
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
				// this.isSubscribed = this.commonService.getLocalStorageValue(
				// 	LocalStorageKey.IsFreeFullFeatureEnabled
				// );
				res = await this.smartPerformanceService.getScheduleScanStatus();
				if (res && res.scanstatus != 'Idle') {
					let spSubscribeCancelModel = this.commonService.getLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted);
					if (spSubscribeCancelModel) {
						this.scheduleScanObj = null;
						this.showSubscribersummary = false;
						scanEndedTime = new Date().getTime();
						if (scanStartedTime && scanEndedTime) {
							timeDeff = scanEndedTime - scanStartedTime;
						}
						this.sendsmartPerformanceMetrics('Cancelled', timeDeff);

					}
					else {
						this.rating = res.rating;
						this.tune = res.result.tune;
						this.boost = res.result.boost;
						this.secure = res.result.secure;
						if (res.percentage == 100) {
							scanEndedTime = new Date().getTime();
							if (scanStartedTime && scanEndedTime) {
								timeDeff = scanEndedTime - scanStartedTime;
							}
							this.sendsmartPerformanceMetrics('Success', timeDeff);
							this.shellServices.unRegisterEvent(EventTypes.smartPerformanceScanStatus, event => {
								this.updateScheduleScanStatus(event);
							}
							);
						}
						this.isScanning = false;
						this.isScanningCompleted = true;
						this.showSubscribersummary = true;
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
				this.isSubscribed = this.commonService.getLocalStorageValue(
					LocalStorageKey.IsFreeFullFeatureEnabled
				);
				if (this.isSubscribed == true) {
					res = await this.smartPerformanceService.launchScanAndFix();
				} else {
					res = await this.smartPerformanceService.startScan();
				}
				if (res && res.state === true) {
					// Subscriber Scan cancel model
					let spSubscribeCancelModel = this.commonService.getLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted);
					if (spSubscribeCancelModel) {
						// this.hasSubscribedScanCompleted = false;
						this.scheduleScanObj = null;
						this.showSubscribersummary = false;
						scanEndedTime = new Date().getTime();
						if (scanStartedTime && scanEndedTime) {
							timeDeff = scanEndedTime - scanStartedTime;
						}
						this.sendsmartPerformanceMetrics('Cancelled', timeDeff);
						// this.commonService.setLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted, false);
					}
					else {
						// this.hasSubscribedScanCompleted = true;
						this.showSubscribersummary = true;
						this.isScanning = false;
						this.rating = res.rating;
						this.tune = res.result.tune;
						this.boost = res.result.boost;
						this.secure = res.result.secure;
						if (res.percentage == 100) {
							scanEndedTime = new Date().getTime();
							if (scanStartedTime && scanEndedTime) {
								timeDeff = scanEndedTime - scanStartedTime;
							}
							this.sendsmartPerformanceMetrics('Success', timeDeff);
							this.shellServices.unRegisterEvent(EventTypes.smartPerformanceScanStatus, event => {
								this.updateScheduleScanStatus(event);
							}
							);
						}
						this.isScanning = false;
						this.isScanningCompleted = true;
						this.showSubscribersummary = true;
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
			this.commonService.setLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted, false);
			if (this.smartPerformanceService.isShellAvailable) {
				this.smartPerformanceService
					.getReadiness()
					.then((getReadinessFromService: any) => {
						this.logger.info('ScanNow.getReadiness.then', getReadinessFromService);
						if (getReadinessFromService) {
							this.isScheduleScanRunning = false;

							this.shellServices.registerEvent(EventTypes.smartPerformanceScanStatus,
								event => {
									this.scheduleScanObj = null;
									this.updateScheduleScanStatus(event);
								}
							);
							this.isScanning = true;
							this.scanAndFixInformation();
						}
						else {
							this.commonService.setLocalStorageValue(LocalStorageKey.HasSubscribedScanCompleted, false);
							this.isScanning = true;
							this.registerScheduleScanEvent();
							this.getSmartPerformanceScheduleScanStatus();
							this.isScheduleScanRunning = true;

						}
					})
					.catch(error => {
						this.logger.error('ScanNow.getReadiness.then', error)
					})
			}
		}
	}

	sendsmartPerformanceMetrics(taskResult: any, timeDeff) {
		const taskDuration = Math.round(timeDeff/1000);
		const data = {
			TaskAction: {
				TaskResult: taskResult,
				TaskCount: this.tune + this.boost + this.secure || 0,
				TaskName: this.isSubscribed ? 'ScanAndFix' : 'Scan',
				TaskParm:  this.isSubscribed ? 'ScanAndFix' : 'Scan',
				TaskDuration: taskDuration || 0
			},
			ItemType: 'TaskAction'
		};
		if (this.metrics) {
			this.metrics.sendAsync(data);
		}
	}
	cancelScan() {
		this.isScanning = false;
		this.isScanningCompleted = false;
		this.showSubscribersummary = false;
	}


	async unregisterScheduleScan(scantype) {

		const payload = {
			scantype
		};
		this.logger.info('ui-smart-performance.unregisterScheduleScan', JSON.stringify(payload));
		try {
			const res: any = await this.smartPerformanceService.unregisterScanSchedule(payload);
			this.logger.info('ui-smart-performance.unregisterScheduleScan.then', JSON.stringify(res));
		} catch (err) {
			this.logger.error('ui-smart-performance.unregisterScheduleScan.then', err);
		}
	}

	onclickFeedback() {
		this.modalService.open(ModalSmartPerformanceFeedbackComponent, {
			backdrop: true,
			size: 'lg',
			keyboard: false,
			centered: true,
			windowClass: 'smart-performance-feedback-Modal'
		})
	}

	cancelScanfromScanning() {
		this.isScanning = false;
		this.isScanningCompleted = false;
		this.showSubscribersummary = false;
	}
	changeManageSubscription(event) {
		this.unregisterScheduleScan(enumSmartPerformance.SCHEDULESCAN);
		// this.isSubscribed = this.commonService.getLocalStorageValue(
		// 	LocalStorageKey.IsFreeFullFeatureEnabled
		// );
		this.isSubscribed = event;
	}
	changeSummaryToHome() {
		this.isScanning = false;
		this.isScanningCompleted = false;
		this.showSubscribersummary = false;
	}
	async getSubscriptionDetails() {
		let machineInfo;
		machineInfo = await this.supportService.getMachineInfo()
		const subscriptionDetails = await this.smartPerformanceService.getPaymentDetails( machineInfo.serialnumber);
		this.logger.info('ui-smart-performance.component.getSubscriptionDetails', subscriptionDetails);
		if (subscriptionDetails && subscriptionDetails.data) {
			this.commonService.setLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled, true);
		} else {
			this.commonService.setLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled, false);
		}
		this.isSubscribed = this.commonService.getLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled);
		if (this.isSubscribed !== undefined && this.isSubscribed === true) {
			this.unregisterScheduleScan(enumSmartPerformance.SCHEDULESCAN);
		}
		else
		{
			this.unregisterScheduleScan(enumSmartPerformance.SCHEDULESCANANDFIX);
		}
	}
	hideBasedOnOldAddInVersion($event){
		this.isOldVersion = $event;
	}
}