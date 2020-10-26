import { CommsService } from '../../comms/comms.service';
import { DeviceService } from '../../device/device.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { IUpeEssential, IEssentialHelper } from '../model/definitions';
import { ServiceEssentialHelper } from './service-essential.helper';
import { DevService } from '../../dev/dev.service';

export class EssentialHelper implements IEssentialHelper {
	private iessentialHelper: IEssentialHelper;
	private getUpeEssentialTask: Promise<IUpeEssential>;
	private registerDeviceTask: Promise<IUpeEssential>;
	public readonly isSupportUpeTag: boolean;		// old version of vantage service do not support upe tag, reserve for future

	constructor(
		vantageShellService: VantageShellService,
		devService: DevService
	) {
		this.isSupportUpeTag = true;
		this.iessentialHelper = new ServiceEssentialHelper(vantageShellService, devService);
	}

	public async getUpeEssential(): Promise<IUpeEssential> {
		if (!this.getUpeEssentialTask) {	// cache the request in case of duplicated call
			this.getUpeEssentialTask = this.iessentialHelper.getUpeEssential();
		}
		const result = await this.getUpeEssentialTask;
		this.getUpeEssentialTask = null;
		return result;
	}

	public async registerDevice(essential: IUpeEssential): Promise<IUpeEssential> {
		if (!this.registerDeviceTask) {	// cache the request in case of duplicated call
			this.registerDeviceTask = this.iessentialHelper.registerDevice(essential);
		}
		const result = await this.registerDeviceTask;
		this.registerDeviceTask = null;
		return result;
	}
}
