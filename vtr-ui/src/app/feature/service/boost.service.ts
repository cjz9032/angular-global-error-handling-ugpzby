import { Injectable } from '@angular/core';
import { ShellExtensionService } from './shell-extension.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

export enum Profile {
	SMB = 'smb',
	Gaming = 'gaming',
}

@Injectable({
	providedIn: 'root',
})
export class BoostService {
	constructor(private shellExtension: ShellExtensionService, private logger: LoggerService) {}

	initProfile(name: Profile): Promise<void> {
		const contract = {
			contract: 'Vantage.BoostAddin.Profile',
			command: 'Init-Profile',
			payload: {
				name,
			},
		};

		return this.shellExtension
			.sendContract(contract)
			.then(() => {
				this.logger.info(`init boost profile ${name} success`);
			})
			.catch((error: any) => {
				this.logger.error(`init boost profile ${name} error: ${error}`);
			});
	}
}
