import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../../../services/guard/can-deactivate-guard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceCancelComponent } from '../../modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
  selector: 'vtr-page-smart-performance',
  templateUrl: './page-smart-performance.component.html',
  styleUrls: ['./page-smart-performance.component.scss']
})
export class PageSmartPerformanceComponent implements OnInit, CanComponentDeactivate {
  isScanning: boolean = false;
  showPromptMsg: boolean = true

  constructor(
    private modalService: NgbModal,
    public smartPerformanceService: SmartPerformanceService,
    private logger: LoggerService,
    public shellServices: VantageShellService,
  ) { }

  ngOnInit() {
    //Checking getReadiness true or false and updating  isSacnnig value.
    if (this.smartPerformanceService.isShellAvailable) {
      this.smartPerformanceService
        .getReadiness()
        .then((getReadinessFromService: any) => {
          this.logger.info('ScanNow.getReadiness.then', getReadinessFromService);
          if (!getReadinessFromService) {
            this.isScanning = true;
            this.toggleScanning(true);
          }
          else {
            this.isScanning = false;
            this.toggleScanning(false);
          }
        })
        .catch(error => {
          this.logger.error('page-smart-performance-component this.smartPerformanceService.getReadiness()', error);
        });
    }
  }

  toggleScanning(value: boolean) {
    if(this.isScanning) {
      this.isScanning = value
    }
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
      centered: true,
      windowClass: 'cancel-modal'
    });
    modalRef.componentInstance.promptMsg = this.showPromptMsg
    const response = await modalRef.result
    return response;
  }

}
