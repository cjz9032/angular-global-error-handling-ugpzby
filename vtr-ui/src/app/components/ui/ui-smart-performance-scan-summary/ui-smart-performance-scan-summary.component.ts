import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import moment from 'moment';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EMPTY } from 'rxjs';
import { SupportService } from 'src/app/services/support/support.service';
import { v4 as uuid } from 'uuid';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ModalSmartPerformanceFeedbackComponent } from '../../modal/modal-smart-performance-feedback/modal-smart-performance-feedback.component';
import { Router } from '@angular/router';
import { enumSmartPerformance } from 'src/app/enums/smart-performance.enum';

@Component({
	selector: 'vtr-ui-smart-performance-scan-summary',
	templateUrl: './ui-smart-performance-scan-summary.component.html',
	styleUrls: ['./ui-smart-performance-scan-summary.component.scss']
})
export class UiSmartPerformanceScanSummaryComponent implements OnInit {
	constructor(
		private modalService: NgbModal,
		private commonService: CommonService,
		private calendar: NgbCalendar,
		private logger: LoggerService,
		private supportService: SupportService,
		public smartPerformanceService: SmartPerformanceService,
		public shellServices: VantageShellService,
		private translate: TranslateService,
		private router: Router
	) { }
	public sizeExtension: string;
	public isLoading = false;
	public machineFamilyName: string;
	public today = new Date();
	public items: any = [];
	isSubscribed: any;
	title = 'smartPerformance.title';
	/* Quarterly option is hidden for current 3.3 release */
	// public menuItems: any = [
	// 	{ itemName: 'Annual', itemKey: 'ANNUAL' },
	// 	{ itemName: 'Quarterly', itemKey: 'QUARTERLY' },
	// 	{ itemName: 'Custom', itemKey: 'CUSTOM' }
	// ];
	public menuItems: any = [
		{ itemName: 'Annual', itemKey: 'ANNUAL' },
		{ itemName: 'Custom', itemKey: 'CUSTOM' }
	];
	leftAnimator: any;
	@Input() isScanning = false;
	@Input() isScanningCompleted = false;
	@Input() inputIsScanningCompleted = false;
	@Input() hasSubscribedScanCompleted = false;
	@Input() tune = 0;
	@Input() boost = 0;
	@Input() secure = 0;
	@Input() rating = 0;
	public tabIndex: number;
	public toggleValue: number;
	public currentYear: any;
	public lastYear: any;
	Data = [1,2,3]
	historyRes: any = {};
	historyScanResults = [];
	public quarterlyMenu: any = [
		{ displayName: 'Jan-Mar', ...this.getQuartesDates(0, 2), key: 1 },
		{ displayName: 'Apr-Jun', ...this.getQuartesDates(3, 5), key: 2 },
		{ displayName: 'Jul-Sept', ...this.getQuartesDates(6, 8), key: 3 },
		{ displayName: 'Oct-Dec', ...this.getQuartesDates(9, 11), key: 4 }
	];
	public scannigResultObj = {tunePc : {firstSection: [], secondSection: [], thirdSection: [], fourthSection: [], fifthSection:[]},
	internetPerformance : {firstSection: [], secondSection: [], thirdSection: [], fourthSection: [], fifthSection:[]},
	malwareSecurity : {firstSection: [], secondSection: [], thirdSection: [], fourthSection: [], fifthSection:[]},};
	menuStatus = true;
	selectedResult: any;
	annualYear: any;
	quarterlyMonth: any;
	isDropDownOpen: boolean;
	dropDownToggle: boolean;
	currentDate: any;
	fromDate: any;
	toDate: any;
	selectedDate: any;
	isFromDate: boolean;
	selectedfromDate: any;
	selectedTodate: any;
	displayFromDate: any;
	displayToDate: any;
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
	yearsList: any[] = [];// removed last year, "this.getYearObj(-1)" to fix van-17574
	 
	isDaySelectionEnable = true;
	scanToggleValue = true;
	frequencyValue = 1;
	dayValue = 0;
	dateValue = 0;
	enableNextText: boolean = true
	scanScheduleDate: any;
	issueCount: any = 0;
	nextScheduleScan: any;
	mostRecentScan: any;
	IsSmartPerformanceFirstRun: any;
	IsScheduleScanEnabled: any;
	public scanData: any = {};
	systemSerialNumber: any;
	displayMonths:number = 1;
	navigation:string = 'arrows';
	public minDate: any;
	public maxDate: any;
	spEnum:any = enumSmartPerformance;
	// tuneindividualIssueCount: any = 0;
	// boostindividualIssueCount: any = 0;
	// secureindividualIssueCount: any = 0;
	public data = [{name: 'D', value: 4}]
	public subscriptionDetails = [
		{
			UUID: uuid(),
			StartDate: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
			EndDate: formatDate(this.spEnum.SCHEDULESCANENDDATE, 'yyyy/MM/dd', 'en')
		}
	];
	ngOnInit() {
		const cacheMachineFamilyName = this.commonService.getLocalStorageValue(
			LocalStorageKey.MachineFamilyName,
			undefined
		);
		if (cacheMachineFamilyName) {
			this.machineFamilyName = cacheMachineFamilyName;
		}
		this.issueCount = this.tune + this.boost + this.secure;
		// this.leftAnimatorCalc = ((this.rating*10) - 1);
		this.currentDate = new Date();
		this.selectedDate = this.calendar.getToday();
		this.toDate = this.selectedDate;
		this.fromDate = this.selectedDate;
		this.isSubscribed = this.commonService.getLocalStorageValue(
			LocalStorageKey.IsSmartPerformanceSubscribed
		);
	 
		this.isDaySelectionEnable = false;
		this.scanScheduleDate = this.selectedDate;
		this.leftAnimator = '0%';
		if(this.isSubscribed){
			this.scanSummaryTime(0);
		}
		
		this.supportService.getMachineInfo().then(async (machineInfo) => {
			this.systemSerialNumber = machineInfo.serialnumber;
		});
		this.initContentLoad();
		
		this.minDate = {
			year: this.currentDate.getFullYear() - 1,
			month: this.currentDate.getMonth() + 1,
			day: this.currentDate.getDate() 
		};
		this.maxDate = {
			year: this.currentDate.getFullYear(),
			month: this.currentDate.getMonth() + 1,
			day: this.currentDate.getDate()
		};
	}

	getNextScanScheduleTime(scandate) {
		try {
			const dateObj = new Date(scandate);
			const momentObj = moment(dateObj);
			const momentString = momentObj.format('YYYY-MM-DD');
			const now =
				new Intl.DateTimeFormat('default',
					{
						hour12: true,
						hour: 'numeric',
						minute: 'numeric'
					}).format(dateObj);
			this.nextScheduleScan = (new Date(momentString).getMonth() + 1) + '/' + new Date(momentString).getDate() + ' at ' + now;
		} catch (err) {
			this.logger.error('ui-smart-performance-scan-summary.getNextScanScheduleTime.then', err);
		}
	}
	getMostecentScanDateTime(scandate) {
		try {
			const dateObj = new Date(scandate);
			const momentObj = moment(dateObj);
			const momentString = momentObj.format('YYYY-MM-DD');
			const now =
				new Intl.DateTimeFormat('default',
					{
						hour12: true,
						hour: 'numeric',
						minute: 'numeric'
					}).format(dateObj);
			this.mostRecentScan = (new Date(momentString).getMonth() + 1) + '/' + new Date(momentString).getDate() + ' at ' + now;
		} catch (err) {
			this.logger.error('ui-smart-performance-scan-summary.getMostecentScanDateTime.then', err);
		}
	}
	async getNextScanRunTime(scantype) {
		const payload = {
			scantype
		};
		this.logger.info('ui-smart-performance-scan-summary.getNextScanRunTime', JSON.stringify(payload));
		try {
			const res: any = await this.smartPerformanceService.getNextScanRunTime(payload);
			if(res.nextruntime) {
				this.getNextScanScheduleTime(res.nextruntime);
			}
			this.logger.info('ui-smart-performance-scan-summary.getNextScanRunTime.then', JSON.stringify(res));

		} catch (err) {
			this.logger.error('ui-smart-performance-scan-summary.getNextScanRunTime.then', err);
		}
	}
	// tslint:disable-next-line: use-lifecycle-interface
	ngAfterViewInit() {
		this.leftAnimator = (this.rating * 10 - 1).toString() + '%';
	}
	expandRow(value) {
		if (this.toggleValue === value) {
			this.toggleValue = null;
		} else {
			this.toggleValue = value;
		}
	}
	scanSummaryTime(value) {
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
					yearObj.endDate
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
			this.displayFromDate = moment
				.utc(fromDateFormat)
				.startOf('day')
				.format('YYYY/MM/DD');
			this.displayToDate = moment
				.utc(toDateFormat)
				.startOf('day')
				.format('YYYY/MM/DD');
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
			this.displayFromDate = moment
				.utc(fromDateFormat)
				.startOf('day')
				.format('YYYY/MM/DD');
		} else {
			const fromDateFormat =
				this.selectedTodate.month +
				'/' +
				this.selectedTodate.day +
				'/' +
				this.selectedTodate.year;
			this.displayToDate = moment
				.utc(fromDateFormat)
				.startOf('day')
				.format('YYYY/MM/DD');
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
	}
	openSubscribeModal() {
		// this.modalService.open(ModalSmartPerformanceSubscribeComponent, {
		// 	backdrop: 'static',
		// 	size: 'lg',
		// 	centered: true,
		// 	windowClass: 'subscribe-modal'
		// });
		this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceSubscribed, true);
		this.commonService.setLocalStorageValue(LocalStorageKey.SmartPerformanceSubscriptionDetails, this.subscriptionDetails);
		//this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['support/smart-performance']));
		this.isSubscribed = this.commonService.getLocalStorageValue(
			LocalStorageKey.IsSmartPerformanceSubscribed
		);
		if(this.inputIsScanningCompleted)
		{
			this.inputIsScanningCompleted = false;
		}
	}
	ScanNowSummary() {
		this.backToScan.emit();
	}
	BackToSummary(){
		if(this.inputIsScanningCompleted)
		{
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
			displayName: moment(prevDate).format('YYYY')+ '-'+ moment(currentDate).format('YYYY'),
			startDate: moment(prevDate).format('YYYY-MM-DD HH:mm:ss'),
			endDate: moment(currentDate).format('YYYY-MM-DD HH:mm:ss')
		}
	}

	async getHistory(startDate, endDate) {
		this.isLoading = true;

		const payload = {
			filterType: 'C',
			startDate,
			endDate
		};
		try {
			const res: any = await this.smartPerformanceService.getHistory(
				payload
			);
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
			return 0 + ' ' + 'MB'
		}
	}
	changeNextScanDateValue(nextScheduleScanEvent) {
		// retrieved this event from ui-scan-schedule component.
		if(!nextScheduleScanEvent) {
			this.enableNextText = nextScheduleScanEvent;
			return;
		}
		this.enableNextText = nextScheduleScanEvent['nextEnable']
		this.nextScheduleScan =  nextScheduleScanEvent['nextScanDate'] + ' at ' + nextScheduleScanEvent['nextScanHour'] + ':' + nextScheduleScanEvent['nextScanMin'] + ' ' + nextScheduleScanEvent['nextScanAMPM'];

		// if (this.isSubscribed) {
		// 	this.getNextScanRunTime('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix');
		// }
		// else {
		// 	this.getNextScanRunTime('Lenovo.Vantage.SmartPerformance.ScheduleScan');
		// }

	 }

	public initContentLoad() {
		this.scannigResultObj.tunePc = {
			firstSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area2')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.accumulatedjunkscannedareas.area6')
			}],
			secondSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area2')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.usabilityissuesscannedareas.area6')
			}
			],
			thirdSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area2')
			}, {
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.windowssettingsscannedareas.area6')
			}],
			fourthSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area2')
			}, {
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.systemerrorsscannedareas.area6')
			}],
			fifthSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area2')
			}, {
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.tunepc.registryerrorsscannedareas.area6')
			}],
		}
		this.scannigResultObj.internetPerformance = {
			firstSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area2')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.networksettingsscannedareas.area6')
			}],
			secondSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area2')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersettingsscannedareas.area6')
			}
			],
			thirdSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area2')
			}, {
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.browsersecurityscannedareas.area6')
			}],
			fourthSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area2')
			}, {
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.wifiperformancescannedareas.area6')
			}],
			fifthSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area2')
			}, {
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.internetperformance.ejunkscannedareas.area6')
			}],
		}
		this.scannigResultObj.malwareSecurity = {
			firstSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area2')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.malwarescanscannedareas.area6')
			}],
			secondSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area2')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.zerodayinfectionsscannedareas.area6')
			}
			],
			thirdSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area2')
			}, {
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.securitysettingsscannedareas.area6')
			}],
			fourthSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area2')
			}, {
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.errantprogramsscannedareas.area6')
			}],
			fifthSection: [{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area1'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area2')
			}, {
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area3'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area4')
			},
			{
			firstText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area5'),
			secondText: this.translate.instant('smartPerformance.scanCompletePage.malwaresecurity.annoyingadwarescannedareas.area6')
			}],
		}
	  }

	  /**
	   * SP Feedback form
	   */
	  onclickFeedback() {
		this.modalService.open(ModalSmartPerformanceFeedbackComponent, {
			backdrop: 'static',
			size: 'lg',
			keyboard: false,
			centered: true,
			windowClass: 'smart-performance-feedback-Modal'
		});
	}
	backToNonSubScriberHome(){	
		this.backToNonSubscriber.emit();
	}

}
