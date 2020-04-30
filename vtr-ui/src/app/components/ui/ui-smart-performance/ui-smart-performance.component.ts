import { Component, OnInit, Input } from '@angular/core';
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
@Component({
	selector: 'vtr-ui-smart-performance',
	templateUrl: './ui-smart-performance.component.html',
	styleUrls: ['./ui-smart-performance.component.scss']
})
export class UiSmartPerformanceComponent implements OnInit {
	title = 'smartPerformance.title';
	back = 'smartPerformance.back';
	backarrow = '< ';
	isScanning = false;
	isScanningCompleted = false;
	subItems = [];
	currentSubItemCategory: any = {};
	@Input() activegroup = "Tune up performance";
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
	constructor(
		private translate: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		public smartPerformanceService: SmartPerformanceService,
		private logger: LoggerService,
		public shellServices: VantageShellService,
	) {
		this.translateStrings();
	}

	ngOnInit() {
		this.isSubscribed = this.commonService.getLocalStorageValue(LocalStorageKey.IsSmartPerformanceSubscribed);
		if (this.isSubscribed === undefined) {
			
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceSubscribed, false);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, true);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled, true);
			this.IsSmartPerformanceFirstRun = this.commonService.getLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun);
			 //if (this.IsSmartPerformanceFirstRun === true) {
				this.unregisterScheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix');
			// 	this.scheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScan', 'onceaweek', this.days[new Date().getDay()], new Date(), []);
			// 	//this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, false);
			// }
		}
		if (this.isSubscribed !== undefined && this.isSubscribed===true) {
			this.unregisterScheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScan');
		}

		if (this.smartPerformanceService.isShellAvailable) {
			this.smartPerformanceService
				.getReadiness()
				.then((getReadinessFromService: any) => {
					this.logger.info('ScanNow.getReadiness.then', getReadinessFromService);
					if (!getReadinessFromService) {
						this.isScanning = true;
						this.registerScheduleScanStatus();
						this.getSmartPerformanceStartScanInformation();
					}
					else {
						this.isScanning = false;
					}
				})
				.catch(error => { });
		}
	
	}
	async scheduleScan(scantype, frequency, day, time, date) {
		const payload = {
			scantype,
			frequency,
			day,
			time,
			date
		};
	//	console.log('payload--------------------------------------------------->', payload);
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
	registerScheduleScanStatus() {
		this.shellServices.registerEvent(EventTypes.smartPerformanceScheduleScanStatus,
			event => {
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
	changeScanEvent() {

		if (this.smartPerformanceService.isShellAvailable) {
			this.smartPerformanceService
				.getReadiness()
				.then((getReadinessFromService: any) => {
					this.logger.info('ScanNow.getReadiness.then', getReadinessFromService);
					if (getReadinessFromService) {
						this.shellServices.registerEvent(EventTypes.smartPerformanceScanStatus,
							event => {
								this.updateScheduleScanStatus(event);
							}
						);
						this.scanAndFixInformation();
						this.isScanning = true;
					}
					else {
						this.isScanning = false;
					}
				})
				.catch(error => {

				});
		}
		this.isScanningCompleted = false;
	}

	updateScheduleScanStatus(response) {
		try {
			this.scheduleScanObj = response;
			if (response && response.payload) {
				if (response.payload.percentage == 100) {
					this.isScanningCompleted = true;
					this.isScanning = false;
				}
			}
			if (!this.isScheduleScan) {
				this.isScheduleScan = true;
			}
			this.isScanning = true;
		} catch (err) {
			this.logger.error('ui-smart-performance.getScheduleScanStatus.then', err);
		}
	}

	public async getSmartPerformanceStartScanInformation() {
		let res;
		if (this.smartPerformanceService.isShellAvailable) {
			try {
				this.isSubscribed = this.commonService.getLocalStorageValue(
					LocalStorageKey.IsSmartPerformanceSubscribed
				);
				res = await this.smartPerformanceService.getScheduleScanStatus();
				if (res && res.scanstatus != 'Idle') {
					this.isScanningCompleted = true;
					this.isScanning = false;
					this.rating = res.rating;
					this.tune = res.result.tune;
					this.boost = res.result.boost;
					this.secure = res.result.secure;
					this.logger.info('changeScanStatus', this.isScanningCompleted + '>>>' + this.isScanning);
				}
			} catch (error) {
				this.logger.error(
					'getSmartPerformanceStartScanInformation :: error',
					error.message
				);
				return EMPTY;
			}
		}
	}
	public async scanAndFixInformation() {
		let res;
		if (this.smartPerformanceService.isShellAvailable) {
			try {
				this.isSubscribed = this.commonService.getLocalStorageValue(
					LocalStorageKey.IsSmartPerformanceSubscribed
				);
				if (this.isSubscribed == true) {
					res = await this.smartPerformanceService.launchScanAndFix();
				} else {
					res = await this.smartPerformanceService.startScan();
				}
				if (res && res.state === true) {
					this.isScanningCompleted = true;
					this.isScanning = false;
					this.rating = res.rating;
					this.tune = res.result.tune;
					this.boost = res.result.boost;
					this.secure = res.result.secure;
					this.logger.info('changeScanStatus', this.isScanningCompleted + '>>>' + this.isScanning);
				}
			} catch (error) {
				this.logger.error(
					'getSmartPerformanceStartScanInformation :: error',
					error.message
				);
				return EMPTY;
			}
		}
	}
	ScanNow() {
		if (this.smartPerformanceService.isShellAvailable) {
			this.smartPerformanceService
				.getReadiness()
				.then((getReadinessFromService: any) => {
					this.logger.info('ScanNow.getReadiness.then', getReadinessFromService);
					if (getReadinessFromService) {
						this.isScanning = true;
						this.shellServices.registerEvent(EventTypes.smartPerformanceScanStatus,
							event => {
								this.updateScheduleScanStatus(event);
							}
						);
						this.scanAndFixInformation();
					}
					else {
						this.isScanning = false;
					}
				})
				.catch(error => { });
		}
	}
	cancelScan() {
		this.isScanning = false;
		this.isScanningCompleted = false;
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
	
	

}
