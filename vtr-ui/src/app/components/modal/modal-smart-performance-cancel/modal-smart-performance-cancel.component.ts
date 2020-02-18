import { Component, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'vtr-modal-smart-performance-cancel',
  templateUrl: './modal-smart-performance-cancel.component.html',
  styleUrls: ['./modal-smart-performance-cancel.component.scss']
})
export class ModalSmartPerformanceCancelComponent implements OnInit {
  //@Output() stopScanning = new EventEmitter();
  constructor(public activeModal: NgbActiveModal, 
    public smartPerformanceService: SmartPerformanceService, 
    private router: Router) { }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close('close');
  }
  @HostListener('window: focus')
  onFocus(): void {
  const modal = document.querySelector('.cancel-modal') as HTMLElement;
		modal.focus();
  }
  cancelScan()
  {
    if (this.smartPerformanceService.isShellAvailable) {
      this.smartPerformanceService
        .cancelScan()
        .then((cancelScanFromService: any) => {
        if(cancelScanFromService){
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['support/smart-performance']));
        }
        else{
          //this.isScanning = false;
        }
      })
        .catch(error => {
         
        });
    }
    else {}  
    this.activeModal.close('close');
  }
}
