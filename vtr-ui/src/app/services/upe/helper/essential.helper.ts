import { CommsService } from '../../comms/comms.service';
import { DeviceService } from '../../device/device.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { IUpeEssential, IEssentialHelper } from '../model/definitions';
import { ServiceEssentialHelper } from './service-essential.helper';
import { ShellEssentialHelper } from './shell-essential.helper';
import { DevService } from '../../dev/dev.service';

export class EssentialHelper implements IEssentialHelper {
	private iessentialHelper: IEssentialHelper;
	private getUpeEssentialP: Promise<IUpeEssential>;
	private registerDeviceP: Promise<IUpeEssential>;
	public readonly isSupportUpeTag: boolean;		// old version of vantage service do not support upe tag, reserve for future

	constructor(
		commsService: CommsService,
		deviceService: DeviceService,
		vantageShellService: VantageShellService,
		devService: DevService
	) {
		const win = window as any;
		if (win.VantageStub && win.VantageStub.findUPEAPIKey) {	// old version shell and service
			this.iessentialHelper = new ShellEssentialHelper(commsService, deviceService, devService);
			this.isSupportUpeTag = false;
		} else {
			this.isSupportUpeTag = true;
			this.iessentialHelper = new ServiceEssentialHelper(vantageShellService, devService);
		}
	}

	public async getUpeEssential(): Promise<IUpeEssential> {
		if (!this.getUpeEssentialP) {	// cache the request in case of duplicated call
			this.getUpeEssentialP = this.iessentialHelper.getUpeEssential();
		}
		const result = await this.getUpeEssentialP;
		this.getUpeEssentialP = null;
		return result;
	}

	public async registerDevice(essential: IUpeEssential): Promise<IUpeEssential> {
		if (!this.registerDeviceP) {	// cache the request in case of duplicated call
			this.registerDeviceP = this.iessentialHelper.registerDevice(essential);
		}
		const result = await this.registerDeviceP;
		this.registerDeviceP = null;
		return result;
	}
}
