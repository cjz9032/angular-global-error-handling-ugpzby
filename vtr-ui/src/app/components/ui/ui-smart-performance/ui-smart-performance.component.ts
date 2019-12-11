import { Component, OnInit, Input } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';

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
	// subscriptionDetails:any;
	// startDate:any;
	// endDate:any;
	// status:any;
	// strStatus:any;
	// givenDate:Date;
	// public today = new Date();
	

	constructor(
		private translate: TranslateService,private modalService: NgbModal,private commonService: CommonService
	) {
		this.translateStrings();
	}

  ngOnInit() {

	 this.isSubscribed=this.commonService.getLocalStorageValue(LocalStorageKey.IsSubscribed);
	// if(this.isSubscribed)
  	// {
	// 	this.subscriptionDetails = this.commonService.getLocalStorageValue(LocalStorageKey.SubscribtionDetails);
	// 	this.startDate = this.subscriptionDetails[0].StartDate;
	// 	this.endDate = this.subscriptionDetails[0].EndDate;
	// 	this.givenDate = new Date(this.subscriptionDetails[0].EndDate);
		
	// 	if(this.givenDate > this.today){
	// 		this.status = 'smartPerformance.subscriptionDetails.activeStatus';
	// 		this.strStatus = 'ACTIVE';
	// 	}
	// 	else {
	// 		this.status = 'smartPerformance.subscriptionDetails.inactiveStatus';
	// 		this.strStatus = 'INACTIVE';
	// 	}
	// }
	// else
	// {
	// 	this.startDate="---";
	// 	this.endDate="---";
	// 	this.status='smartPerformance.subscriptionDetails.inactiveStatus';
	// 	this.strStatus = 'INACTIVE';
	// }
  }

  private translateStrings() {
	this.translate.stream(this.title).subscribe((res) => {
		this.title = res;
	});
	this.translate.stream(this.back).subscribe((res) => {
		this.back = res;
	});

}

public changeScanStatus() {
	console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
	this.isScanningCompleted = true; 
	this.isScanning = false;
	console.log(this.isScanningCompleted+'>>>'+this.isScanning);
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
	console.log("emitted");
this.isScanning=true;
this.isScanningCompleted=false;
}
}
