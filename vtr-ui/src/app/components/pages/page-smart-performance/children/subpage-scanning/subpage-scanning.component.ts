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
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';
import { SPCategory, SPHeaderImageType, SPSubCategory } from 'src/app/enums/smart-performance.enum';
import { ModalSmartPerformanceCancelComponent } from 'src/app/components/modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';
import { MatDialog } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-subpage-scanning',
	templateUrl: './subpage-scanning.component.html',
	styleUrls: ['./subpage-scanning.component.scss'],
})
export class SubpageScanningComponent implements OnInit, OnChanges {
	@Input() showProgress = true;
	@Input() percent = 0;
	@Input() isCheckingStatus = false;
	@Input() scheduleScanData: any = {};
	@Input() isAutoScanRunning = false;
	@Output() sendScanStatus = new EventEmitter();
	@Output() sendModelStatus = new EventEmitter();
	public tunePCFlag = true;
	public boostFlag = true;
	public malwareFlag = true;
	public responseData: any;
	public panelID;
	public activeGroup: any;
	public scanData: any = {};
	public timer: any;
	SPCategory = SPCategory;
	SPSubCategory = SPSubCategory;
	sampleDesc = '';
	index = 0;
	currentCategory = 1;
	currentScanningItems: any = [];
	isLoading: boolean;
	SPHeaderImageType = SPHeaderImageType;
	headerTitle = '';
	loop;
	delay;
	title = 'smartPerformance.title';
	isLongWordLang: boolean;
	constructor(
		private dialog: MatDialog,
		public shellServices: VantageShellService,
		public smartPerformanceService: SmartPerformanceService,
		private translate: TranslateService
	) {}

	ngOnInit() {
		this.percent = 0;
		this.isLoading = true;
		const curLang = this.translate.currentLang;
		this.isLongWordLang = curLang === 'de' || curLang === 'sv'
			|| curLang === 'da' || curLang === 'fi' || curLang === 'hu' || curLang === 'nb'
			|| curLang === 'nl';

		this.headerTitle = `${this.translate.instant(
			'smartPerformance.scanningPage.scanningSystem'
		)}`;

		this.activeGroup = SPCategory.TuneUpPerformance;

		this.sampleDesc = this.translate.instant(
			'smartPerformance.scanningPage.nowScanningDetail.tunePCDesc'
		);
		this.GetCurrentScanningRollingTexts(
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

		if (catVal === SPSubCategory.TunePC) {
			this.activeGroup = SPCategory.TuneUpPerformance;
		} else if (catVal === SPSubCategory.Boost) {
			this.activeGroup = SPCategory.InternetPerformance;
		} else if (catVal === SPSubCategory.Malware) {
			this.activeGroup = SPCategory.MalwareSecurity;
		}

		if (catVal === SPSubCategory.TunePC) {
			if (this.tunePCFlag === true) {
				this.sampleDesc = this.translate.instant(
					'smartPerformance.scanningPage.nowScanningDetail.tunePCDesc'
				);
				this.tunePCFlag = false;
			}
			if (subCatVal === SPSubCategory.TunePCAccumulateJunk) {
				this.GetCurrentScanningRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.tunePCScanningItems.accumulatedJunk'
					)
				);
			} else if (subCatVal === SPSubCategory.TunePCUsabilityIssues) {
				this.GetCurrentScanningRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.tunePCScanningItems.usabilityIssues'
					)
				);
			} else if (subCatVal === SPSubCategory.TunePCWindowsSettings) {
				this.GetCurrentScanningRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.tunePCScanningItems.windowsSettings'
					)
				);
			} else if (subCatVal === SPSubCategory.TunePCSystemErrors) {
				this.GetCurrentScanningRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.tunePCScanningItems.systemErrors'
					)
				);
			} else if (subCatVal === SPSubCategory.TunePCRegistryErrors) {
				this.GetCurrentScanningRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.tunePCScanningItems.registryErrors'
					)
				);
			}
			this.updateTitleAndSubItems(
				this.translate.instant('smartPerformance.tunePCPerformance.title'),
				this.sampleDesc
			);
		} else if (catVal === SPSubCategory.Boost) {
			if (this.boostFlag === true) {
				this.currentCategory = 2;
				this.sampleDesc = this.translate.instant(
					'smartPerformance.scanningPage.nowScanningDetail.boostDesc'
				);
				this.boostFlag = false;
			}
			if (catVal) {
				if (subCatVal === SPSubCategory.BoostEJunk) {
					this.GetCurrentScanningRollingTexts(
						this.translate.instant(
							'smartPerformance.scanningPage.nowScanningDetail.boostScanningItems.eJunk'
						)
					);
				} else if (subCatVal === SPSubCategory.BoostNetworkSettings) {
					this.GetCurrentScanningRollingTexts(
						this.translate.instant(
							'smartPerformance.scanningPage.nowScanningDetail.boostScanningItems.networkSettings'
						)
					);
				} else if (subCatVal === SPSubCategory.BoostBrowserSettings) {
					this.GetCurrentScanningRollingTexts(
						this.translate.instant(
							'smartPerformance.scanningPage.nowScanningDetail.boostScanningItems.browserSettings'
						)
					);
				} else if (subCatVal === SPSubCategory.BoostBrowserSecurity) {
					this.GetCurrentScanningRollingTexts(
						this.translate.instant(
							'smartPerformance.scanningPage.nowScanningDetail.boostScanningItems.browserSecurity'
						)
					);
				} else if (subCatVal === SPSubCategory.BoostWiFiPerformance) {
					this.GetCurrentScanningRollingTexts(
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
		} else if (catVal === SPSubCategory.Malware) {
			if (this.malwareFlag === true) {
				this.currentCategory = 3;
				this.sampleDesc = this.translate.instant(
					'smartPerformance.scanningPage.nowScanningDetail.malwareDesc'
				);
				this.malwareFlag = false;
			}
			if (subCatVal === SPSubCategory.MalwareSan) {
				this.GetCurrentScanningRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.malwareScanningItems.malwareScan'
					)
				);
			} else if (subCatVal === SPSubCategory.MalwareZeroDayInfections) {
				this.GetCurrentScanningRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.malwareScanningItems.zerodayInfections'
					)
				);
			} else if (subCatVal === SPSubCategory.MalwareErrantPrograms) {
				this.GetCurrentScanningRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.malwareScanningItems.errantPrograms'
					)
				);
			} else if (subCatVal === SPSubCategory.MalwareAnnoyingAdware) {
				this.GetCurrentScanningRollingTexts(
					this.translate.instant(
						'smartPerformance.scanningPage.nowScanningDetail.malwareScanningItems.annoyingAdware'
					)
				);
			} else if (subCatVal === SPSubCategory.MalwareSecuritySettings) {
				this.GetCurrentScanningRollingTexts(
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
		modalCancel.afterClosed().subscribe((res) => {
			if (res) {
				this.sendModelStatus.emit();
			}
		});
	}

	updateTitleAndSubItems(nameVal, descVal) {
		this.smartPerformanceService.subItems = {
			name: nameVal,
			desc: descVal,
			items: this.currentScanningItems,
		};
		nameVal = '';
	}

	GetCurrentScanningRollingTexts(scanItems: any) {
		this.currentScanningItems = [];
		for (const val in scanItems) {
			if (Object.prototype.hasOwnProperty.call(scanItems, val)) {
				this.currentScanningItems.push({ key: scanItems[val] });
			}
		}
		this.currentScanningItems[0].isCurrent = true;
	}




}
