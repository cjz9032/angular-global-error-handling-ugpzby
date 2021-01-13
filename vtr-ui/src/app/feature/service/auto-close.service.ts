import { Injectable } from '@angular/core';

import { ShellExtensionService } from './shell-extension.service';
import { TileItem } from 'src/app/material/material-tile/material-tile.component';
import { App, Profile } from '../types/auto-close';


@Injectable({
	providedIn: 'root',
})
export class AutoCloseService {
	private savedApps: TileItem[];
	private runningApps: TileItem[];
	private status: boolean;

	constructor(
		private shellExtension: ShellExtensionService,
	) { }

	initialize(config: Profile): void {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'initialize',
			payload: config
		};

		this.shellExtension.sendContract(contract);
	}

	set State(state: boolean) {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Set-State',
			payload: state,
		};
		this.shellExtension.sendContract(contract);
	}

	get State() {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Get-State',
		};

		this.shellExtension.sendContract(contract).then((res) => this.status = res);
		return this.status;
	}

	getRunningApps(): Promise<TileItem[]> {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Get-RunningApps',
		};

		this.shellExtension.sendContract(contract).then((res: App[]) => {
			this.runningApps = [];
			res.forEach((app: App) => {
				this.runningApps.push({
					path: app.path,
					name: app.name ? app.name : this.getAppName(app.path),
					iconSrc: app.icon ? app.icon : '',
				});
			});
		});

		return Promise.resolve(this.runningApps);
	}

	getAutoCloseApps(): Promise<TileItem[]> {
		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Get-AutoCloseApps',
		};

		this.shellExtension.sendContract(contract).then((res: App[]) => {
			this.savedApps = [];
			res.forEach((app: App) => {
				this.savedApps.push({
					path: app.path,
					name: app.name ? app.name : this.getAppName(app.path),
					iconSrc: app.icon ? app.icon : '',
				});
			});
		});

		return Promise.resolve(this.savedApps);
	}

	deleteAutoCloseApps(apps: TileItem[]): Promise<boolean> {
		const appsToRemove = [];
		apps.forEach((app: TileItem) => {
			appsToRemove.push({ path: app.path });
		});

		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Delete-AutoCloseApps',
			payload: appsToRemove,
		};

		return this.shellExtension.sendContract(contract);
	}

	addAutoCloseApps(apps: TileItem[]): Promise<boolean> {
		const appsToAdd = [];
		apps.forEach((app: TileItem) => {
			appsToAdd.push({
				path: app.path,
				name: app.name,
				icon: app.iconSrc ? app.iconSrc : '',
			});
		});

		const contract = {
			contract: 'Vantage.BoostAddin.AutoClose',
			command: 'Add-AutoCloseApps',
			payload: appsToAdd,
		};

		return this.shellExtension.sendContract(contract);
	}

	private getAppName(path: string) {
		const pathArr = path.split('/');
		return pathArr[pathArr.length - 1].split('.')[0];
	}
}
