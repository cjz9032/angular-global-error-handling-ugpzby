import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import moment from 'moment';

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
	isSubscribed:any;
	leftAnimator: any;
	public tune = 0;
	public boost = 0;
	public secure = 0;
	public rating = 0;
	public tabIndex: number;
	public toggleValue: number;
	public currentYear: any;
	public lastYear: any;
	historyRes: any = {};
	historyScanResults = [];
	public quarterlyMenu: any = [
		{ displayName: 'Jan-Mar', ...this.getQuartesDates(0, 2), key: 1 },
		{ displayName: 'Apr-Jun', ...this.getQuartesDates(3, 5), key: 2 },
		{ displayName: 'Jul-Sept', ...this.getQuartesDates(6, 8), key: 3 },
		{ displayName: 'Oct-Dec', ...this.getQuartesDates(9, 11), key: 4 }
	];

	constructor(
		private translate: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		public smartPerformanceService: SmartPerformanceService,
		private logger: LoggerService,
		private calendar: NgbCalendar,
	) {
		this.translateStrings();
	}
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
	scheduleTab;
	isChangeSchedule = false;
	selectedFrequency: any;
	selectedDay: any;
	selectedNumber: any;
	yearsList: any[] = [this.getYearObj(0), this.getYearObj(-1)];
	scanFrequency: any = [
		'Once a week',
		'Every other week',
		'Once a month'
	];
	days: any = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];
	dates: any = [
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'10',
		'11',
		'12',
		'13',
		'14',
		'15',
		'16',
		'17',
		'18',
		'19',
		'20',
		'21',
		'22',
		'23',
		'24',
		'25',
		'26',
		'27',
		'28'
	];
	hours: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	mins: any = [
		'00',
		'05',
		'10',
		'15',
		'20',
		'25',
		'30',
		'35',
		'40',
		'45',
		'50',
		'55'
	];
	amPm: any = ['AM', 'PM'];
	isDaySelectionEnable = true;
	scanToggleValue = true;
	frequencyValue = 1;
	dayValue = 0;
	dateValue = 0;
	scanTime: any = {
		hour: this.hours[11],
		hourId: 11,
		min: this.mins[0],
		minId: 0,
		amPm: this.amPm[0],
		amPmId: 0
	};
	copyScanTime: any = {
		hour: this.hours[11],
		hourId: 11,
		min: this.mins[0],
		minId: 0,
		amPm: this.amPm[0],
		amPmId: 0
	};
	scanScheduleDate: any;
	issueCount: any = 0;

  ngOnInit() {
	 this.isSubscribed=this.commonService.getLocalStorageValue(LocalStorageKey.IsSubscribed);

	 this.issueCount = this.tune + this.boost + this.secure;
		// this.leftAnimatorCalc = ((this.rating*10) - 1);
		this.currentDate = new Date();
		this.selectedDate = this.calendar.getToday();
		this.toDate = this.selectedDate;
		this.fromDate = this.selectedDate;
		this.isSubscribed = this.commonService.getLocalStorageValue(
			LocalStorageKey.IsSubscribed
		);
		this.selectedFrequency = this.scanFrequency[1];
		this.selectedDay = this.days[0];
		this.selectedNumber = this.dates[0];
		this.isDaySelectionEnable = false;
		this.scanScheduleDate = this.selectedDate;
		this.leftAnimator = '0%';
		this.scanSummaryTime(0);
  }
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
	// console.log(value + 'VALUE for the tabindex');
	this.logger.info('scanSummaryTime.tabIndex', this.tabIndex);
	if (value === 0) {
		const d = new Date();
		this.currentYear = d.getFullYear();
		this.lastYear = d.getFullYear() - 1;
		this.annualYear = this.yearsList[0].displayName;
		this.getHistory(
			this.yearsList[0].startDate,
			this.yearsList[0].endDate
		);
	}
	if (value === 1) {
		this.quarterlyMonth = this.quarterlyMenu[0];
		this.getHistory(
			this.quarterlyMonth.startDate,
			this.quarterlyMonth.endDate
		);
	}
	if (value === 2) {
		this.fromDate = this.calendar.getToday();
		this.toDate = this.calendar.getToday();

		this.isFromDate = true;
		// console.log(this.fromDate);
		this.displayFromDate =
			this.fromDate.month +
			'/' +
			this.fromDate.day +
			'/' +
			this.fromDate.year;
		this.displayToDate =
			this.toDate.month +
			'/' +
			this.toDate.day +
			'/' +
			this.toDate.year;
		this.selectedfromDate = this.fromDate;
		this.selectedTodate = this.toDate;
		this.customDate = this.displayFromDate + '-' + this.displayToDate;
		// console.log('---------IN THE TABINDEX 2' + this.customDate);
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
		this.displayFromDate =
			this.selectedfromDate.month +
			'/' +
			this.selectedfromDate.day +
			'/' +
			this.selectedfromDate.year;
	} else {
		this.displayToDate =
			this.selectedTodate.month +
			'/' +
			this.selectedTodate.day +
			'/' +
			this.selectedTodate.year;
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
	// console.log(this.fromDate);
	this.getHistory(
		moment(this.fromDate)
			.startOf('day')
			.format('YYYY-MM-DD HH:mm:ss'),
		moment(this.toDate)
			.endOf('day')
			.format('YYYY-MM-DD HH:mm:ss')
	);
}
ScanNowSummary() {

	this.backToScan.emit();
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
setEnableScanStatus(event) {
	this.logger.info('setEnableScanStatus', event.switchValue);
	this.scanToggleValue = event.switchValue;
}
  saveChangeScanTime() {
	this.scheduleTab = '';
	this.scanTime.hour = this.copyScanTime.hour;
	this.scanTime.min = this.copyScanTime.min;
	this.scanTime.amPm = this.copyScanTime.amPm;
	this.scanTime.hourId = this.copyScanTime.hourId;
	this.scanTime.minId = this.copyScanTime.minId;
	this.scanTime.amPmId = this.copyScanTime.amPmId;
}
cancelChangeScanTime() {
	this.scheduleTab = '';
	this.copyScanTime.hour = this.scanTime.hour;
	this.copyScanTime.min = this.scanTime.min;
	this.copyScanTime.amPm = this.scanTime.amPm;
	this.copyScanTime.hourId = this.scanTime.hourId;
	this.copyScanTime.minId = this.scanTime.minId;
	this.copyScanTime.amPmId = this.scanTime.amPmId;
}
changeHoursTime(value) {
	this.copyScanTime.hour = this.hours[value];
	this.copyScanTime.hourId = value;
}
changeMinutesTime(value) {
	this.copyScanTime.min = this.mins[value];
	this.copyScanTime.minId = value;
}
changeAmPm(value) {
	this.copyScanTime.amPm = this.amPm[value];
	this.copyScanTime.amPmId = value;
}
changeScanFrequency(value) {
	this.frequencyValue = value;
	this.scheduleTab = '';
	this.isDaySelectionEnable = true;
	// if (value === 0) {
	// 	this.isDaySelectionEnable = false;
	// } else {
	// 	this.isDaySelectionEnable = true;
	// }
	this.selectedFrequency = this.scanFrequency[value];
}
changeScanDay(value) {
	this.dayValue = value;
	this.scheduleTab = '';
	this.selectedDay = this.days[value];
	this.selectedNumber = this.dates[value];
}
changeScanDate(value) {
	this.dateValue = value;
	this.scheduleTab = '';
	this.selectedDay = this.days[value];
	this.selectedNumber = this.dates[value];
}
changeScanScheduleDate() {
	this.scheduleTab = '';
}
  saveChangedScanSchedule() {
	this.scheduleTab = '';
	this.isChangeSchedule = false;
}
cancelChangedScanSchedule() {
	this.scheduleTab = '';
	this.isChangeSchedule = false;
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
getYearObj(yearCount) {
	const year = moment().add(yearCount, 'year');
	return {
		displayName: year.format('YYYY'),
		startDate: year.startOf('year').format('YYYY-MM-DD HH:mm:ss'),
		endDate: year.endOf('year').format('YYYY-MM-DD HH:mm:ss')
	};
}
async getHistory(startDate, endDate) {
	// console.log(startDate, endDate);
	const payload = {
		filterType: 'C',
		startDate,
		endDate
	};
	// console.log(JSON.stringify(payload));
	try {
		const res: any = await this.smartPerformanceService.getHistory(
			payload
		);
		// console.log(
		// 	'Successfully got response from Bridge',
		// 	JSON.stringify(res)
		// );
		if (res.lastscanresults) {
			this.historyRes = {
				Tune: res.Tune,
				Boost: res.Boost,
				Secure: res.Secure
			};
			// console.log(JSON.stringify(this.historyRes));
			this.historyScanResults = res.lastscanresults || [];
		} else {
			this.historyScanResults = [];
			this.historyRes = {};
		}
	} catch (err) {
		// console.log(err);
		this.historyScanResults = [];
		this.historyRes = {};
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

public changeScanStatus($event) {
	this.isScanningCompleted = true; 
	this.isScanning = false;
	this.rating = $event.rating;
	this.tune = $event.tune;
	this.boost = $event.boost;
	this.secure = $event.secure;
	this.logger.info('changeScanStatus', this.isScanningCompleted+'>>>'+this.isScanning);
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
changeScanEvent(){
	
	if (this.smartPerformanceService.isShellAvailable) {
		this.smartPerformanceService
			.getReadiness()
			.then((getReadinessFromService: any) => {
				this.logger.info('ScanNow.getReadiness.then', getReadinessFromService);
				if(getReadinessFromService){
					this.isScanning = true;
				}
				else{
					this.isScanning = false;
				}
			})
			.catch(error => {
			 
			});
	}
	//this.isScanning=true;
	this.isScanningCompleted=false;
}
ScanNow()
{
	if (this.smartPerformanceService.isShellAvailable) {
		this.smartPerformanceService
			.getReadiness()
			.then((getReadinessFromService: any) => {
				this.logger.info('ScanNow.getReadiness.then', getReadinessFromService);
				if(getReadinessFromService){
					this.isScanning = true;
				}
				else{
					this.isScanning = false;
				}
			})
			.catch(error => {
			 
			});
	}
}
cancelScan()
{
	this.isScanning=false;
	this.isScanningCompleted=false;
}
}
