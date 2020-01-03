import { IUpeEssential, IEssentialHelper } from '../model/definitions';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { DevService } from '../../dev/dev.service';


export class ServiceEssentialHelper implements IEssentialHelper {
	private upeAgent: any;

	constructor(
		vantageShellService: VantageShellService,
		private devService: DevService
	) {
		// this.upeAgent = vantageShellService.getUpeAgent();
	}

	public async getUpeEssential(): Promise<IUpeEssential> {
		let iUpeEssential = null;
		try {
			iUpeEssential = await this.upeAgent.getUpeEssential();
		} catch (ex) {
			this.devService.writeLog('[service essential helper]get upe essential from upe agent failed', ex);
		}
		return iUpeEssential;
	}

	public async registerDevice(essential: IUpeEssential): Promise<IUpeEssential> {
		let iUpeEssential = null;
		try {
			iUpeEssential = await this.upeAgent.registerDevice(essential);
		} catch (ex) {
			this.devService.writeLog('[service essential helper]get upe essential from upe agent failed', ex);
		}
		return iUpeEssential;
	}
}
