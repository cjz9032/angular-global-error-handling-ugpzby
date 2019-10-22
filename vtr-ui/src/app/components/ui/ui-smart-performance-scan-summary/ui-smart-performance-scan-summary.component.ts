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
  // tslint:disable-next-line:max-line-length
@Input() isScanning = false;
@Input() isScanningCompleted = false;
  toggleValue: number;
  ngOnInit() {
	this.items = [ { itemValue : '16 fixes', itemExpandValue : 'lorem ipsum', itemstatus : true, itemDate : this.today},
	{ itemValue : '0 fixes', itemExpandValue : 'lorem ipsum', itemstatus : false, itemDate : this.today},
	{ itemValue : '8 fixes', itemExpandValue : 'lorem ipsum', itemstatus : true, itemDate : this.today} ];
	this.isSubscribed=this.commonService.getLocalStorageValue(LocalStorageKey.IsSubscribed);
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
