import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	OnChanges
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceCancelComponent } from '../../modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';
import { WidgetSpeedometerComponent } from '../../widgets/widget-speedometer/widget-speedometer.component';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import {
	SPCategory,
	SPSubCategory
} from 'src/app/enums/smart-performance.enum';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { ModalSmartPerformanceFeedbackComponent } from '../../modal/modal-smart-performance-feedback/modal-smart-performance-feedback.component';
@Component({
	selector: 'vtr-ui-smart-performance-scanning',
	templateUrl: './ui-smart-performance-scanning.component.html',
	styleUrls: ['./ui-smart-performance-scanning.component.scss']
})
export class UiSmartPerformanceScanningComponent implements OnInit, OnChanges {
	// @ViewChild('speedometer') speedometer: WidgetSpeedometerComponent;
	@ViewChild('speedometer', { static: false })
	speedometer: WidgetSpeedometerComponent;
	@ViewChild('acc', { static: false }) accordionComponent: NgbAccordion;
	loop;
	delay;
	title = 'smartPerformance.title';
	@Input() showProgress = true;
	@Input() percent = 0;
	@Input() isCheckingStatus = false;
	@Output() sendScanStatus = new EventEmitter();
	@Output() sendModelStatus = new EventEmitter();
	public onehundreadFlag = true;
	public twohundreadFlag = true;
	public threehundreadFlag = true;
	public smartperformanceScanningStatusEventRef: any;
	public responseData: any;
	public panelID;
	public spCategoryenum: any;
	public spSubCategoryenum: any;
	isSubscribed: any;
	sampleDesc = '';
	index = 0;
	public activegroup: any;
	currentCategory = 1;
	subItems: any = {};
	currentScanningItems: any = [];
	public scanData: any = {};
	public timer: any;
	@Input() scheduleScanData: any = {};
	@Input() isScheduleScan: any = false;
	constructor(
		private modalService: NgbModal,
		public shellServices: VantageShellService,
		public smartPerformanceService: SmartPerformanceService,
		private logger: LoggerService,
		private translate: TranslateService,
		private commonService: CommonService
	) { }

	ngOnInit() {
		this.percent=0;
		this.spCategoryenum = SPCategory;
		this.spSubCategoryenum = SPSubCategory;
		this.activegroup = this.spCategoryenum.TUNEUPPERFORMANCE;
	 
		this.initSpeed();
		this.sampleDesc = this.translate.instant(
			'smartPerformance.scanningPage.nowScanningDetail.tunePCDesc'
		);
		this.GetCurrentScanninRollingTexts(
			this.translate.instant(
				'smartPerformance.scanningPage.nowScanningDetail.tunePCScanningItems.accumulatedJunk'
			)
		);
		this.updateTitleAndSubItems(
			this.translate.instant('smartPerformance.tunePCPerformance.title'),
			this.sampleDesc
		);
	}
	ngOnChanges(changes) {
		if (this.scheduleScanData) {
			this.updateScanResponse(this.scheduleScanData);
		}
	}
	initSpeed() {
		const self = this;
		self.loop = setInterval(function () {
			self.speedometer.speedCurrent = Math.floor(Math.random() * (self.speedometer.speedMax / 2)) + 1;
		}, 1000);

		self.delay = setTimeout(function () {
			clearInterval(self.loop);
			self.speedometer.speedCurrent = self.speedometer.speedMax * .9;
		}, 10000);
	}
	updateScanResponse(response) {
		this.responseData = response;
		this.scanData = response.payload;
		this.percent = this.scanData.percentage;
		const catVal = this.scanData.status.category;
		const subCatVal = this.scanData.status.subcategory;

		if (catVal === this.spSubCategoryenum.HUNDEREAD) {
			this.activegroup = this.spCategoryenum.TUNEUPPERFORMANCE;
			this.toggle(this.activegroup);
		} else if (catVal === this.spSubCategoryenum.TWOHUNDEREAD) {
			this.activegroup = this.spCategoryenum.INTERNETPERFORMANCE;
			this.toggle(this.activegroup);

		} else if (catVal === this.spSubCategoryenum.THREEHUNDEREAD) {
			this.activegroup = this.spCategoryenum.MALWARESECURITY;
			this.toggle(this.activegroup);
		}

		if (catVal === this.spSubCategoryenum.HUNDEREAD) {
			this.initSpeed();
			if (this.onehundreadFlag === true) {
				this.sampleDesc = this.translate.instant(
					'smartPerformance.scanningPage.nowScanningDetail.tunePCDesc'
				);
				this.onehundreadFlag = false;
			}
			if (subCatVal === this.spSubCategoryenum.HUNDEREADANDONE) {
				this.GetCurrentScanninRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.tunePCScanningItems.accumulatedJunk'
					)
				);
			} else if (subCatVal === this.spSubCategoryenum.HUNDEREADANDTWO) {
				this.GetCurrentScanninRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.tunePCScanningItems.usabilityIssues'
					)
				);
			} else if (subCatVal === this.spSubCategoryenum.HUNDEREADANDTHREE) {
				this.GetCurrentScanninRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.tunePCScanningItems.windowsSettings'
					)
				);
			} else if (subCatVal === this.spSubCategoryenum.HUNDEREADANDFOUR) {
				this.GetCurrentScanninRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.tunePCScanningItems.systemErrors'
					)
				);
			} else if (subCatVal === this.spSubCategoryenum.HUNDEREADANDFIVE) {
				this.GetCurrentScanninRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.tunePCScanningItems.registryErrors'
					)
				);
			}
			this.updateTitleAndSubItems(
				this.translate.instant(
					'smartPerformance.tunePCPerformance.title'
				),
				this.sampleDesc
			);

		} else if (catVal === this.spSubCategoryenum.TWOHUNDEREAD) {
			if (this.twohundreadFlag === true) {
				this.currentCategory = 2;
				this.sampleDesc = this.translate.instant(
					'smartPerformance.scanningPage.nowScanningDetail.boostDesc'
				);
				this.twohundreadFlag = false;
			}
			if (catVal) {
                if (subCatVal === this.spSubCategoryenum.TWOHUNDEREADANDONE) {
                    this.GetCurrentScanninRollingTexts(
						this.translate.instant(
							'smartPerformance.scanningPage.nowScanningDetail.boostScanningItems.eJunk'
						)
					);
                } else if (subCatVal === this.spSubCategoryenum.TWOHUNDEREADANDTWO) {
					this.GetCurrentScanninRollingTexts(
						this.translate.instant(
							'smartPerformance.scanningPage.nowScanningDetail.boostScanningItems.networkSettings'
						)
					);
				} else if (subCatVal === this.spSubCategoryenum.TWOHUNDEREADANDTHREE) {
					this.GetCurrentScanninRollingTexts(
						this.translate.instant(
							'smartPerformance.scanningPage.nowScanningDetail.boostScanningItems.browserSettings'
						)
					);
				} else if (subCatVal === this.spSubCategoryenum.TWOHUNDEREADANDFOUR) {
					this.GetCurrentScanninRollingTexts(
						this.translate.instant(
							'smartPerformance.scanningPage.nowScanningDetail.boostScanningItems.browserSecurity'
						)
					);
				} else if (subCatVal === this.spSubCategoryenum.TWOHUNDEREADANDFIVE) {
					this.GetCurrentScanninRollingTexts(
						this.translate.instant(
							'smartPerformance.scanningPage.nowScanningDetail.boostScanningItems.wifiPerformance'
						)
					);
				}
            }
			this.updateTitleAndSubItems(
				this.translate.instant(
					'smartPerformance.boostInternetPerformance.extraTitle'
				),
				this.sampleDesc
			);
		} else if (catVal === this.spSubCategoryenum.THREEHUNDEREAD) {
			if (this.threehundreadFlag === true) {
				this.currentCategory = 3;
				this.sampleDesc = this.translate.instant(
					'smartPerformance.scanningPage.nowScanningDetail.malwareDesc'
				);
				this.threehundreadFlag = false;
				// this.initSpeed();
			}
			if (subCatVal === this.spSubCategoryenum.THREEHUNDEREADANDONE) {
				this.GetCurrentScanninRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.malwareScanningItems.malwareScan'
					)
				);
			} else if (subCatVal === this.spSubCategoryenum.THREEHUNDEREADANDTWO) {
				this.GetCurrentScanninRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.malwareScanningItems.zerodayInfections'
					)
				);
			} else if (subCatVal === this.spSubCategoryenum.THREEHUNDEREADANDTHREE) {
				this.GetCurrentScanninRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.malwareScanningItems.errantPrograms'
					)
				);
			} else if (subCatVal === this.spSubCategoryenum.THREEHUNDEREADANDFOUR) {
				this.GetCurrentScanninRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.malwareScanningItems.annoyingAdware'
					)
				);
			} else if (subCatVal === this.spSubCategoryenum.THREEHUNDEREADANDFIVE) {
				this.GetCurrentScanninRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.malwareScanningItems.securitySettings'
					)
				);
			}
			this.updateTitleAndSubItems(
				this.translate.instant(
					'smartPerformance.malwareSecurity.title'
				),
				this.sampleDesc
			);
		}

		// if(this.percent > 0 && this.percent < 99) {
		// 	this.smartPerformanceService.scanningStopped.next(false)
		// }
		// de-activates the pop-up, when user is navigating away while scanning
		if(this.percent === 100) {
			this.smartPerformanceService.scanningStopped.next(true);
		}
	}

 

	async openCancelScanModel() {
		const modalCancel = this.modalService.open(ModalSmartPerformanceCancelComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'cancel-modal'
		});
		
		const response = await modalCancel.result
		if(response) {
			this.sendModelStatus.emit()
			// this.smartPerformanceService.scanningStopped.next(true)
		}
		// modalCancel.componentInstance.cancelRequested.subscribe(() => {
		// 	this.sendModelStatus.emit();
		// 	modalCancel.close();
		// });
	}

	toggle(id: string): void {
		this.accordionComponent.expand(id);
	}

	// updateTuneUpPerformanceSubItems(name, desc) {
	// 	this.subItems = {
	// 		name,
	// 		desc,
	// 		items: this.currentScanningItems
	// 	};
	// 	// this.subItemsList.emit(this.subItems);
	// }
	// updateMalwareSubItems(name, desc) {
	// 	this.subItems = {
	// 		name,
	// 		desc,
	// 		items: this.currentScanningItems
	// 	};
	// 	// this.subItemsList.emit(this.subItems);
	// }

	updateTitleAndSubItems(nameVal, descVal) {
		this.subItems = { name: nameVal,	desc: descVal,
			items: this.currentScanningItems
		};
		nameVal = '';
		// this.subItemsList.emit(this.subItems);
	}


	// updateInternetPerformanceSubItems(name, desc) {
	// 	this.subItems = {
	// 		name,
	// 		desc,
	// 		items: this.currentScanningItems
	// 	};
	// 	// this.subItemsList.emit(this.subItems);
	// }

	GetCurrentScanninRollingTexts(scanitems: any) {

		
		this.currentScanningItems = [];
		for (const val in scanitems) {
			//console.log(scanitems[val]); // prints values: 10, 20, 30, 40
			this.currentScanningItems.push({ key: scanitems[val] });
		}
		//console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",this.currentScanningItems);
		this.currentScanningItems[0]['isCurrent'] = true;
		
	}

	/**
	   * SP Feedback form
	   */
	  onclickFeedback() {
		this.modalService.open(ModalSmartPerformanceFeedbackComponent, {
			// backdrop: 'static',
			size: 'lg',
			keyboard: false,
			centered: true,
			windowClass: 'smart-performance-feedback-Modal'
		});
	}


}
