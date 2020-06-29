import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import moment from 'moment';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EMPTY } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { ModalSmartPerformanceFeedbackComponent } from '../../modal/modal-smart-performance-feedback/modal-smart-performance-feedback.component';
import { MetricsTranslateService } from 'src/app/services/mertics-traslate/metrics-translate.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
@Component({
	selector: 'vtr-ui-smart-performance',
	templateUrl: './ui-smart-performance.component.html',
	styleUrls: ['./ui-smart-performance.component.scss']
})
export class UiSmartPerformanceComponent implements OnInit, OnChanges {

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
	constructor(
		private translate: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		public smartPerformanceService: SmartPerformanceService,
		private logger: LoggerService,
		public shellServices: VantageShellService,
		public metricsTranslateService: MetricsTranslateService,
		public metricsService: MetricService,

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
		this.isSubscribed = this.commonService.getLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled);
		if (this.isSubscribed === undefined) {

			this.commonService.setLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled, false);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, true);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled, true);
			this.IsSmartPerformanceFirstRun = this.commonService.getLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun);
			//if (this.IsSmartPerformanceFirstRun === true) {
			this.unregisterScheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix');
			// 	this.scheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScan', 'onceaweek', this.days[new Date().getDay()], new Date(), []);
			// 	//this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, false);
			// }
		}
		if (this.isSubscribed !== undefined && this.isSubscribed === true) {
			this.unregisterScheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScan');
		}

		if (this.smartPerformanceService.isShellAvailable) {
		this.checkReadiness();
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
	//Scan Now event from Summary Page
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
		this.unregisterScheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScan');
		this.isSubscribed = this.commonService.getLocalStorageValue(
			LocalStorageKey.IsFreeFullFeatureEnabled
		);
	}
	changeSummaryToHome() {
		this.isScanning = false;
		this.isScanningCompleted = false;
		this.showSubscribersummary = false;
	}

}
