import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAutocloseComponent } from '../../modal/modal-autoclose/modal-autoclose.component';
import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';

@Component({
  selector: 'vtr-widget-autoclose',
  templateUrl: './widget-autoclose.component.html',
  styleUrls: ['./widget-autoclose.component.scss']
})
export class WidgetAutocloseComponent implements OnInit {
  @Input() introTitle: string;
  public title: string;
  gamingProperties: GamingAllCapabilities = new GamingAllCapabilities();
  AutoCloseStatusObj: AutoCloseStatus = new AutoCloseStatus();
  constructor(private modalService: NgbModal, private gamingCapabilityService: GamingAllCapabilitiesService, private gamingAutoCloseService: GamingAutoCloseService) { }

  ngOnInit() {
    this.title = this.introTitle;

    this.gamingProperties.optimizationFeature = this.gamingCapabilityService.getCapabilityFromCache(
      LocalStorageKey.optimizationFeature
    );

    if (this.gamingAutoCloseService.isShellAvailable) {
      this.gamingAutoCloseService
        .getAutoCloseStatus()
        .then((status) => {
          console.log('getAuto-==========================>jkffkj', status);
          this.gamingAutoCloseService.setAutoCloseStatus(status);
        })
        .catch((err) => {
          console.log(`ERROR in appComponent getCapabilities()`, err);
        });
    }
  }

  openModal(event: Event): void {
    this.modalService.open(ModalAutocloseComponent, {
      centered: true,
      windowClass: 'autoClose-Modal'
    });
  }
}
