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
  public cardContentPositionF: any = {
		FeatureImage: 'assets/cms-cache/content-card-4x4-support.jpg'
	};
	public cardContentPositionB: any = {
		FeatureImage: 'assets/cms-cache/Security4x3-zone2.jpg'
	};

  constructor(private shellService: VantageShellService,
	            private commonService: CommonService) {
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
  setAutoCloseStatusCache(status: any) {
	this.commonService.setLocalStorageValue(LocalStorageKey.AutoCloseStatus, status);
  }

  getAutoCloseStatusCache() {
	return this.commonService.getLocalStorageValue(LocalStorageKey.AutoCloseStatus);
  }

  // Need to ask status changes

  setNeedToAskStatusCache(askStatusChanges: any) {
	this.commonService.setLocalStorageValue(LocalStorageKey.NeedToAsk, askStatusChanges);
  }

  getNeedToAskStatusCache() {
	return this.commonService.getLocalStorageValue(LocalStorageKey.NeedToAsk);
  }

  setAutoCloseListCache(processList: any) {
	this.commonService.setLocalStorageValue(LocalStorageKey.AutoCloseList, processList);
  }

  getAutoCloseListCache() {
	return this.commonService.getLocalStorageValue(LocalStorageKey.AutoCloseList);
  }

}
