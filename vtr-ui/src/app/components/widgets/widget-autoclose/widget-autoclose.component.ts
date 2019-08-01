import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
export class WidgetAutocloseComponent implements OnInit {
  @Output() actionModal = new EventEmitter<any>();
  @Input() turnOnACStatus: boolean;
  public autoCloseAppList: any;
  gamingProperties: GamingAllCapabilities = new GamingAllCapabilities();
  constructor(private gamingCapabilityService: GamingAllCapabilitiesService, private gamingAutoCloseService: GamingAutoCloseService) { }

  ngOnInit() {
    this.gamingProperties.optimizationFeature = this.gamingCapabilityService.getCapabilityFromCache(
      LocalStorageKey.optimizationFeature
    );
    this.refreshAutoCloseList();
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

  public openAutoCloseModal() {
    this.actionModal.emit();
  }

  removeApp(appName: string, index: number) {
    this.gamingAutoCloseService.delAppsAutoCloseList(appName).then((response: any) => {
      console.log('Deleted successfully ------------------------>', response);
      this.autoCloseAppList.splice(index, 1);
      this.refreshAutoCloseList();
    });
  }
}
