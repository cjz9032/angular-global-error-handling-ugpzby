import { Injectable } from '@angular/core';
import { HardwareScanProtocolModule, HardwareScanProtocolType, TaskType } from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { HardwareScanService } from './hardware-scan.service';
import { ScanExecutionService } from './scan-execution.service';

@Injectable({
  providedIn: 'root'
})
export class ProtocolExecutionService {

	private modulesRetrieved: any = undefined;

	constructor(private hardwareScanService: HardwareScanService, private scanExecutionService: ScanExecutionService) { }

	private isModuleAvailable(moduleName: string): boolean {
		if (Array.isArray(this.modulesRetrieved?.categoryList)) {
			// return true if there's a module for the given id and if there's at least one device for that module
			const module = this.modulesRetrieved.categoryList.find(m => m.id === moduleName);
			return Array.isArray(module?.groupList) && module.groupList.length > 0;
		}

		return false;
	}

	public protocolExecution(scan: string, module: string) {
		this.modulesRetrieved = this.hardwareScanService.getModulesRetrieved();

		if (module === undefined || !this.isModuleAvailable(module)) {
			module = HardwareScanProtocolModule.all;
		}

		if (this.modulesRetrieved){
			// Use the protocol just on QuickScan by proposed from customer.
			switch (scan){
				case HardwareScanProtocolType.QuickScan:
					this.quickScanProtocol(HardwareScanProtocolModule[module]);
					break;
				case HardwareScanProtocolType.CustomScan:
					break;
				case HardwareScanProtocolType.RecoverBadSectors:
					break;
				default:
					break;
			}
		}
	}

	public validateParams(params): boolean {
		return (params !== undefined) && (params.scan === HardwareScanProtocolType.QuickScan);
	}

	public quickScanProtocol(module: HardwareScanProtocolModule) {
		if (this.scanExecutionService){
			this.hardwareScanService.setLastTaskType(TaskType.QuickScan);
			this.scanExecutionService.checkPreScanInfo(TaskType.QuickScan, false, module);
		}
	}
}
