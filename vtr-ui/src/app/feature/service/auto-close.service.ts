import { Injectable } from '@angular/core';

import { ShellExtensionService } from './shell-extension.service';
import { App, Profile, TileItem } from '../types/auto-close';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Injectable({
	providedIn: 'root',
})
export class AutoCloseService {
	private savedApps: TileItem[];

	constructor(private shellExtension: ShellExtensionService, private logger: LoggerService) {}

	async setState(state: boolean): Promise<boolean> {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Set-State',
			payload: state,
		};
		return this.shellExtension
			.sendContract(contract)
			.then((response: string) => response.toLowerCase() === 'true')
			.catch((error: any) => {
				this.logger.error(`set auto close state error: ${error}`);
				return false;
			});
	}

	async getState(): Promise<boolean> {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Get-State',
		};

		return this.shellExtension
			.sendContract(contract)
			.then((response: string) => response.toLowerCase() === 'true')
			.catch((error: any) => {
				this.logger.error(`get auto close state error: ${error}`);
				return false;
			});
	}

	async getRunningApps(): Promise<TileItem[]> {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Get-RunningApps',
		};
		const runningApps: TileItem[] = [];
		const saveAppsPath = this.savedApps?.map((savedApps: TileItem) => savedApps.path);
		return this.shellExtension
			.sendContract(contract)
			.then((result: App[]) => {
				result.forEach((app: App) => {
					if (!saveAppsPath?.includes(app.path)) {
						runningApps.push({
							path: app.path,
							name: this.getAppName(app.path, app.name),
							iconSrc: app.icon ? app.icon : '',
						});
					}
				});

				return runningApps;
			})
			.catch((error: any) => {
				this.logger.error(`get running apps error: ${error}`);
				return [];
			});
	}

	async getAutoCloseApps(): Promise<TileItem[]> {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Get-AutoCloseApps',
		};

		return this.shellExtension
			.sendContract(contract)
			.then((res: App[]) => {
				this.savedApps = [];
				res.forEach((app: App) => {
					this.savedApps.push({
						path: app.path,
						name: this.getAppName(app.path, app.name),
						iconSrc: app.icon ? app.icon : '',
					});
				});

				return this.savedApps;
			})
			.catch((error: any) => {
				this.logger.error(`get auto close apps error: ${error}`);
				return [];
			});
	}

	async deleteAutoCloseApp(app: TileItem): Promise<boolean> {
		const appsToRemove = {
			path: app.path,
			name: app.name,
			icon: app.iconSrc ? app.iconSrc : '',
		};
		this.savedApps = this.savedApps.filter((savedApp: TileItem) => app.path !== savedApp.path);

		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Delete-AutoCloseApp',
			payload: {
				path: app.path,
			},
		};

		return this.shellExtension
			.sendContract(contract)
			.then((response: string) => response.toLowerCase() === 'true')
			.catch((error: any) => {
				this.logger.error(`delete auto close app error ${error}`);
				return false;
			});
	}

	async addAutoCloseApp(app: TileItem): Promise<boolean> {
		const appsToAdd = {
			path: app.path,
			name: app.name,
			icon: app.iconSrc ? app.iconSrc : '',
		};
		this.savedApps.push(appsToAdd);
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Add-AutoCloseApp',
			payload: appsToAdd,
		};

		return this.shellExtension
			.sendContract(contract)
			.then((response: string) => response.toLowerCase() === 'true')
			.catch((error: any) => {
				this.logger.error(`add auto close app error ${error}`);
				return false;
			});
	}

	private getAppName(path: string, name: string | undefined) {
		if (name) {
			return name;
		}
		const pathSplit = path.split('/');
		const appPathName = pathSplit[pathSplit.length - 1].split('.')[0];
		return appPathName;
	}
}
