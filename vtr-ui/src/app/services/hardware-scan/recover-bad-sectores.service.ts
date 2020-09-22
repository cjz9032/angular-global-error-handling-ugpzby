import { Injectable } from '@angular/core';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';

@Injectable({
  providedIn: 'root'
})
export class RecoverBadSectoresService {

	private recoverBadSectoresLastResult;

	constructor() { }

	public getLastRecoverResultTitle() {
		return HardwareScanTestResult[this.recoverBadSectoresLastResult.resultModule];
	}

	public getRecoverResultItems() {
		return this.recoverBadSectoresLastResult;
	}

	public setRecoverResultItems(items: any) {
		this.recoverBadSectoresLastResult = items;
	}
}
