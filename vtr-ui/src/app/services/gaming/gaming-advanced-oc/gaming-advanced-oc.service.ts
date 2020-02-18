import { Injectable } from '@angular/core';
import { VantageShellService } from './../../vantage-shell/vantage-shell.service';
import { CommonService } from '../../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Injectable({
  providedIn: 'root'
})
export class GamingAdvancedOCService {

  private gamingAdvancedOC: any;
	public isShellAvailable = false;

	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService
		) {
		this.gamingAdvancedOC = shellService.getGamingAdvancedOC();
		if (this.gamingAdvancedOC) {
			this.isShellAvailable = true;
		}
  }
  	getAdvancedOCInfo(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingAdvancedOC.getAdvancedOCInfo();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setAdvancedOCInfo (value:any): Promise<any> {
		try {
			if (this.isShellAvailable) {
			return this.gamingAdvancedOC.setAdvancedOCInfo(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error);
		}
	  }

	getAdvancedOCInfoCache() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.AdvancedOCInfo);
	}

	setAdvancedOCInfoCache(advancedOCInfo: any) {
		this.commonService.setLocalStorageValue(LocalStorageKey.AdvancedOCInfo, advancedOCInfo);
	}
}
