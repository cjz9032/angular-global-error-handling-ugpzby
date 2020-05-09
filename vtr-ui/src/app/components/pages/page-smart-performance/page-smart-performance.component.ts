import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../../../services/guard/can-deactivate-guard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmWarning } from '../../modal/modal-confirm-warning/modal-confirm-warning.component';

@Component({
  selector: 'vtr-page-smart-performance',
  templateUrl: './page-smart-performance.component.html',
  styleUrls: ['./page-smart-performance.component.scss']
})
export class PageSmartPerformanceComponent implements OnInit, CanComponentDeactivate {
  isScanning: boolean = false;

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
    const modalRef = this.modalService.open(ModalConfirmWarning, {
      backdrop: 'static',
      centered: true
    });
    const response = await modalRef.result
    return response;
  }

}
