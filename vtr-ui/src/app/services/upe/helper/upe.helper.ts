import { CommsService } from '../../comms/comms.service';
import { DeviceService } from '../../device/device.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { IUpeEssential, IUpeHelper } from '../model/definitions';
import { VantageServiceHelper } from './vantage-service.helper';
import { VantageShellHelper } from './vantage-shell.helper';
import { DevService } from '../../dev/dev.service';
import { environment } from 'src/environments/environment';

export class UpeHelper implements IUpeHelper {
	private iupeHelper: IUpeHelper;
	public readonly isSupportUpeTag: boolean;
	constructor(
		commsService: CommsService,
		deviceService: DeviceService,
		vantageShellService: VantageShellService,
		devService: DevService
	) {
		const win = window as any;
		if (!win.VantageStub.findUPEAPIKey) {	// old version shell and service
			this.iupeHelper = new VantageShellHelper(commsService, deviceService, devService);
			this.isSupportUpeTag = false;
		} else {
			this.isSupportUpeTag = true;
			this.iupeHelper = new VantageServiceHelper(vantageShellService, devService);
		}
	}

	public async getUpeEssential(): Promise<IUpeEssential> {
		return await this.iupeHelper.getUpeEssential();
	}

	public async registerDevice(essential: IUpeEssential): Promise<IUpeEssential> {
		return await this.iupeHelper.registerDevice(essential);
	}
}
