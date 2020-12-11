import { Injectable } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import {
	SnapshotComponentStatus,
	SnapshotHardwareComponents,
	SnapshotSoftwareComponents,
	SnapshotStatus,
} from 'src/app/modules/snapshot/enums/snapshot.enum';

@Injectable({
	providedIn: 'root',
})
export class SnapshotService {
	private snapshotBridge: any;

	private pvtSnapshotInfo: any;
	get snapshotInfo(): any {
		return this.pvtSnapshotInfo;
	}

	private pvtSnapshotStatus: SnapshotStatus;
	get snapshotStatus(): SnapshotStatus {
		return this.pvtSnapshotStatus;
	}
	set snapshotStatus(value: SnapshotStatus) {
		this.pvtSnapshotStatus = value;
	}

	constructor(shellService: VantageShellService, private loggerService: LoggerService) {
		this.snapshotBridge = shellService.getSnapshot();

		if (!this.snapshotBridge) {
			throw new Error('Error: Invalid Snapshot Bride!');
		}

		this.initEmptySnapshot();
		this.snapshotStatus = SnapshotStatus.firstLoad;
	}

	public async getCurrentSnapshotInfo(componentName: string) {
		return this.getSnapshotInfo(componentName, false);
	}

	public async updateSnapshotInfo(componentName: string) {
		return this.getSnapshotInfo(componentName, true);
	}

	public async updateBaselineInfo(componentName: string) {}

	public getAllComponentsList() {
		return this.getSoftwareComponentsList().concat(this.getHardwareComponentsList());
	}

	public getSoftwareComponentsList() {
		return SnapshotSoftwareComponents.values();
	}

	public getHardwareComponentsList() {
		return SnapshotHardwareComponents.values();
	}

	public anyIndividualSnapshotInProgress() {
		for (const snapshot in this.pvtSnapshotInfo) {
			if (this.pvtSnapshotInfo.hasOwnProperty(snapshot)) {
				const status = this.pvtSnapshotInfo[snapshot].status;
				if (status === SnapshotComponentStatus.inProgress) {
					return true;
				}
			}
		}
		return false;
	}

	private initEmptySnapshot() {
		this.pvtSnapshotInfo = {};

		this.getAllComponentsList().forEach((key) => {
			this.pvtSnapshotInfo[key] = {
				status: SnapshotComponentStatus.inProgress,
				info: {
					BaselineDate: '',
					LastSnapshotDate: '',
					IsDifferent: false,
					Items: [],
				},
			};
		});
	}

	private async getSnapshotInfo(componentName: string, updateSnapshot) {
		this.pvtSnapshotInfo[componentName].status = SnapshotComponentStatus.inProgress;

		try {
			const snapshotInfoResponse = await this.snapshotBridge.getSnapshotInfo(
				componentName,
				updateSnapshot
			);
			if (!snapshotInfoResponse) {
				throw Error('Could not get response from Addin');
			}
			const componentSnapshot = snapshotInfoResponse[componentName];
			if (componentSnapshot === undefined) {
				throw Error('Could not find requested component info');
			}
			this.pvtSnapshotInfo[componentName].info = componentSnapshot;
			this.pvtSnapshotInfo[componentName].status = SnapshotComponentStatus.hasData;
		} catch (error) {
			this.loggerService.error(
				`Error ${error} during request for snapshot data from ${componentName}`
			);

			// need to think better how to deal with errors
			this.pvtSnapshotInfo[componentName].status = SnapshotComponentStatus.error;
		}
	}
}
