import { Component, OnInit, Input } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

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
	public tune = 0;
	public boost = 0;
	public secure = 0;
	public rating = 0;

	constructor(
		private translate: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		public smartPerformanceService: SmartPerformanceService,
		private logger: LoggerService,
	) {
		this.translateStrings();
	}

  ngOnInit() {
	 this.isSubscribed=this.commonService.getLocalStorageValue(LocalStorageKey.IsSubscribed);
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
	this.isScanning=true;
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
