import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { CommonService } from '../../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { RamOCSatus } from 'src/app/data-models/gaming/ram-overclock-status.model';
import { HybridModeSatus } from 'src/app/data-models/gaming/hybrid-mode-status.model';
import { TouchpadStatus } from 'src/app/data-models/gaming/touchpad-status.model';


@Injectable({
	providedIn: 'root'
})
export class GamingSystemUpdateService {

	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService
	) { }

	public GetCPUOverClockStatus(): any  {
		this.shellService.getCPUOCStatus().then((cpuOCStatus) => {
			console.log('get cpu oc status js bridge ->', cpuOCStatus);
			if (cpuOCStatus !== undefined) {
				const CpuOCStatusObj = new CPUOCStatus();
				CpuOCStatusObj.cpuOCStatus = cpuOCStatus;
				return CpuOCStatusObj;
			}
			return undefined;
		});
	}

	public GetCPUOverClockCacheStatus(): any {
		return this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus);
	}

	public SetCPUOverClockStatus(CpuOCStatus: CPUOCStatus): any {
		this.shellService.setCPUOCStatus(CpuOCStatus).then((response) => {
			console.log('set cpu oc status js bridge ->', response);
			if (response) {
				this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, CpuOCStatus);
				return CpuOCStatus;
			}
			return false;
		});
	}

	public GetRAMOverClockStatus(): any  {
		this.shellService.getRAMOCStatus().then((RamOCStatus) => {
			console.log('get ram oc status js bridge ->', RamOCStatus);
			if (RamOCStatus !== undefined) {
				const RamOCStatusObj = new RamOCSatus();
				RamOCStatusObj.ramOcStatus = RamOCStatus;
				this.commonService.setLocalStorageValue(LocalStorageKey.RamOcStatus, RamOCStatusObj);
				return RamOCStatusObj;
			}
			return undefined;
		});
	}

	public GetRAMOverClockCacheStatus() {
		return this.commonService.getLocalStorageValue(LocalStorageKey.RamOcStatus);
	}

	public SetRAMOverClockStatus(RamOCStatus: RamOCSatus): any {
		this.shellService.setRAMOCStatus(RamOCStatus).then((response) => {
			console.log('set ram oc status js bridge ->', response);
			return response;
		});
		return false;
	}

	public GetHybridModeStatus(): any  {
		const HybridModeSatus = this.shellService.getHybridModeStatus();
		if (HybridModeSatus !== undefined) {
			const HybridModeSatusObj = new HybridModeSatus();
			HybridModeSatusObj.ramOcStatus = HybridModeSatus;
			return HybridModeSatusObj;
		}
		return this.commonService.getLocalStorageValue(LocalStorageKey.HybridModeStatus);
	}

	public SetHybridModeStatus(HybridModeSatus: HybridModeSatus): any {
		const UpdatedHybridModeStatus = this.shellService.setHybridModeStatus(HybridModeSatus);
		if (UpdatedHybridModeStatus !== undefined) {
			this.commonService.setLocalStorageValue(LocalStorageKey.HybridModeStatus, HybridModeSatus);
			return HybridModeSatus;
		}
		return undefined;
	}

	public GetTouchpadStatus(): any  {
		const TouchpadStatus = this.shellService.getKeyLockStatus();
		if (TouchpadStatus !== undefined) {
			const TouchpadStatusObj = new TouchpadStatus();
			TouchpadStatusObj.touchpadStatus = TouchpadStatus;
			return TouchpadStatusObj;
		}
		return this.commonService.getLocalStorageValue(LocalStorageKey.HybridModeStatus);
	}

	public SetTouchpadStatus(TouchpadStatus: TouchpadStatus): any {
		const UpdatedTouchpadStatus = this.shellService.setKeyLockStatus(TouchpadStatus);
		if (UpdatedTouchpadStatus !== undefined) {
			this.commonService.setLocalStorageValue(LocalStorageKey.TouchpadStatus, TouchpadStatus);
			return TouchpadStatus;
		}
		return undefined;
	}
}
