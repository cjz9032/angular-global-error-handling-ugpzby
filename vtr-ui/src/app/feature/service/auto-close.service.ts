import { Injectable } from '@angular/core';

import { ShellExtensionService } from './shell-extension.service';
import { App, Profile, TileItem } from '../types/auto-close';

@Injectable({
	providedIn: 'root',
})
export class AutoCloseService {
	private savedApps: TileItem[];

	constructor(private shellExtension: ShellExtensionService) {}

	initialize(config: Profile): void {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'initialize',
			payload: config,
		};

		this.shellExtension.sendContract(contract);
	}

	async setState(state: boolean): Promise<boolean> {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Set-State',
			payload: state,
		};
		return this.shellExtension.sendContract(contract);
	}

	async getState(): Promise<boolean> {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Get-State',
		};

		return this.shellExtension.sendContract(contract);
	}

	async getRunningApps(): Promise<TileItem[]> {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Get-RunningApps',
		};
		const runningApps: TileItem[] = [];
		const saveAppsPath = this.savedApps.map((savedApps: TileItem) => savedApps.path);
		this.shellExtension.sendContract(contract).then((result: App[]) => {
			result.forEach((app: App) => {
				if (!saveAppsPath.includes(app.path)) {
					runningApps.push({
						path: app.path,
						name: this.getAppName(app.path, app.name),
						iconSrc: app.icon ? app.icon : '',
					});
				}
			});
		});

		return runningApps;
	}

	async getAutoCloseApps(): Promise<TileItem[]> {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Get-AutoCloseApps',
		};

		this.shellExtension.sendContract(contract).then((res: App[]) => {
			this.savedApps = [];
			res.forEach((app: App) => {
				this.savedApps.push({
					path: app.path,
					name: app.name,
					iconSrc: app.icon ? app.icon : '',
				});
			});
		});

		return this.savedApps;
	}

	async deleteAutoCloseApps(app: TileItem): Promise<boolean> {
		const appsToRemove = {
			path: app.path,
			name: app.name,
			icon: app.iconSrc ? app.iconSrc : '',
		};
		this.savedApps = this.savedApps.filter((savedApp: TileItem) => app.path !== savedApp.path);

		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Delete-AutoCloseApps',
			payload: appsToRemove,
		};

		return this.shellExtension.sendContract(contract);
	}

	async addAutoCloseApps(app: TileItem): Promise<boolean> {
		const appsToAdd = {
			path: app.path,
			name: app.name,
			icon: app.iconSrc ? app.iconSrc : '',
		};
		this.savedApps.push(appsToAdd);
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Add-AutoCloseApps',
			payload: appsToAdd,
		};

		return this.shellExtension.sendContract(contract);
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
