import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { NgbModal,NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
@Component({
  selector: 'vtr-ui-smart-performance-scan-summary',
  templateUrl: './ui-smart-performance-scan-summary.component.html',
  styleUrls: ['./ui-smart-performance-scan-summary.component.scss']
})
export class UiSmartPerformanceScanSummaryComponent implements OnInit {

  constructor(private modalService: NgbModal,private commonService: CommonService,private calendar: NgbCalendar) { }
  public today = new Date();
  public items: any = [];
  isSubscribed:any;
 public menuItems: any = [{ itemName: 'Annual' }, { itemName: 'Quarterly' }, { itemName: 'Custom' }]
  subscriptionDetails:any;
  startDate:any;
  endDate:any;
  status:any;
  givenDate:Date


  // tslint:disable-next-line:max-line-length
@Input() isScanning = false;
@Input() isScanningCompleted = false;
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

  ngOnInit() {
this.currentDate = new Date();
    this.selectedDate=this.calendar.getToday();
    this.toDate = this.selectedDate;
    this.fromDate = this.selectedDate;
	 	this.items = [ { itemValue : '16 fixes', itemExpandValue : {tune:'10 GB',boost:'12',secure:'14'}, itemstatus : true, itemDate : this.today},
	{ itemValue : '0 fixes', itemExpandValue : {tune:'10 GB',boost:'12',secure:'14'}, itemstatus : false, itemDate : this.today},
	{ itemValue : '8 fixes', itemExpandValue : {tune:'10 GB',boost:'12',secure:'14'}, itemstatus : true, itemDate : this.today} ];
  this.isSubscribed=this.commonService.getLocalStorageValue(LocalStorageKey.IsSubscribed);
  if(this.isSubscribed)
  {
    this.subscriptionDetails = this.commonService.getLocalStorageValue(LocalStorageKey.SubscribtionDetails);
    this.startDate = this.subscriptionDetails[0].StartDate;
    this.endDate = this.subscriptionDetails[0].EndDate;
    this.givenDate = new Date(this.subscriptionDetails[0].EndDate);

    if(this.givenDate > this.today)
      this.status = "ACTIVE";
    else
      this.status = "INACTIVE";
  }
  else
  {
	this.startDate="---";
	this.endDate="---";
	this.status="INACTIVE";
  }

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
    console.log(this.tabIndex);
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
    console.log("to date");
    this.isFromDate=false;
    this.selectedDate=this.selectedTodate;
    // this.selectedTodate=this.toDate.month+'/'+this.toDate.day+'/'+this.toDate.year;
  }
  onDateSelected(){
    console.log('date');
    console.log(this.selectedDate);
    if(this.isFromDate){
      this.displayFromDate=this.selectedfromDate.month+'/'+this.selectedfromDate.day+'/'+this.selectedfromDate.year;
    }
    else{
      console.log("else to date");
      this.displayToDate=this.selectedTodate.month+'/'+this.selectedTodate.day+'/'+this.selectedTodate.year;
      console.log(this.displayToDate);
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
	console.log("summary");
	this.backToScan.emit();
}
}
