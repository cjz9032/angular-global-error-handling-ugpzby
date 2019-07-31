import { AutoCloseNeedToAsk } from './../../../data-models/gaming/autoclose/autoclose-need-to-ask.model';
import { VantageShellService } from './../../vantage-shell/vantage-shell.service';
import { Injectable } from '@angular/core';
import { CommonService } from '../../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';

@Injectable({
  providedIn: 'root'
})
export class GamingAutoCloseService {
  private gamingAutoClose: any;
  public isShellAvailable = false;

  constructor(private shellService: VantageShellService, private commonService: CommonService) {
    this.gamingAutoClose = shellService.getGamingAutoClose();
    if (this.gamingAutoClose) {
      this.isShellAvailable = true;
    }
  }

  getAutoCloseStatus(): Promise<boolean> {
    try {
      if (this.isShellAvailable) {
        return this.gamingAutoClose.getStatus();
      }
      return undefined;
    } catch (error) {
      throw new Error(error);
    }
  }

  setAutoCloseStatus(value: boolean): Promise<boolean> {
    try {
      if (this.isShellAvailable) {
        return this.gamingAutoClose.setStatus(value);
      }
      return undefined;
    } catch (error) {
      throw new Error(error);
    }
  }

  getAppsAutoCloseList(): Promise<boolean> {
    try {
      if (this.isShellAvailable) {
        console.log('Here============>', this.gamingAutoClose);
        return this.gamingAutoClose.getAutoCloseList();
      }
      return undefined;
    } catch (error) {
      throw new Error(error);
    }
  }

  getAppsAutoCloseRunningList(): Promise<boolean> {
    try {
      if (this.isShellAvailable) {
        return this.gamingAutoClose.getRunningList();
      }
      return undefined;
    } catch (error) {
      throw new Error(error);
    }
  }

  addAppsAutoCloseList(value: any): Promise<boolean> {
    try {
      if (this.isShellAvailable) {
        return this.gamingAutoClose.addAutoCloseList(value);
      }
      return undefined;
    } catch (error) {
      throw new Error(error);
    }
  }

  delAppsAutoCloseList(value: any): Promise<boolean> {
    try {
      if (this.isShellAvailable) {
        return this.gamingAutoClose.delAutoCloseList(value);
      }
      return undefined;
    } catch (error) {
      throw new Error(error);
    }
  }

  getNeedToAsk(): Promise<boolean> {
    try {
      if (this.isShellAvailable) {
        return this.gamingAutoClose.getNeedToAsk();
      }
      return undefined;
    } catch (error) {
      throw new Error(error);
    }
  }

  setNeedToAsk(value: any): Promise<boolean> {
    try {
      if (this.isShellAvailable) {
        return this.gamingAutoClose.setNeedToAsk(value);
      }
      return undefined;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Auto close  status changes
  setAutoCloseStatusCache(autoCloseStatusChanges: AutoCloseStatus) {
    this.commonService.setLocalStorageValue(LocalStorageKey.AutoCloseStatus, autoCloseStatusChanges);
  }

  getAutoCloseStatusCache(): AutoCloseStatus {
    const autoCloseChangeStatus = new AutoCloseStatus();
    autoCloseChangeStatus.autoCloseStatus = this.commonService.getLocalStorageValue(LocalStorageKey.AutoCloseStatus);
    return autoCloseChangeStatus;
  }

  // Need to ask status changes

  setNeedToAskStatusCache(askStatusChanges: AutoCloseNeedToAsk) {
    this.commonService.setLocalStorageValue(LocalStorageKey.NeedToAsk, askStatusChanges.needToAsk);
  }

  getNeedToAskStatusCache(): AutoCloseNeedToAsk {
    const askChangeStatus = new AutoCloseNeedToAsk();
    askChangeStatus.needToAsk = this.commonService.getLocalStorageValue(LocalStorageKey.NeedToAsk);
    return askChangeStatus;
  }

}
