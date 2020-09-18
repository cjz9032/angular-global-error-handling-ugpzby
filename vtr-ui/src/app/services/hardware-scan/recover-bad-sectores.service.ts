import { Injectable } from '@angular/core';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';
import { HardwareScanResultService } from 'src/app/services/hardware-scan/hardware-scan-result.service';


@Injectable({
  providedIn: 'root'
})
export class RecoverBadSectoresService {

	constructor(private hardwareScanResultService: HardwareScanResultService) { }

	public getLastPreviousResultCompletionInfo() {
		const item: any = '';
		return {
			date: item.date,
			result: HardwareScanTestResult[this.hardwareScanResultService.consolidateResults(item.modules.map(module => module.resultModule))]
		};
	}
}
