import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { environment } from '../../../environments/environment';

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
		this.version = environment.appVersion;
		this.logger = this.vantageShellService.getLogger();
		if (this.logger) {
			this.isShellAvailable = true;
		}
		if (!environment.isLoggingEnabled) {
			this.debug = () => { };
			this.error = () => { };
			this.info = () => { };
		}
	}

	/**
	 * get formatted message
	 */
	private getMessage(message: string, data: any = {}) {
		let errorMessage = data;
		if (data && data.message && data.stack) {
			errorMessage = data.message;
		}

		return `v${this.version}:- ${message} | data: ${JSON.stringify(errorMessage)}`;
	}

	public debug(message: string, data: any = {}): void {
		if (this.isShellAvailable) {
			this.logger.debug(this.getMessage(message, data));
		} else {
			console.debug(this.getMessage(message, data));
		}
	}

	public error(message: string, data: any = {}): void {
		if (this.isShellAvailable) {
			this.logger.error(this.getMessage(message, data));
		} else {
			console.error(this.getMessage(message, data));
		}
	}

	public info(message: string, data: any = {}): void {
		if (this.isShellAvailable) {
			this.logger.info(this.getMessage(message, data));
		} else {
			console.info(this.getMessage(message, data));
		}
	}

	public exception(message: string, error: Error): void {
		const errorMessage = JSON.stringify({ message: error.message, stackTrace: error.stack });
		if (this.isShellAvailable) {
			this.logger.error(this.getMessage(message, errorMessage));
		} else {
			console.error(this.getMessage(message, errorMessage));
		}
	}
}
