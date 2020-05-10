import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../../../services/guard/can-deactivate-guard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceCancelComponent } from '../../modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';

@Component({
  selector: 'vtr-page-smart-performance',
  templateUrl: './page-smart-performance.component.html',
  styleUrls: ['./page-smart-performance.component.scss']
})
export class PageSmartPerformanceComponent implements OnInit, CanComponentDeactivate {
  isScanning: boolean = false;
  showPromptMsg: boolean = true

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  toggleScanning(value: boolean) {
    this.isScanning = value
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
		if(this.isScanning) { 
      return this.openModal()    
		} else {
			return true
		}
  }

  async openModal(): Promise<boolean> {
    const modalRef = this.modalService.open(ModalSmartPerformanceCancelComponent, {
      backdrop: 'static',
      centered: true
    });
    modalRef.componentInstance.promptMsg = this.showPromptMsg
    const response = await modalRef.result
    return response;
  }

}
