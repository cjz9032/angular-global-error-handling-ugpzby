import {
	Component,
	OnInit,
	OnChanges,
	ViewChild,
	Input,
	Output,
	EventEmitter,
	ElementRef,
} from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { SPCategory, SPHeaderImageType, SPSubCategory } from 'src/app/enums/smart-performance.enum';
import { SecureMath } from '@lenovo/tan-client-bridge';
import { ModalSmartPerformanceCancelComponent } from 'src/app/components/modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';
import { MatDialog } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-subpage-scanning',
	templateUrl: './subpage-scanning.component.html',
	styleUrls: ['./subpage-scanning.component.scss'],
})
export class SubpageScanningComponent implements OnInit, OnChanges {
	@ViewChild('acc', { static: false }) accordionComponent: NgbAccordion;
	@ViewChild('spScanningAccordion', { static: false }) spScanningAccordion: ElementRef;
	loop;
	delay;
	title = 'smartPerformance.title';
	@Input() showProgress = true;
	@Input() percent = 0;
	@Input() isCheckingStatus = false;
	@Input() isAutoScanRunning = false;
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
	sampleDesc = '';
	index = 0;
	public activegroup: any;
	currentCategory = 1;
	currentScanningItems: any = [];
	public scanData: any = {};
	public timer: any;
	@Input() scheduleScanData: any = {};
	isLoading: boolean;
	SPHeaderImageType = SPHeaderImageType;
	headerTitle = '';
	constructor(
		private dialog: MatDialog,
		public shellServices: VantageShellService,
		public smartPerformanceService: SmartPerformanceService,
		private translate: TranslateService
	) { }

	ngOnInit() {
		this.percent = 0;
		this.isLoading = true;

		this.headerTitle = `${this.translate.instant(
			'smartPerformance.scanningPage.scanningSystem'
		)}...`;
		if (this.isAutoScanRunning) {
			this.headerTitle += ` <span class="small">(${this.translate.instant(
				'smartPerformance.auto'
			)})</span>`;
		}

		this.spCategoryenum = SPCategory;
		this.spSubCategoryenum = SPSubCategory;
		this.activegroup = this.spCategoryenum.TUNEUPPERFORMANCE;

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
		setTimeout(() => {
			const accordionCards: HTMLButtonElement[] = this.spScanningAccordion.nativeElement.getElementsByTagName(
				'button'
			);
			for (const card of accordionCards) {
				card.setAttribute('tabindex', '-1');
			}
		}, 0);
	}
	ngOnChanges(changes) {
		if (this.scheduleScanData) {
			this.updateScanResponse(this.scheduleScanData);
		}
	}

	updateScanResponse(response) {
		if (this.scanData.percentage) {
			this.isLoading = false;
		}
		this.responseData = response;
		this.scanData = response.payload;
		if (!(this.percent === 0 && this.scanData.percentage === 100)) {
			this.percent = this.scanData.percentage;
		}
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
				this.translate.instant('smartPerformance.tunePCPerformance.title'),
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
				this.translate.instant('smartPerformance.boostInternetPerformance.extraTitle'),
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
				this.translate.instant('smartPerformance.malwareSecurity.title'),
				this.sampleDesc
			);
		}
	}

	async openCancelScanModel() {
		const modalCancel = this.dialog.open(ModalSmartPerformanceCancelComponent, {
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'cancel-modal',
		});
		const response = await modalCancel.afterOpened();
		if (response) {
			this.sendModelStatus.emit();
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
	// 	this.smartPerformanceService.subItems = {
	// 		name,
	// 		desc,
	// 		items: this.currentScanningItems
	// 	};
	// 	// this.subItemsList.emit(this.smartPerformanceService.subItems);
	// }
	// updateMalwareSubItems(name, desc) {
	// 	this.smartPerformanceService.subItems = {
	// 		name,
	// 		desc,
	// 		items: this.currentScanningItems
	// 	};
	// 	// this.subItemsList.emit(this.smartPerformanceService.subItems);
	// }

	updateTitleAndSubItems(nameVal, descVal) {
		this.smartPerformanceService.subItems = {
			name: nameVal,
			desc: descVal,
			items: this.currentScanningItems,
		};
		nameVal = '';
		// this.subItemsList.emit(this.smartPerformanceService.subItems);
	}

	// updateInternetPerformanceSubItems(name, desc) {
	// 	this.smartPerformanceService.subItems = {
	// 		name,
	// 		desc,
	// 		items: this.currentScanningItems
	// 	};
	// 	// this.subItemsList.emit(this.smartPerformanceService.subItems);
	// }

	GetCurrentScanninRollingTexts(scanitems: any) {
		this.currentScanningItems = [];
		for (const val in scanitems) {
			if (Object.prototype.hasOwnProperty.call(scanitems, val)) {
				// console.log(scanitems[val]); // prints values: 10, 20, 30, 40
				this.currentScanningItems.push({ key: scanitems[val] });
			}
		}
		// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",this.currentScanningItems);
		this.currentScanningItems[0].isCurrent = true;
	}
}
