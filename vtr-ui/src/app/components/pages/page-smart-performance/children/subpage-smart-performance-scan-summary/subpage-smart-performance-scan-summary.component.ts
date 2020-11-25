import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SupportService } from 'src/app/services/support/support.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { enumSmartPerformance, PaymentPage, SPHeaderImageType } from 'src/app/enums/smart-performance.enum';
import { formatDate } from '@angular/common';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';

import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { SmartPerformanceDialogService } from 'src/app/services/smart-performance/smart-performance-dialog.service';

@Component({
	selector: 'vtr-subpage-smart-performance-scan-summary',
	templateUrl: './subpage-smart-performance-scan-summary.component.html',
	styleUrls: ['./subpage-smart-performance-scan-summary.component.scss']
})
export class SubpageSmartPerformanceScanSummaryComponent implements OnInit {
	constructor(
		private calendar: NgbCalendar,
		private logger: LoggerService,
		private supportService: SupportService,
		public smartPerformanceService: SmartPerformanceService,
		public smartPerformanceDialogService: SmartPerformanceDialogService,
		public shellServices: VantageShellService,
		private translate: TranslateService,
		private localCacheService: LocalCacheService,
		private formatLocaleDate: FormatLocaleDatePipe
	) {

	}
	public sizeExtension: string;
	public isLoading = true;
	public machineFamilyName: string;
	public today = new Date();
	public items: any = [];
	title = 'smartPerformance.title';
	/* Quarterly option is hidden for current 3.3 release */
	// public menuItems: any = [
	// 	{ itemName: 'Annual', itemKey: 'ANNUAL' },
	// 	{ itemName: 'Quarterly', itemKey: 'QUARTERLY' },
	// 	{ itemName: 'Custom', itemKey: 'CUSTOM' }
	// ];
	public menuItems: any = [
		{ itemName: 'smartPerformance.subscriberScanHomePage.scanSummary.annual', itemKey: 'ANNUAL' },
		{ itemName: 'smartPerformance.subscriberScanHomePage.scanSummary.custom', itemKey: 'CUSTOM' }
	];
	subscribeScanSummaries = [
		{ id: 'smart-performance-scan-summary-tunePC-title', textKey: 'smartPerformance.tunePCPerformance.title' },
		{ id: 'smart-performance-scan-summary-extraTitle', textKey: 'smartPerformance.boostInternetPerformance.extraTitle' },
		{ id: 'smart-performance-scan-summary-malware-title', textKey: 'smartPerformance.malwareSecurity.title' },
	];
	leftAnimator: any;
	@Input() inputIsScanningCompleted = false;
	@Input() hasSubscribedScanCompleted = false;
	@Input() tune = 0;
	@Input() boost = 0;
	@Input() secure = 0;
	@Input() rating = 0;
	@Input() isOnline = true;

	@ViewChild('menuTab') menuTab: ElementRef;

	public tabIndex: number;
	public toggleValue: number;
	public currentYear: any;
	public lastYear: any;
	Data = [1, 2, 3];
	historyRes: any = {};
	historyScanResults = [];
	historyScanResultsDateTime = [];
	public quarterlyMenu: any = [
		{ displayName: 'Jan-Mar', ...this.getQuartesDates(0, 2), key: 1 },
		{ displayName: 'Apr-Jun', ...this.getQuartesDates(3, 5), key: 2 },
		{ displayName: 'Jul-Sept', ...this.getQuartesDates(6, 8), key: 3 },
		{ displayName: 'Oct-Dec', ...this.getQuartesDates(9, 11), key: 4 }
	];
	menuStatus = true;
	selectedResult: any;
	annualYear: any;
	quarterlyMonth: any;
	isDropDownOpen: boolean;
	dropDownToggle: boolean;
	currentDate: any;
	currentDateLocalFormat: any;
	fromDate: any;
	toDate: any;
	selectedDate: any;
	isFromDate: boolean;
	selectedfromDate: any;
	selectedTodate: any;
	displayFromDate: any;
	displayToDate: any;
	oldDisplayFromDate: any;
	oldDisplayToDate: any;
	customDate: any;
	@Output() backToScan = new EventEmitter();
	@Output() backToNonSubscriber = new EventEmitter();
	// @Output() sendScanData = new EventEmitter();
	@Output() sendScanData: EventEmitter<any> = new EventEmitter();
	// scan settings
	scheduleTab;
	isChangeSchedule = false;
	selectedFrequency: any;
	selectedDay: any;
	selectedNumber: any;
	yearsList: any[] = []; // removed last year, "this.getYearObj(-1)" to fix van-17574

	isDaySelectionEnable = true;
	scanToggleValue = true;
	frequencyValue = 1;
	dayValue = 0;
	dateValue = 0;
	scanScheduleDate: any;
	issueCount = 0;
	mostRecentScan: any;
	IsSmartPerformanceFirstRun: any;
	IsScheduleScanEnabled: any;
	public scanData: any = {};
	systemSerialNumber: any;
	displayMonths = 1;
	navigation = 'arrows';
	public minDate: any;
	public maxDate: any;
	spEnum: any = enumSmartPerformance;
	isOldVersion = false;
	// tuneindividualIssueCount: any = 0;
	// boostindividualIssueCount: any = 0;
	// secureindividualIssueCount: any = 0;
	public data = [{ name: 'D', value: 4 }];
	public subscriptionDetails = [
		{
			UUID: uuid(),
			StartDate: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
			EndDate: formatDate(this.spEnum.SCHEDULESCANENDDATE, 'yyyy/MM/dd', 'en')
		}
	];
	SPHeaderImageType = SPHeaderImageType;

	showResult = {
		show: false,
		isLastFix: false,
		time: '',
		tune: 0,
		boost: 0,
		secure: 0,
		itemType: '',
	};

	ngOnInit() {
		this.leftAnimator = '0%';
		this.smartPerformanceService.isSubscribed = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.IsFreeFullFeatureEnabled
		);
		if (!this.smartPerformanceService.isSubscribed) {
			this.smartPerformanceService.getSubscriptionDataDetail(null);
		}
		const cacheMachineFamilyName = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.MachineFamilyName,
			undefined
		);
		if (cacheMachineFamilyName) {
			this.machineFamilyName = cacheMachineFamilyName;
		}
		this.smartPerformanceService.scanningStopped.subscribe(() => {
			this.backToNonSubScriberHome();
		});
		// this.leftAnimatorCalc = ((this.rating*10) - 1);
		this.currentDate = new Date();
		this.currentDateLocalFormat = this.formatLocaleDate.transform(this.currentDate);
		this.selectedDate = this.calendar.getToday();
		this.toDate = this.selectedDate;
		this.fromDate = this.selectedDate;
		this.smartPerformanceService.isSubscribed = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.IsFreeFullFeatureEnabled
		);
		this.isDaySelectionEnable = false;
		this.scanScheduleDate = this.selectedDate;
		this.isLoading = false;
		if (this.smartPerformanceService.isSubscribed || this.smartPerformanceService.isExpired) {
			// 	this.getLastScanResult();
			this.scanSummaryTime(0);
		}

		this.supportService.getMachineInfo().then(async (machineInfo) => {
			this.systemSerialNumber = machineInfo.serialnumber;
		});

		this.minDate = {
			year: this.currentDate.getFullYear() - 1,
			month: this.currentDate.getMonth() + 1,
			day: this.currentDate.getDate() + 1
		};
		this.maxDate = {
			year: this.currentDate.getFullYear(),
			month: this.currentDate.getMonth() + 1,
			day: this.currentDate.getDate()
		};
	}

	getScanHistoryWithTime() {
		// Object historyScanResults Copy to object historyScanResultsDateTime
		this.historyScanResultsDateTime = JSON.parse(JSON.stringify(this.historyScanResults));

		// Deleting unnecessary keys & manupulating date time.
		for (let i = 0; i < 5; i++) {
			// Adding new key scanrunDate with formating
			this.historyScanResultsDateTime[i].scanrunDate = this.formatLocaleDate.transform(new Date(this.historyScanResultsDateTime[i].scanruntime));

			// Adding new key scanrunTime
			this.historyScanResultsDateTime[i].scanrunTime = new Intl.DateTimeFormat('default', {
				hour12: true,
				hour: '2-digit',
				minute: '2-digit'
			}).format(new Date(this.historyScanResultsDateTime[i].scanruntime));

			// Removing sapace between time stamp and AM/PM
			this.historyScanResultsDateTime[i].scanrunTime = this.historyScanResultsDateTime[i].scanrunTime.replace(/ /g, '');
		}

		return this.historyScanResultsDateTime;

	}

	getMostecentScanDateTime(scandate) {
		try {
			const dateObj = new Date(scandate);
			// const momentObj = moment(dateObj);
			// const momentString = momentObj.format('YYYY-MM-DD');
			const spLocalDate = this.formatLocaleDate.transformWithoutYear(dateObj);
			const now =
				new Intl.DateTimeFormat(this.translate.currentLang,
					{
						hour12: true,
						hour: 'numeric',
						minute: 'numeric'
					}).format(dateObj);
			// this.mostRecentScan = (new Date(momentString).getMonth() + 1) + '/' + new Date(momentString).getDate() + ' at ' + now;
			this.mostRecentScan = spLocalDate + (this.translate.currentLang === 'en' ? ' at ' : ' ') + now;
		} catch (err) {
			this.logger.error('ui-smart-performance-scan-summary.getMostecentScanDateTime.then', err);
		}
	}

	// tslint:disable-next-line: use-lifecycle-interface
	ngAfterViewInit() {
		this.issueCount = this.tune + this.boost + this.secure;
		this.leftAnimator = (this.rating * 10 - 0).toString() + '%';
	}

	expandRow(value) {
		if (this.toggleValue === value) {
			this.toggleValue = null;
		} else {
			this.toggleValue = value;
		}
	}

	scanSummaryTime(value) {
		if (!this.isLoading) {
			this.dropDownToggle = true;
			this.isDropDownOpen = false;
			this.tabIndex = value;
			this.logger.info('scanSummaryTime.tabIndex', this.tabIndex);
			if (value === 0) {
				// this.yearsList = [];
				const d = new Date();
				this.currentYear = d.getFullYear();
				this.lastYear = d.getFullYear() - 1;
				const month = d.getMonth();
				const day = d.getDate();
				const prevYear = new Date(this.lastYear, month, day);
				const yearObj = this.getYearObj(prevYear, d);
				if (yearObj) {
					// this.yearsList.push(yearObj);
					this.annualYear = yearObj.displayName;
					this.getHistory(
						yearObj.startDate,
						yearObj.endDate,
						true
					);
				}
			}
			/* Quarterly option is hidden for current 3.3 release */
			// if (value === 1) {
			// 	this.quarterlyMonth = this.quarterlyMenu[0];
			// 	this.getHistory(
			// 		this.quarterlyMonth.startDate,
			// 		this.quarterlyMonth.endDate
			// 	);
			// }
			if (value === 1) {
				this.fromDate = this.calendar.getToday();
				this.toDate = this.calendar.getToday();

				this.isFromDate = true;
				const fromDateFormat =
					this.fromDate.month +
					'/' +
					this.fromDate.day +
					'/' +
					this.fromDate.year;
				const toDateFormat =
					this.toDate.month +
					'/' +
					this.toDate.day +
					'/' +
					this.toDate.year;
				this.displayFromDate = this.formatLocaleDate.transform(fromDateFormat);
				this.displayToDate = this.formatLocaleDate.transform(toDateFormat);
				this.selectedfromDate = this.fromDate;
				this.selectedTodate = this.toDate;
				this.customDate = this.displayFromDate + ' - ' + this.displayToDate;
				this.getHistory(
					moment
						.utc(this.fromDate)
						.subtract(1, 'months')
						.startOf('day')
						.format('YYYY-MM-DD HH:mm:ss'),
					moment
						.utc(this.toDate)
						.subtract(1, 'months')
						.endOf('day')
						.format('YYYY-MM-DD HH:mm:ss')
				);
			}
		}
	}

	anualScanSummary(year) {
		this.tabIndex = 0;
		this.isDropDownOpen = false;
		this.annualYear = year.displayName;
		this.getHistory(year.startDate, year.endDate);
	}

	quarterlyScanSummary(value) {
		this.isDropDownOpen = false;
		this.quarterlyMonth = value;
		this.getHistory(value.startDate, value.endDate);
	}

	openDropDown() {
		this.isDropDownOpen = !this.isDropDownOpen;
		if (!this.isDropDownOpen) {
			if (this.oldDisplayFromDate && this.oldDisplayToDate) {
				this.displayFromDate = this.oldDisplayFromDate;
				this.displayToDate = this.oldDisplayToDate;
			}
		}
	}

	selectFromDate() {
		this.isFromDate = true;
		this.selectedDate = this.selectedfromDate;
	}
	selectToDate() {
		this.isFromDate = false;
		this.selectedDate = this.selectedTodate;
		// this.selectedTodate=this.toDate.month+'/'+this.toDate.day+'/'+this.toDate.year;
	}
	onDateSelected() {
		this.logger.info('onDateSelected.SelectedDate', this.selectedDate);
		if (this.isFromDate) {
			const fromDateFormat =
				this.selectedfromDate.month +
				'/' +
				this.selectedfromDate.day +
				'/' +
				this.selectedfromDate.year;
			this.displayFromDate = this.formatLocaleDate.transform(fromDateFormat);
		} else {
			const fromDateFormat =
				this.selectedTodate.month +
				'/' +
				this.selectedTodate.day +
				'/' +
				this.selectedTodate.year;
			this.displayToDate = this.formatLocaleDate.transform(fromDateFormat);
			this.logger.info('onDateSelected.else to date', this.displayToDate);
		}
	}
	customDateScanSummary() {
		this.isDropDownOpen = false;
		this.fromDate = new Date();
		this.fromDate.setDate(this.selectedfromDate.day);
		this.fromDate.setMonth(this.selectedfromDate.month - 1);
		this.fromDate.setFullYear(this.selectedfromDate.year);
		this.toDate = new Date();
		this.toDate.setDate(this.selectedTodate.day);
		this.toDate.setMonth(this.selectedTodate.month - 1);
		this.toDate.setFullYear(this.selectedTodate.year);
		this.customDate = this.displayFromDate + ' - ' + this.displayToDate;
		this.getHistory(
			moment(this.fromDate)
				.startOf('day')
				.format('YYYY-MM-DD HH:mm:ss'),
			moment(this.toDate)
				.endOf('day')
				.format('YYYY-MM-DD HH:mm:ss')
		);
		setTimeout(() => {
			this.menuTab.nativeElement.focus();
		}, 10);
	}

	resetCustomDateScanSummary() {
		if (this.displayFromDate !== null || this.displayToDate !== null) {
			this.oldDisplayFromDate = this.displayFromDate;
			this.oldDisplayToDate = this.displayToDate;
		}
		this.displayFromDate = null;
		this.displayToDate = null;
		this.selectedfromDate = this.minDate;
		this.selectedTodate = this.maxDate;
	}

	openSubscribeModal() {
		this.smartPerformanceDialogService.openSubscribeModal();
	}
	ScanNowSummary() {
		if (!this.isLoading && this.isOnline) {
			this.backToScan.emit();
		}
	}
	BackToSummary() {
		if (this.inputIsScanningCompleted) {
			this.inputIsScanningCompleted = false;
		}
	}
	// scan settings
	changeScanSchedule() {
		if (this.scanToggleValue) {
			this.isChangeSchedule = true;
		}
	}
	openScanScheduleDropDown(value) {
		if (value === this.scheduleTab) {
			this.scheduleTab = '';
		} else {
			this.scheduleTab = value;
		}
	}
	saveChangedScanSchedule() {
		this.scheduleTab = '';
		this.isChangeSchedule = false;
	}
	cancelChangedScanSchedule() {
		this.scheduleTab = '';
		this.isChangeSchedule = false;
	}
	setEnableScanStatus(event) {
		this.logger.info('setEnableScanStatus', event.switchValue);
		this.scanToggleValue = event.switchValue;
	}

	changeScanScheduleDate() {
		this.scheduleTab = '';
	}

	getQuartesDates(start, end) {
		return {
			startDate: moment()
				.month(start)
				.startOf('month')
				.format('YYYY-MM-DD HH:mm:ss'),
			endDate: moment()
				.month(end)
				.endOf('month')
				.format('YYYY-MM-DD HH:mm:ss')
		};
	}
	getYearObj(prevDate, currentDate) {

		// const year = moment().add(yearCount, 'year');
		// return {
		// 	displayName: year.format('YYYY'),
		// 	startDate: year.startOf('year').format('YYYY-MM-DD HH:mm:ss'),
		// 	endDate: year.endOf('year').format('YYYY-MM-DD HH:mm:ss')
		// };
		return {
			displayName: moment(prevDate).format('YYYY') + '-' + moment(currentDate).format('YYYY'),
			startDate: moment(prevDate).format('YYYY-MM-DD HH:mm:ss'),
			endDate: moment(currentDate).format('YYYY-MM-DD HH:mm:ss')
		};
	}

	// Last scan result method.
	async getLastScanResult(isInit?: boolean) {
		try {
			const lastScanResultRequest = {
				scanType: this.smartPerformanceService.isSubscribed ? 'ScanAndFix' : 'Scan'
			};
			const response = await this.smartPerformanceService.getLastScanResult(lastScanResultRequest);
			this.logger.info('ui-smart-performance-scan-summary.getLastScanResult', response);
			const scanRunTime = response.scanruntime;
			const now = moment().format('YYYY-MM-DD HH:mm:ss');
			const fiveMinutesFromRecentScan = moment(scanRunTime).add(enumSmartPerformance.SUMMARYWAITINGTIME, 'm').format('YYYY-MM-DD HH:mm:ss');

			if (now < fiveMinutesFromRecentScan) {
				if (response) {
					this.isLoading = false;
					// this.historyRes = {
					// 	tuneCount: response.Tune,
					// 	boostCount: response.Boost,
					// 	secure: response.Secure
					// }
					this.rating = response.rating;
					this.issueCount = response.Tune + response.Boost + response.Secure;
					this.tune = response.Tune;
					this.boost = response.Boost;
					this.secure = response.Secure;
					this.leftAnimator = (response.rating * 10 - 0).toString() + '%';
					this.smartPerformanceService.isScanning = false;
					if (isInit && this.smartPerformanceService.isEnterSmartPerformance) {
						this.smartPerformanceService.isEnterSmartPerformance = false;
					} else {
						this.inputIsScanningCompleted = true;
					}
				}
			}

		} catch (error) {
			this.logger.error('Smart-Performance, LastScanResult error:', error);
		}
	}

	async getHistory(startDate, endDate, isInit = false) {
		this.isLoading = true;
		const payload = {
			filterType: 'C',
			startDate,
			endDate
		};
		try {
			const res: any = await this.smartPerformanceService.getHistory(payload);
			this.logger.info('ui-smart-performance-scan-summary.getHistory', res);

			if (res) {

				this.isLoading = false;
				this.historyRes = {
					tuneCount: res.Tunecount,
					boostCount: res.Boostcount,
					secure: res.Secure,
					tuneSize: res.Tunesize,
					boostSize: res.Boostsize
				};

				this.historyScanResults = res.lastscanresults || [];
				this.getMostecentScanDateTime(this.historyScanResults[0].scanruntime);
				this.getScanHistoryWithTime();
				this.getLastScanResult(isInit);

			} else {
				this.historyScanResults = [];
				this.historyRes = {};
			}
		} catch (err) {
			this.logger.error('Ui-smart-performance-scan-summary.getHistory Error', err);

		}
	}
	formatMemorySize(mbytes: number) {
		const k = 1024;
		const mb: number = mbytes ? mbytes : 0;
		if (mb && mb !== 0) {
			const sizes = ['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			const i = Math.floor(Math.log(mb) / Math.log(k));
			this.sizeExtension = sizes[i];
			return parseFloat((mb / Math.pow(k, i)).toFixed(1));
		} else {
			this.sizeExtension = '';
			return 0 + ' ' + 'MB';
		}
	}

	backToNonSubScriberHome() {
		this.backToNonSubscriber.emit();
	}

	toggleTooltip(tooltip: any) {
		if (tooltip.isOpen()) {
			tooltip.close();
			return;
		}
		if (!tooltip.isOpen()) {
			tooltip.open();
			return;
		}
	}

	onKeyPress($event) {
		if ($event.keyCode === 13) {
			$event.target.click();
		}
	}

	seeScanResultDetails(scanrunDate: any, scanrunTime: any, tune: number, boost: number, secure: number, index: number, itemType: string): void {
		this.showResult = {
			show: true,
			isLastFix: index === 0,
			time: `${scanrunDate} - ${scanrunTime.toString().toUpperCase()}`,
			tune,
			boost,
			secure,
			itemType,
		};
		setTimeout(() => { document.getElementById('smart-performance-check-previous-results').focus(); }, 0);
	}

	checkPreviousResults() {
		this.showResult.show = false;
		setTimeout(() => { document.getElementById('smart-performance-scan-summary-scan-result-1').focus(); }, 0);
	}
}
