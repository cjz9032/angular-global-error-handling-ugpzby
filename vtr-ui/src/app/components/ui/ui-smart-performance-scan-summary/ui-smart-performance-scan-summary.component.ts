import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { NgbModal,NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
@Component({
  selector: 'vtr-ui-smart-performance-scan-summary',
  templateUrl: './ui-smart-performance-scan-summary.component.html',
  styleUrls: ['./ui-smart-performance-scan-summary.component.scss']
})
export class UiSmartPerformanceScanSummaryComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private commonService: CommonService,
    private calendar: NgbCalendar,
    private logger: LoggerService) { }

  public today = new Date();
  public items: any = [];
   isSubscribed:any;
   title = 'smartPerformance.title';
 public menuItems: any = [{ itemName: 'Annual' }, { itemName: 'Quarterly' }, { itemName: 'Custom' }]
leftAnimator:any;
@Input() isScanning = false;
@Input() isScanningCompleted = false;
@Input() tune = 0;
@Input() boost = 0;
@Input() secure = 0;
@Input() rating = 0;
 public tabIndex: number;
  public toggleValue: number;
  public currentYear: any;
  public lastYear: any;
  public quarterlyMenu: any = ['Jan-Mar', 'Apr-Jun', 'Jul-Sept', 'Oct-Dec'];
  menuStatus: boolean = true;
  selectedResult: any;
  annualYear: any;
  quarterlyMonth: any;
  isDropDownOpen: boolean;
  dropDownToggle: boolean;
  currentDate: any;
  fromDate: any;
  toDate:any;
  selectedDate:any;
  isFromDate:boolean;
  selectedfromDate:any;
  selectedTodate:any;
  displayFromDate:any;
  displayToDate:any;
  customDate:any;
  @Output() backToScan = new EventEmitter();
  
  //scan settings
  scheduleTab;
	isChangeSchedule = false;
	selectedFrequency: any;
	selectedDay: any;
	scanFrequency: any = ['Every day', 'Once a week', 'Every other week', 'Once a month'];
	days: any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	hours: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	mins: any = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
	amPm: any = ['AM', 'PM'];
  isDaySelectionEnable = true;
  scanToggleValue:boolean=true;
	frequencyValue: number = 1;
	dayValue: number = 0;
	scanTime: any = { 'hour': this.hours[11],'hourId': 11,'min': this.mins[0],'minId': 0,'amPm': this.amPm[0],'amPmId': 0};
  copyScanTime: any = {'hour': this.hours[11], 'hourId': 11, 'min': this.mins[0], 'minId': 0, 'amPm': this.amPm[0], 'amPmId': 0 };
  scanScheduleDate:any;
  issueCount: any = 0;
  // tuneindividualIssueCount: any = 0;
  // boostindividualIssueCount: any = 0;
  // secureindividualIssueCount: any = 0;
  ngOnInit() {
    this.issueCount = this.tune + this.boost + this.secure;
    //this.leftAnimatorCalc = ((this.rating*10) - 1);
this.currentDate = new Date();
    this.selectedDate=this.calendar.getToday();
    this.toDate = this.selectedDate;
    this.fromDate = this.selectedDate;
	 	this.items = [ { itemValue : '16 fixes', itemExpandValue : {tune:'10 GB',boost:'12',secure:'14'}, itemstatus : true, itemDate : this.today},
	{ itemValue : '0 fixes', itemExpandValue : {tune:'10 GB',boost:'12',secure:'14'}, itemstatus : false, itemDate : this.today},
	{ itemValue : '8 fixes', itemExpandValue : {tune:'10 GB',boost:'12',secure:'14'}, itemstatus : true, itemDate : this.today} ];
   this.isSubscribed=this.commonService.getLocalStorageValue(LocalStorageKey.IsSubscribed);
   this.selectedFrequency = this.scanFrequency[1];
		this.selectedDay = this.days[0];
    this.isDaySelectionEnable = false;
    this.scanScheduleDate=this.selectedDate;
    this.leftAnimator="0%";
  }
  ngAfterViewInit()
  {

    this.leftAnimator = ((this.rating*10) - 1).toString() + "%"; 
   
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
    if (value === 0 && !this.annualYear) {
      var d = new Date();
      this.currentYear = (d.getFullYear());
      this.lastYear = (d.getFullYear() - 1);
      this.annualYear = this.currentYear;
    }
    if (value === 1 && !this.quarterlyMonth) {
      this.quarterlyMonth = this.quarterlyMenu[0];
    }
    if (value === 2) {
      this.isFromDate=true;
      this.displayFromDate=this.fromDate.month+'/'+this.fromDate.day+'/'+this.fromDate.year;
      this.displayToDate=this.toDate.month+'/'+this.toDate.day+'/'+this.toDate.year;
      this.selectedfromDate=this.fromDate;
      this.selectedTodate=this.toDate;
      this.customDate=this.displayFromDate+'-'+this.displayToDate;
    }
  }
  anualScanSummary(year) {
    this.isDropDownOpen = false;
    this.annualYear = year;
  }
  quarterlyScanSummary(value) {
    this.isDropDownOpen = false;
    this.quarterlyMonth = this.quarterlyMenu[value];
  }
  openDropDown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }
  selectFromDate() {
    this.isFromDate=true;
  this.selectedDate=this.selectedfromDate;
  }
  selectToDate() {
    this.isFromDate=false;
    this.selectedDate=this.selectedTodate;
    // this.selectedTodate=this.toDate.month+'/'+this.toDate.day+'/'+this.toDate.year;
  }
  onDateSelected(){
    this.logger.info('onDateSelected.SelectedDate', this.selectedDate);
    if(this.isFromDate){
      this.displayFromDate=this.selectedfromDate.month+'/'+this.selectedfromDate.day+'/'+this.selectedfromDate.year;
    }
    else{
      this.displayToDate=this.selectedTodate.month+'/'+this.selectedTodate.day+'/'+this.selectedTodate.year;
      this.logger.info('onDateSelected.else to date', this.displayToDate);
    }
  }
  customDateScanSummary(){
    this.isDropDownOpen=false;
    this.fromDate=this.selectedfromDate;
    this.toDate=this.selectedTodate;
    this.customDate=this.displayFromDate+' - '+this.displayToDate;
  }
openSubscribeModal() {
    this.modalService.open(ModalSmartPerformanceSubscribeComponent, {
        backdrop: 'static',
        size: 'lg',
        centered: true,
        windowClass: 'subscribe-modal',

    });
}
ScanNowSummary(){
	this.backToScan.emit();
}


//scan settings
changeScanSchedule() {
  if (this.scanToggleValue) {
    this.isChangeSchedule = true;
  }

}
openScanScheduleDropDown(value) {
  if (value === this.scheduleTab) {
    this.scheduleTab = '';
  }
  else {
    this.scheduleTab = value;
  }

}
changeScanFrequency(value) {
  this.frequencyValue = value;
  this.scheduleTab = '';
  if (value === 0) {
    this.isDaySelectionEnable = false;
  } else {
    this.isDaySelectionEnable = true;
  }
  this.selectedFrequency = this.scanFrequency[value];
}
changeScanDay(value) {
  this.dayValue = value;
  this.scheduleTab = '';
  this.selectedDay = this.days[value];
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
changeScanScheduleDate(){
  this.scheduleTab = '';
}
}