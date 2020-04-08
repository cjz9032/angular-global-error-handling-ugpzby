import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { v4 as uuid } from 'uuid';
import { formatDate } from '@angular/common';
@Component({
  selector: 'vtr-widget-subscriptiondetails',
  templateUrl: './widget-subscriptiondetails.component.html',
  styleUrls: ['./widget-subscriptiondetails.component.scss']
})
export class WidgetSubscriptiondetailsComponent implements OnInit {
  isSubscribed:any;
	subscriptionDetails:any;
	startDate:any;
	endDate:any;
	status:any;
	strStatus:any;
	givenDate:Date;
	public today = new Date();
	myDate = new Date();
  constructor(private translate: TranslateService,private modalService: NgbModal,private commonService: CommonService) {
	}
	public localSubscriptionDetails = [
		{
			UUID: uuid(),
			StartDate: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
			EndDate: formatDate(this.myDate.setDate(new Date().getDate() + 90), 'yyyy/MM/dd', 'en')
		}
	];
  ngOnInit() {
    this.isSubscribed=this.commonService.getLocalStorageValue(LocalStorageKey.IsSubscribed);
	if(this.isSubscribed)
  	{
		this.subscriptionDetails = this.commonService.getLocalStorageValue(LocalStorageKey.SubscribtionDetails);
		this.startDate = this.subscriptionDetails[0].StartDate;
		this.endDate = this.subscriptionDetails[0].EndDate;
		this.givenDate = new Date(this.subscriptionDetails[0].EndDate);
		
		if(this.givenDate > this.today){
			this.status = 'smartPerformance.subscriptionDetails.activeStatus';
			this.strStatus = 'ACTIVE';
		}
		else {
			this.status = 'smartPerformance.subscriptionDetails.inactiveStatus';
			this.strStatus = 'INACTIVE';
		}
	}
	else
	{
		this.startDate="---";
		this.endDate="---";
		this.status='smartPerformance.subscriptionDetails.inactiveStatus';
		this.strStatus = 'INACTIVE';
	}
  }

  openSubscribeModal() {
	this.commonService.setLocalStorageValue(LocalStorageKey.IsSubscribed, true);
	this.commonService.setLocalStorageValue(LocalStorageKey.SubscribtionDetails, this.localSubscriptionDetails);
	location.reload();
    // this.modalService.open(ModalSmartPerformanceSubscribeComponent, {
    //     backdrop: 'static',
    //     size: 'lg',
    //     centered: true,
    //     windowClass: 'subscribe-modal',

	// });
	
}

}
