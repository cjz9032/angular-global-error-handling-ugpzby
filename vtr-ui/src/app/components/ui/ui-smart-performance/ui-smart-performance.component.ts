import { Component, OnInit, Input } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceSubscribeComponent } from '../../modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';

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
	constructor(
		private translate: TranslateService,private modalService: NgbModal
	) {
		this.translateStrings();
	}

  ngOnInit() {
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
}
