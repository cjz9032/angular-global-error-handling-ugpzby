import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

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

  private failedRbsDevices: Array<string>;

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService, 
    private route: ActivatedRoute,
    private router: Router) { 
      this.failedRbsDevices = [];
  }

  ngOnInit() {
    this.createListFailedRbsDevices();
  }

  closeModal() {
		this.activeModal.close('close');
  }
  
  // Checks the any storage device from failedModules has support for RBS (according to rbsDevices list)
  private createListFailedRbsDevices() {
    // First, getting a list of Ids of storage devices with failure
    let failedStorageIds = this.failedModules.find(m => m.moduleId == 'storage')
      .devices.reduce(
        (result, device) => {
          result.push(device.deviceId); 
          return result;
        }, []);
    
    // Second, getting a list of Ids of storage devices that support RBS
    let rbsDeviceIds = this.rbsDevices.groupList.reduce( 
      (result, device) => { 
        result.push(device.id); 
        return result; 
      }, []);

    // Finally, getting the list of Ids contained in both lists
    // If any value is returned, it means that a storage device that supports RBS failed, meaning that 
    // a RBS test will be suggested to the user
    this.failedRbsDevices = failedStorageIds.filter(storageId => rbsDeviceIds.includes(storageId))
  }

  hasFailedRbsDevices(){
    return this.failedRbsDevices.length > 0;
  }

  // Goes to RBS page, passing defective device list to be selected when RBS page loads
  goToRBSPage() {
    this.router.navigate(['recover-bad-sectors'], {
      relativeTo: this.route,
      queryParams: {
        failedDevices: this.failedRbsDevices
      },
      queryParamsHandling: 'merge',
    });
    this.closeModal();
  }
}
