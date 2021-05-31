import { Injectable } from '@angular/core';
import { ShellExtensionService } from 'src/app/feature/auto-close/service/shell-extension.service';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class LenovoSericeBridgeService {

  constructor(
    private shellExtension: ShellExtensionService,
    private loggerService: LoggerService
    ) { }

	public getLenovoServiceBridgeStatus() {
		const contract = {
			contract: 'Lenovo.Service.Bridge.Addin',
			command: 'Get-Status',
			payload: null,
		};

		return this.shellExtension.sendContract(contract)
		.then((response: any) => {
			if (response) {
				return response.serviceIsRunning;
			}
			return undefined;
		}).catch( (error: any) => {
			this.loggerService.error(`getLenovoServiceBridgeStatus error: ${error}`);
			return undefined;
		});
	}

	public enableLenovoServiceBridge() {
		const contract = {
			contract: 'Lenovo.Service.Bridge.Addin',
			command: 'Enable-WebServer',
			payload: null,
		};

		return this.shellExtension.sendContract(contract)
		.then((response: string) => response.toUpperCase() === 'TRUE')
		.catch( (error: any) => {
			this.loggerService.error(`enableLenovoServiceBridge error: ${error}`);
			return false;
		});
	}

	public disableLenovoServiceBridge() {
		const contract = {
			contract: 'Lenovo.Service.Bridge.Addin',
			command: 'Disable-WebServer',
			payload: null,
		};

		return this.shellExtension.sendContract(contract)
		.then((response: string) => response.toUpperCase() === 'TRUE')
		.catch( (error: any) => {
			this.loggerService.error(`disableLenovoServiceBridge error: ${error}`);
			return false;
		});
	}
}
