import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import moment from 'moment';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { TranslateService } from '@ngx-translate/core';
import { enumScanFrequency } from 'src/app/enums/smart-performance.enum';

@Component({
	selector: 'vtr-ui-scan-schedule',
	templateUrl: './ui-scan-schedule.component.html',
	styleUrls: ['./ui-scan-schedule.component.scss']
})
export class UiScanScheduleComponent implements OnInit {

	constructor(
		private modalService: NgbModal,
		private commonService: CommonService,
		private calendar: NgbCalendar,
		private logger: LoggerService,
		public smartPerformanceService: SmartPerformanceService,
		private translate: TranslateService,
	) { }
	public machineFamilyName: string;
	public today = new Date();
	public items: any = [];
	isSubscribed: any;
	title = 'smartPerformance.title';
	public menuItems: any = [
		{ itemName: 'Annual', itemKey: 'ANNUAL' },
		{ itemName: 'Quarterly', itemKey: 'QUARTERLY' },
		{ itemName: 'Custom', itemKey: 'CUSTOM' }
	];
	leftAnimator: any;
	@Input() isScanning = false;
	@Input() isScanningCompleted = false;
	@Input() tune = 0;
	@Input() boost = 0;
	@Input() secure = 0;
	@Input() rating = 0;
	@Output() scanDatekValueChange = new EventEmitter(); 
	public tabIndex: number;
	public toggleValue: number;
	public currentYear: any;
	public lastYear: any;
	// historyRes: any = {};
	// historyScanResults = [];
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

	// scan settings
	scheduleTab;
	isChangeSchedule = false;
	selectedFrequency: any;
	selectedDay: any;
	selectedNumber: any;
	
	scanFrequency: any = [
		this.translate.instant('smartPerformance.scanSettings.scanFrequencyWeek'),
		this.translate.instant('smartPerformance.scanSettings.scanFrequencyEveryWeek'),
		this.translate.instant('smartPerformance.scanSettings.scanFrequencyMonth')
	];
	days: any = [
		this.translate.instant('smartPerformance.scanSettings.sun'),
		this.translate.instant('smartPerformance.scanSettings.mon'),
		this.translate.instant('smartPerformance.scanSettings.tue'),
		this.translate.instant('smartPerformance.scanSettings.wed'),
		this.translate.instant('smartPerformance.scanSettings.thu'),
		this.translate.instant('smartPerformance.scanSettings.fri'),
		this.translate.instant('smartPerformance.scanSettings.sat')
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
	frequencyValue = 0;
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
	IsScheduleScanEnabled: any;
	IsSmartPerformanceFirstRun: any;
	selectedFrequencyCopy: any;
	public scanData: any = {};
	scheduleScanFrequency:any;
	nextScheduleScanDate:any;
	public enumLocalScanFrequncy:any;
	
	ngOnInit() {
		this.isSubscribed = this.commonService.getLocalStorageValue(LocalStorageKey.IsSmartPerformanceSubscribed);
		this.currentDate = new Date();
		this.selectedDate = this.calendar.getToday();
		this.toDate = this.selectedDate;
		this.fromDate = this.selectedDate;
		this.selectedFrequency = this.scanFrequency[0];
		this.selectedDay = this.days[0];
		this.selectedNumber = this.dates[0];
		this.isDaySelectionEnable = false;
		this.scanScheduleDate = this.selectedDate;
		this.enumLocalScanFrequncy = enumScanFrequency;
		//this.scanSummaryTime(0);
		this.scheduleScanFrequency = this.commonService.getLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency);

		if(this.scheduleScanFrequency === undefined) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.selectedFrequency);
		} else {
			this.selectedFrequency=	this.scheduleScanFrequency;
			this.frequencyValue=this.scanFrequency.indexOf(this.selectedFrequency);		
		}

		this.IsSmartPerformanceFirstRun = this.commonService.getLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun);
		if (this.IsSmartPerformanceFirstRun === true && this.isSubscribed == true) {
			this.unregisterScheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScan');
			this.scheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix', 'onceaweek', this.days[new Date().getDay()], new Date(new Date().setHours(0,0,0,0)), []);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, false);
			this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.selectedFrequency);
		}
	
		if (this.IsSmartPerformanceFirstRun === true && this.isSubscribed == false) {
			this.scheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScan', 'onceaweek', this.days[new Date().getDay()], new Date(new Date().setHours(0,0,0,0)), []);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, false);
			this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.selectedFrequency);
		}
		this.IsScheduleScanEnabled = this.commonService.getLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled);

		if (this.IsScheduleScanEnabled) {
			this.scanToggleValue = true;
		} else {
			this.scanToggleValue = false;
			this.scanDatekValueChange.emit(false)
		}

		// fetching next schedule date and time from api.
		if (	this.scheduleScanFrequency !== undefined)	{
			if (this.isSubscribed) {
				this.getNextScanRunTime('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix');
			} else {
				this.getNextScanRunTime('Lenovo.Vantage.SmartPerformance.ScheduleScan');
			}
		}
		// if (this.scheduleScanFrequency !== undefined && this.isSubscribed) {
		// 	this.getNextScanRunTime('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix');
		// }

	}
	// tslint:disable-next-line: use-lifecycle-interface

	expandRow(value) {
		if (this.toggleValue === value) {
			this.toggleValue = null;
		} else {
			this.toggleValue = value;
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

	@HostListener('window:click', ['$event'])
	onClick(event: Event): void {
		if (this.scheduleTab === '') {
			return;
		}
		// if (event.target) {
			if (event.target['classList'][1] !== "fa-chevron-down" &&
				event.target['classList'][0] !== "freq-dropdown" &&
				event.target['classList'][0] !== "day-dropdown" &&
				event.target['classList'][0] !== "date-dropdown" &&
				event.target['classList'][0] !== "time-dropdown" &&
				event.target['classList'][1] !== "hour-block" &&
				event.target['classList'][1] !== "minutes-block" &&
				event.target['classList'][1] !== "amPm-block" &&
				event.target['classList'][0] !== "hour-text" &&
				event.target['classList'][0] !== "min-text" &&
				event.target['classList'][0] !== "amPm-text" &&
				event.target['classList'][0] !== 'status' &&
				event.target['classList'][0] !== 'ml-3') {
				this.scheduleTab = '';
			}
		// }
	}

	changeScanFrequency(value) {
		this.frequencyValue = value;
		this.scheduleTab = '';
		this.isDaySelectionEnable = true;
		// this.selectedDay = this.days[value];
		this.selectedFrequency = this.scanFrequency[value];
		this.changeScanDay(value)
	}
	changeScanDay(value) {
		this.dayValue = value;
		this.scheduleTab = '';
		this.selectedDay = this.days[value];
		//this.selectedNumber = this.dates[value];
	}
	changeScanDate(value) {
		this.dateValue = value;
		this.scheduleTab = '';
		//this.selectedDay = this.days[value];
		this.selectedNumber = this.dates[value];
	}

	cancelChangedScanSchedule() {
		this.scheduleTab = '';
		this.isChangeSchedule = false;
		this.scheduleScanFrequency = this.commonService.getLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency);
		this.changeScanFrequency(this.scanFrequency.indexOf(this.scheduleScanFrequency));
		if (this.isSubscribed) {
			this.getNextScanRunTime('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix');
			this.getNextScanScheduleTime(this.nextScheduleScanDate);
		}
		else {
			this.getNextScanRunTime('Lenovo.Vantage.SmartPerformance.ScheduleScan');
			this.getNextScanScheduleTime(this.nextScheduleScanDate);
		}
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
	changeScanScheduleDate() {
		this.scheduleTab = '';
	}
	

	saveChangedScanSchedule() {
		try	{
			let scanScheduleDate:any;
			let scanScheduleTime;
			this.scheduleTab = '';
			this.isChangeSchedule = false;
			const nextScanEvent = {
				nextEnable: true,
				nextScanDate: '',
				nextScanHour: this.scanTime['hour'],
				nextScanMin: this.scanTime['min'],
				nextScanAMPM: this.scanTime['amPm']
			}

			if (!this.isSubscribed) {
				this.unregisterScheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix');
			}

			if (this.scanTime.amPm === 'PM' && this.scanTime.hour <= 11) {
				this.scanTime.hour = this.scanTime.hour + 12;
			} else if (this.scanTime.amPm === 'PM' && this.scanTime.hour === 12 ) {
				this.scanTime.hour = 12
			} else if (this.scanTime.amPm === 'AM' && this.scanTime.hour === 12 ) {
				this.scanTime.hour = '0'+0
			}

			if(parseInt(this.scanTime.hour) < 10 && this.scanTime.hour.toString().charAt(0) !== "0") {
				this.scanTime.hour= "0"+this.scanTime.hour;
			}

			this.selectedFrequencyCopy = this.selectedFrequency;
			this.selectedFrequencyCopy = this.selectedFrequency.replace(/ /g, "").toLowerCase();

			if (this.selectedFrequencyCopy === 'onceamonth') {
				this.selectedDay=this.selectedNumber;
				var d = new Date();
				d.setDate(this.selectedNumber);
				scanScheduleTime = ""+d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() +""+ "T" + this.scanTime.hour + ":" + this.scanTime.min + ":00";
			} else {
				scanScheduleTime = this.nextDate(this.selectedDay) + "T" + this.scanTime.hour + ":" + this.scanTime.min + ":00";
			}
			this.logger.info('ui-scan-schedule.component.saveChangedScanSchedule', JSON.stringify(scanScheduleTime));

			if (this.isSubscribed) {
				if (this.selectedFrequencyCopy === 'onceamonth') {
					this.scheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix', '' + this.selectedFrequencyCopy + '', '', '' + scanScheduleTime + '', [this.selectedNumber]);
				} else {
					this.scheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix', '' + this.selectedFrequencyCopy + '', '' + this.selectedDay + '', '' + scanScheduleTime + '', []);
				}
			} else {
				if (this.selectedFrequencyCopy === 'onceamonth') {
					this.scheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScan', '' + this.selectedFrequencyCopy + '', '', '' + scanScheduleTime + '', [Number(this.selectedNumber)]);
				} else {
					this.scheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScan', '' + this.selectedFrequencyCopy + '', '' + this.selectedDay + '', '' + scanScheduleTime + '', []);
				}
			}

			this.scanTime.hour = this.copyScanTime.hour;
			this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.selectedFrequency);
			// this.scanDatekValueChange.emit();

			// sending next schedule date and time to scan summary component when saved new scan event.
			this.sendNextScheduleDate(nextScanEvent);

		} catch (err) {
			this.logger.error('ui-scan-schedule.component.saveChangedScanSchedule', err);
		}
	}

	nextDate(day) {
		var days = {
			sunday: 0, monday: 1, tuesday: 2,
			wednesday: 3, thursday: 4, friday: 5, saturday: 6
		};

		var dayIndex = days[day.toLowerCase()];
		var today = new Date();
		today.setDate(today.getDate() + (dayIndex - 1 - today.getDay() + 7) % 7 + 1);
		return today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
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
	//toggle button event schedule scan

	setEnableScanStatus(event: any) {
		const nextScanEvent = {
			nextEnable: event.switchValue,
			nextScanDate: '',
			nextScanHour: this.scanTime['hour'],
			nextScanMin: this.scanTime['min'],
			nextScanAMPM: this.scanTime['amPm']
		}

		this.logger.info('setEnableScanStatus', event.switchValue);
		this.scanToggleValue = event.switchValue;
		
		if(event.switchValue === false) {
			if (this.isSubscribed) {
				this.unregisterScheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix');
				this.sendNextScheduleDate(nextScanEvent);
			} else {
				this.unregisterScheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScan');
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled, false);
			this.commonService.removeLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency);
			

		} else {
			this.IsScheduleScanEnabled = this.commonService.getLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled);
			if(!this.IsScheduleScanEnabled) {
				if (this.isSubscribed) {
					this.scheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix', 'onceaweek', this.days[new Date().getDay()], new Date(new Date().setHours(0,0,0,0)), []);
					// this.getNextScanRunTime('Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix');
				} else {
					this.scheduleScan('Lenovo.Vantage.SmartPerformance.ScheduleScan', 'onceaweek', this.days[new Date().getDay()], new Date(new Date().setHours(0,0,0,0)), []);
					// this.getNextScanRunTime('Lenovo.Vantage.SmartPerformance.ScheduleScan');
				}
				this.commonService.setLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled, true);
				this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.scanFrequency[0]);
				// this.scanDatekValueChange.emit();

			// sending next schedule date and time to scan summary component when schedule scan is enabled.
			this.sendNextScheduleDate(nextScanEvent);
				return;
			}
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
		try {
			const res: any = await this.smartPerformanceService.setScanSchedule(payload);
		
		} catch (err) {
			this.logger.error('ui-smart-performance.scheduleScan.then', err);
		}
	}

	async getNextScanRunTime(scantype: string) {
		const payload = {scantype};
		let nextScanEvent = {}
		this.logger.info('ui-smart-performance.getNextScanRunTime', JSON.stringify(payload));
		try {
			const res: any = await this.smartPerformanceService.getNextScanRunTime(payload);

			// checking next scan run time fetched from api and when present passing th sendNextScheduleDate method.
			if(res.nextruntime) {
			const dt = moment(res.nextruntime).format('LLLL')
			this.selectedDay = dt.split(',')[0]
			this.dayValue = this.days.indexOf(this.selectedDay)
			this.scanTime.hour = dt.split(' ')[4].split(':')[0];
			this.scanTime.min = dt.split(' ')[4].split(':')[1];
			this.scanTime.amPm = dt.split(' ')[5]
			nextScanEvent = {
				nextEnable: true,
				nextScanDate: '',
				nextScanHour: this.scanTime['hour'],
				nextScanMin: this.scanTime['min'],
				nextScanAMPM: this.scanTime['amPm']
			}
			this.sendNextScheduleDate(nextScanEvent)

			}
			// if (res!== undefined) {			
			// 	this.getNextScanScheduleTime(res.nextruntime);
			// 	this.nextScheduleScanDate = res.nextruntime;
			// }
			this.logger.info('ui-smart-performance.getNextScanRunTime.then', JSON.stringify(res));

		} catch (err) {
			this.logger.error('ui-smart-performance.getNextScanRunTime.then', err);
		}
	}

	getNextScanScheduleTime(scandate) {
		try {
			if(scandate !== undefined)	{
				var dateObj = new Date(scandate);
				var momentObj = moment(dateObj);
				var momentString = momentObj.format('YYYY-MM-DD');
				const now =
				new Intl.DateTimeFormat('default',
					{
						hour12: true,
						hour: 'numeric',
						minute: 'numeric'
					}).format(dateObj);
					//| slice:0:3
					var weekDayName =  moment(momentObj).format('dddd');
					this.selectedFrequency=this.scheduleScanFrequency;
					if(this.selectedFrequency===this.enumLocalScanFrequncy.ONCEAMONTH)
					{
						this.selectedDay = moment(momentObj).format('D');
						this.dateValue= parseInt(moment(momentObj).format('D'))-1;
						this.selectedNumber=parseInt(moment(momentObj).format('D'));
					}
					else
					{
						this.selectedDay = weekDayName;
						this.dayValue=this.days.indexOf(this.selectedDay);
					}
					this.scanTime.hour=  moment(momentObj).format('h');
					this.scanTime.min= moment(momentObj).format('mm');
					this.scanTime.amPm=moment(momentObj).format('A');
					this.copyScanTime.hour = this.hours[parseInt(moment(momentObj).format('h'))-1];
					this.copyScanTime.hourId = parseInt(moment(momentObj).format('h'))-1;
					const minIndex = this.mins.indexOf(moment(momentObj).format('mm').toString());
					this.copyScanTime.min =this.mins[minIndex];
					this.copyScanTime.minId = parseInt(minIndex);
					const amPmIndex = this.amPm.indexOf(moment(momentObj).format('A').toString());
					this.copyScanTime.amPm = this.amPm[amPmIndex];
					this.copyScanTime.amPmId =  parseInt(amPmIndex);
				}

		} catch (err) {
			this.logger.error('ui-smart-performance-scan-summary.getNextScanScheduleTime.then', err);
		}
	}

	sendNextScheduleDate(nextScheduleScanEvent) {
		if(!nextScheduleScanEvent['nextEnable']) {
			this.scanDatekValueChange.emit(false);
			return
		}
		switch(this.selectedFrequency) {
			case this.scanFrequency[0] :
				if(moment().day() <= (this.dayValue)) {
					nextScheduleScanEvent['nextScanDate'] = moment().day(this.dayValue).format('L').slice(0, 5)
					// this.scanDatekValueChange.emit(nextScheduleScanEvent)
				} else {
					nextScheduleScanEvent['nextScanDate'] = moment().add(1, 'weeks').day(this.dayValue).format('L').slice(0, 5)
					// this.scanDatekValueChange.emit(nextScheduleScanEvent)
				}
				break;
			case this.scanFrequency[1] :
				if(moment().day() <= this.dayValue) {
					nextScheduleScanEvent['nextScanDate'] = moment().day(this.dayValue).format('L').slice(0, 5)
					// this.scanDatekValueChange.emit(nextScheduleScanEvent)
				} else {
					nextScheduleScanEvent['nextScanDate'] = moment().add(2, 'weeks').day(this.dayValue).format('L').slice(0, 5)
					// this.scanDatekValueChange.emit(nextScheduleScanEvent)
				}
				break;
			case this.scanFrequency[2] :
				if(this.dateValue <= moment().date()) {
					nextScheduleScanEvent['nextScanDate'] = moment().date(this.dateValue + 1).add(1, 'month').format('MM/DD')
					// this.scanDatekValueChange.emit(nextScheduleScanEvent)
				} else {
					nextScheduleScanEvent['nextScanDate'] = moment().date(this.dateValue + 1).format('MM/DD')
					// this.scanDatekValueChange.emit(nextScheduleScanEvent)
				}
				break;
		}
		this.scanDatekValueChange.emit(nextScheduleScanEvent)
	}


}
