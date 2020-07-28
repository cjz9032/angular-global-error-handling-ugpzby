import { Injectable } from '@angular/core';
import { VantageShellService } from './../../vantage-shell/vantage-shell.service';

@Injectable({
  providedIn: 'root'
})
export class GamingQuickSettingToolbarService {

    private gamingQuickSettingToolbar: any;
    public isShellAvailable = false;

    constructor(
        private shellService: VantageShellService,
    ) { 
        this.gamingQuickSettingToolbar = shellService.getQuickSettingToolbar();
        if (this.gamingQuickSettingToolbar) {
            this.isShellAvailable = true;
        }
    }

    registerEvent(type:any): Promise<any> {
      try {
        if (this.isShellAvailable) {
          return this.gamingQuickSettingToolbar.registerEvent(type);
        }
        return undefined;
      } catch (error) {
        throw new Error(error.message);
      }
    }

    unregisterEvent(type:any): Promise<any> {
      try {
        if (this.isShellAvailable) {
          return this.gamingQuickSettingToolbar.unregisterEvent(type);
        }
        return undefined;
      } catch (error) {
        throw new Error(error.message);
      }
    }

}
