import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { ModalTurnOnComponent } from '../../modal/modal-autoclose/modal-turn-on/modal-turn-on.component';
import { ModalAddAppsComponent } from '../../modal/modal-autoclose/modal-add-apps/modal-add-apps.component';
import { AutoCloseNeedToAsk } from 'src/app/data-models/gaming/autoclose/autoclose-need-to-ask.model';
import { isUndefined } from 'util';

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
  autoCloseStatusObj: AutoCloseStatus = new AutoCloseStatus();
  needToAskStatusObj: AutoCloseNeedToAsk = new AutoCloseNeedToAsk();
  constructor(private modalService: NgbModal, private gamingCapabilityService: GamingAllCapabilitiesService, private gamingAutoCloseService: GamingAutoCloseService) { }

  ngOnInit() {
    this.title = this.introTitle;

    this.gamingProperties.optimizationFeature = this.gamingCapabilityService.getCapabilityFromCache(
      LocalStorageKey.optimizationFeature
    );
    this.refreshAutoCloseList();
    this.setAutoClose = this.gamingAutoCloseService.getAutoCloseStatusCache();
    this.gamingAutoCloseService.getNeedToAskStatusCache();
  }

  // Get Gaming AutoClose Lists

  public refreshAutoCloseList() {
    this.autoCloseAppList = this.gamingAutoCloseService.getAutoCloseListCache();
    try {
      this.gamingAutoCloseService.getAppsAutoCloseList().then((appList: any) => {
        if (!isUndefined(appList.processList)) {
          this.autoCloseAppList = appList.processList;
          this.gamingAutoCloseService.setAutoCloseListCache(appList.processList);
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  openAutoCloseModal() {
    if (this.setAutoClose) {
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

  initGetAsk() {
    return this.gamingAutoCloseService.getNeedToAsk().then((status: any) => {
      return status;
    });
  }

  removeApp(appName: string, index: number) {
    this.gamingAutoCloseService.delAppsAutoCloseList(appName).then((response: any) => {
      console.log('Deleted successfully ------------------------>', response);
      this.autoCloseAppList.splice(index, 1);
      this.refreshAutoCloseList();
    });
  }

  toggleAutoClose(event: any) {
    console.log(event.switchValue);
    this.setAutoClose = event.switchValue;
    this.gamingAutoCloseService.setAutoCloseStatus(event.switchValue).then((response: any) => {
      this.gamingAutoCloseService.setAutoCloseStatusCache(event.switchValue);
      this.setAutoClose = event.switchValue;
    });
  }
}
