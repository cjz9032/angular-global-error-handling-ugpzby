import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { ModalTurnOnComponent } from '../../modal/modal-autoclose/modal-turn-on/modal-turn-on.component';
import { ModalAddAppsComponent } from '../../modal/modal-autoclose/modal-add-apps/modal-add-apps.component';

@Component({
  selector: 'vtr-widget-autoclose',
  templateUrl: './widget-autoclose.component.html',
  styleUrls: ['./widget-autoclose.component.scss']
})
export class WidgetAutocloseComponent implements OnInit {
  @Input() introTitle: string;
  modalReference: any;
  public title: string;
  public autoCloseAppList: any;
  setAutoClose: any;
  gamingProperties: GamingAllCapabilities = new GamingAllCapabilities();
  AutoCloseStatusObj: AutoCloseStatus = new AutoCloseStatus();
  constructor(private modalService: NgbModal, private gamingCapabilityService: GamingAllCapabilitiesService, private gamingAutoCloseService: GamingAutoCloseService) { }

  ngOnInit() {
    this.title = this.introTitle;

    this.gamingProperties.optimizationFeature = this.gamingCapabilityService.getCapabilityFromCache(
      LocalStorageKey.optimizationFeature
    );
    this.initAutoCloseStatus();
    this.displayAutoCloseList();
    this.initAutoCloseStatus();

  }

  // Get Gaming AutoClose Lists

  public displayAutoCloseList() {
    try {
      this.gamingAutoCloseService.getAppsAutoCloseList().then((appList: any) => {
        console.log('get autoclose list from js bridge ------------------------>', JSON.stringify(appList));
        this.autoCloseAppList = appList.processList;
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  openTurnOnModal(event: Event): void {
    const status = this.getAskAgain();
    console.log("function call=============================>", this.getAskAgain());
    console.log("Second wala popup=============================>", status);
    if (status) {
      console.log("Second wala popup=============================>")
      this.modalService
        .open(ModalAddAppsComponent, {
          backdrop: 'static',
          size: 'lg',
          windowClass: 'apps-modal-container'
        });
    } else {
      this.modalService.open(ModalTurnOnComponent, {
        centered: true,
        windowClass: 'turn-on-modal-container'
      });
    }
  }

  getAskAgain() {
    return this.gamingAutoCloseService.getNeedToAsk().then((status: any) => {
      console.log('Get successfully ------------------------>', status);
      return status;
    });
  }

  removeApp(appName: string) {
    this.gamingAutoCloseService.delAppsAutoCloseList(appName).then((response: any) => {
      console.log('Deleted successfully ------------------------>', response);
    });
  }

  toggleAutoClose(event: any) {
    console.log("Here=================================================>", event)
    console.log(event.switchValue);
    this.setAutoClose = event.switchValue;
    this.gamingAutoCloseService.setAutoCloseStatus(event.switchValue).then((response: any) => {
      console.log('set auto close ------------------------>', response);
    });
  }

  initAutoCloseStatus() {
    this.gamingAutoCloseService.getAutoCloseStatus().then((response: any) => {
      console.log('get auto close ------------------------>', response);
    });
  }
}
