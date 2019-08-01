import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { AutoCloseNeedToAsk } from 'src/app/data-models/gaming/autoclose/autoclose-need-to-ask.model';
import { isUndefined } from 'util';

@Component({
  selector: 'vtr-widget-autoclose',
  templateUrl: './widget-autoclose.component.html',
  styleUrls: ['./widget-autoclose.component.scss']
})
export class WidgetAutocloseComponent implements OnInit, OnChanges {
  @Output() actionModal = new EventEmitter<any>();
  @Input() introTitle: string;
  @Input() switchToggle: boolean;
  modalReference: any;
  public autoCloseAppList: any;
  setAutoCloseObj: any = {};
  gamingProperties: GamingAllCapabilities = new GamingAllCapabilities();
  autoCloseStatusObj: AutoCloseStatus = new AutoCloseStatus();
  needToAskStatusObj: AutoCloseNeedToAsk = new AutoCloseNeedToAsk();
  constructor(private gamingCapabilityService: GamingAllCapabilitiesService, private gamingAutoCloseService: GamingAutoCloseService) { }

  ngOnInit() {
    this.gamingProperties.optimizationFeature = this.gamingCapabilityService.getCapabilityFromCache(
      LocalStorageKey.optimizationFeature
    );
    this.refreshAutoCloseList();
    this.setAutoCloseObj.toggleStatus = this.gamingAutoCloseService.getAutoCloseStatusCache();
    this.setAutoCloseObj.needToAsk = this.gamingAutoCloseService.getNeedToAskStatusCache();
    this.gamingAutoCloseService.setNeedToAskStatusCache(this.setAutoCloseObj.needToAsk);
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

  public openAutoCloseModal($event) {
    this.actionModal.emit(this.setAutoCloseObj);
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
    this.setAutoCloseObj.toggleStatus = event.switchValue;
    this.gamingAutoCloseService.setAutoCloseStatus(event.switchValue).then((response: any) => {
      this.gamingAutoCloseService.setAutoCloseStatusCache(event.switchValue);
      this.setAutoCloseObj.toggleStatus = event.switchValue;
    });
  }

  ngOnChanges() {
    if (!isUndefined(this.switchToggle)) {
      this.setAutoCloseObj.toggleStatus = this.switchToggle;
    }
  }
}
