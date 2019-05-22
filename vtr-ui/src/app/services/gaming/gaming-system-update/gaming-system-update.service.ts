import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { CommonService } from '../../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CPUOCStatus } from 'src/app/data-models/system-update/cpu-overclock-status.model';

@Injectable({
  providedIn: 'root'
})
export class GamingSystemUpdateService {

	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService
	) { }

	public GetCPUOverClockStatus(): any  {
		const CpuOCStatus = this.shellService.getCPUOCStatus();
		if (CpuOCStatus !== undefined) {
			const CpuOCStatusObj = new CPUOCStatus();
			CpuOCStatusObj.cpuOCStatus = CpuOCStatus;
			return CpuOCStatusObj;
		}
		return this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus);
	}

	public SetCPUOverClockStatus(CpuOCStatus: CPUOCStatus): any {
		const UpdatedCpuOCStatus = this.shellService.setCPUOCStatus(CpuOCStatus);
		if (UpdatedCpuOCStatus !== undefined) {
			this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, CpuOCStatus);
			return CpuOCStatus;
		}
		return undefined;
	}
}
