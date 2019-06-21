import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import packageFile from '../../../../package.json';

@Injectable({
	providedIn: 'root'
})
/**
 * logs in shell log file, can be accessed in Logs folder of config.json
 * %AppData%\..\Local\Packages\E046963F.LenovoCompanionBeta_k1h2ywk1493x8\LocalState\Logs
 */
export class LoggerService {
	public isShellAvailable = false;
	private version: string;
	private logger: any;

	constructor(private vantageShellService: VantageShellService) {
		this.version = packageFile.version;
		this.logger = this.vantageShellService.getLogger();
		if (this.logger) {
			this.isShellAvailable = true;
		}
	}

	/**
	 * get formatted message
	 */
	private getMessage(message: string, data: any = {}) {
		return `WE v${this.version}:- ${message} | Data: ${JSON.stringify(data)}`;
	}

	public debug(message: string, data: any = {}): void {
		if (this.isShellAvailable) {
			this.logger.debug(this.getMessage(message, data));
		}
	}

	//
	public error(message: string, data: any = {}): void {
		if (this.isShellAvailable) {
			this.logger.error(this.getMessage(message, data));
		}
	}

	/**
	 * add console log with ISO date time stamp
	 * @param message message to log
	 * @param param any param
	 */
	public logDate(message: string, ...param) {
		const date = new Date();
		console.log(`${date.toISOString()} | ${message}`, param);
	}
}
