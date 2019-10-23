import { Component, OnInit, Input } from '@angular/core';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
@Component({
  selector: 'vtr-ui-smart-performance-scan-summary',
  templateUrl: './ui-smart-performance-scan-summary.component.html',
  styleUrls: ['./ui-smart-performance-scan-summary.component.scss']
})
export class UiSmartPerformanceScanSummaryComponent implements OnInit {

  constructor(private modalService: NgbModal,private commonService: CommonService) { }
  public today = new Date();
  public items: any = [];
  isSubscribed:any;
  subscriptionDetails:any;
  startDate:any;
  endDate:any;
  status:any;
  givenDate:Date
  

  // tslint:disable-next-line:max-line-length
@Input() isScanning = false;
@Input() isScanningCompleted = false;
  toggleValue: number;
  ngOnInit() {
	this.items = [ { itemValue : '16 fixes', itemExpandValue : 'lorem ipsum', itemstatus : true, itemDate : this.today},
	{ itemValue : '0 fixes', itemExpandValue : 'lorem ipsum', itemstatus : false, itemDate : this.today},
	{ itemValue : '8 fixes', itemExpandValue : 'lorem ipsum', itemstatus : true, itemDate : this.today} ];
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
  
  }
  expandRow(value) {
	if (this.toggleValue === value) {
		this.toggleValue = null;
	} else {
	  this.toggleValue = value;
	}

}
openSubscribeModal() {
    this.modalService.open(ModalSmartPerformanceSubscribeComponent, {
        backdrop: 'static',
        size: 'lg',
        centered: true,
        windowClass: 'subscribe-modal',

    });
}
}
