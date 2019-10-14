import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceCancelComponent } from '../../modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';

@Component({
  selector: 'vtr-ui-smart-performance-scanning',
  templateUrl: './ui-smart-performance-scanning.component.html',
  styleUrls: ['./ui-smart-performance-scanning.component.scss']
})
export class UiSmartPerformanceScanningComponent implements OnInit {
	@Input() showProgress = true;
	@Input() percent = 0;
	@Input() isCheckingStatus = false;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }
  openCancelScanModel() {
	  this.modalService.open(ModalSmartPerformanceCancelComponent, {
		backdrop: 'static',
		centered: true,
		windowClass: 'cancel-modal'
	});
  }
}
