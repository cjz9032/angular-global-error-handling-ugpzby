import { VantageShellService } from './../../vantage-shell/vantage-shell.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GamingAutoCloseService {
  private gamingAutoClose: any;
  public isShellAvailable = false;

  constructor(private shellService: VantageShellService) {
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
        return this.gamingAutoClose.getAutoCloseList();
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

}
