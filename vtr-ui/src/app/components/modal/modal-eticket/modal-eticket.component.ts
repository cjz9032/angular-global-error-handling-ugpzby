import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'vtr-modal-eticket',
  templateUrl: './modal-eticket.component.html',
  styleUrls: ['./modal-eticket.component.scss']
})
export class ModalEticketComponent implements OnInit {
  @Input() title = this.translate.instant('hardwareScan.eTicket.header');
  @Input() problemDetectedMessage = this.translate.instant('hardwareScan.eTicket.problemDetected');
  @Input() supportRequestQuestionMessage = this.translate.instant('hardwareScan.eTicket.ticketRequestQuestion');
  @Input() recoverBadSectorsButtonText = "Recover Bad Sectors"; //this.translate.instant('hardwareScan.eTicket.RecoverBadSectorsButton')
  @Input() failedModules;
  @Input() rbsDevices;
  @Input() supportUrl;
  supportButtonText = "Open Ticket"; //this.translate.instant('hardwareScan.eTicket.supportButtonText')

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService) { 
  }

  ngOnInit() {
 
  }

  closeModal() {
		this.activeModal.close('close');
  }
  
  // Checks the any storage device from failedModules has support for RBS (according to rbsDevices list)
  hasFailureOnStorageWithRBS() {
    //failedModules.module.filter(module => module.moduleId === "storage")
    return true;
  }

  // Goes to RBS page, passing defective device list to be selected when RBS page loads
  goToRBSPage() {
    
  }
}
