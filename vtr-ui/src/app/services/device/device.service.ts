import { Injectable } from '@angular/core';
import {FeatureStatus} from "../../data-models/common/feature-status.model";
import {VantageShellService} from "../vantage-shell/vantage-shell.service";

@Injectable({
	providedIn: 'root'
})
export class DeviceService {

	deviceModel = 'Ideapad 720s';

	private sysInfo: any;

	public isShellAvailable = false;


	constructor(shellService: VantageShellService) {
		this.sysInfo = shellService.getSysinfo();
		if (this.sysInfo) {
			this.isShellAvailable = true;
		}
	}

	getMachineInfo():Promise<any>{
		if (this.sysInfo) {
			return this.sysInfo.getMachineInfo();
		}
		return undefined;
	}
	getHardwareInfo():Promise<any>{
		if (this.sysInfo) {
			return this.sysInfo.getHardwareInfo();
		}
		return undefined;
	}

	getMemAndDiskUsage():Promise<any>{
		if (this.sysInfo) {
			return this.sysInfo.getMemAndDiskUsage();
		}
		return undefined;
	}

	isARM():Promise<boolean>{
		if (this.sysInfo) {
			return this.sysInfo.getMachineInfo().then((object)=>{
				if(object && object.properties && object.properties.osBitness && object.properties.osBitness.description && object.properties.osBitness.description.toLowerCase()==='arm'){
					return true;
				}else{
					return false;
				}
			});
		}
		return Promise.resolve(false);
	}
}
