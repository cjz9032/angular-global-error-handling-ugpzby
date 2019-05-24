import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import packageFile from '../../../../package.json';

@Injectable({
	providedIn: 'root'
})
/**
 * logs in shell log file, can be accessed in Logs folder of config.json
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

	private getMessage(message: string, data: any = {}) {
		return `WE v${this.version}:- ${message} | Data: ${JSON.stringify(data)}`;
	}

	public debug(message: string, data: any = {}): void {
		if (this.isShellAvailable) {
			this.logger.debug(this.getMessage(message, data));
		}
	}

	public error(message: string, data: any = {}): void {
		if (this.isShellAvailable) {
			this.logger.error(this.getMessage(message, data));
		}
	}
}
