import { Injectable } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { formatDate } from '@angular/common';
import { LoggerService } from 'src/app/services/logger/logger.service';
import {
	SnapshotComponentStatus,
	SnapshotHardwareComponents,
	SnapshotSoftwareComponents,
	SnapshotStatus,
} from 'src/app/modules/snapshot/enums/snapshot.enum';
import { SnapshotInfo } from '../models/snapshot.interface';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';

@Injectable({
	providedIn: 'root',
})
export class SnapshotService {
	private readonly snapshotHypothesisConfigName: string = 'Snapshot';

	private snapshotBridge: any;

	private pvtSnapshotInfo: SnapshotInfo;
	get snapshotInfo(): SnapshotInfo {
		return this.pvtSnapshotInfo;
	}

	private pvtSnapshotStatus: SnapshotStatus;
	get snapshotStatus(): SnapshotStatus {
		return this.pvtSnapshotStatus;
	}
	set snapshotStatus(value: SnapshotStatus) {
		this.pvtSnapshotStatus = value;
	}

	constructor(
		shellService: VantageShellService,
		private loggerService: LoggerService,
		private hypothesisService: HypothesisService
	) {
		this.snapshotBridge = shellService.getSnapshot();

		if (!this.snapshotBridge) {
			throw new Error('Error: Invalid Snapshot Bridge!');
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

	public async updateBaselineInfo(selectedComponents: Array<string>) {
		// Set component status from selectedComponents list to inProgress.
		selectedComponents.forEach((componentName) => {
			this.pvtSnapshotInfo[componentName].status = SnapshotComponentStatus.inProgress;
		});

		const payload = this.prepareUpdateBaselinePayload(selectedComponents);
		try {
			const snapshotUpdateBaselineResponse: SnapshotInfo = await this.snapshotBridge.getUpdateBaseline(
				payload
			);
			if (!snapshotUpdateBaselineResponse) {
				throw Error('Could not get response from Addin');
			}

			// Iterate over snapshotInfo and set only components that had the baseline updated;
			selectedComponents.forEach((componentName) => {
				this.pvtSnapshotInfo[componentName].info =
					snapshotUpdateBaselineResponse[componentName];
				this.pvtSnapshotInfo[componentName].status = SnapshotComponentStatus.hasData;
			});
		} catch (error) {
			this.loggerService.error(
				`Error ${error} during request for snapshot data from UpdateBaseline`
			);

			selectedComponents.forEach((componentName) => {
				this.pvtSnapshotInfo[componentName].status = SnapshotComponentStatus.error;
			});
		}
	}

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

	public async isAvailable(): Promise<boolean> {
		if (this.hypothesisService) {
			const featureEnabled = await this.hypothesisService.getFeatureSetting(
				this.snapshotHypothesisConfigName
			);

			return (featureEnabled || '').toString() === 'true';
		}

		throw new Error('Hypothesis Service unavailable!');
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

	private prepareUpdateBaselinePayload(data: Array<string>): SnapshotInfo {
		const snapshotInfo: SnapshotInfo = {};

		data.forEach((componentName) => {
			snapshotInfo[componentName] = this.pvtSnapshotInfo[componentName].info;
		});

		return snapshotInfo;
	}

	private async getSnapshotInfo(componentName: string, updateSnapshot: boolean): Promise<void> {
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
			const utcBaselineDate = new Date(this.pvtSnapshotInfo[componentName].info.BaselineDate + ' UTC');
			const utcLastSnapshotDate = new Date(this.pvtSnapshotInfo[componentName].info.LastSnapshotDate + ' UTC');

			this.pvtSnapshotInfo[componentName].info.BaselineDate = formatDate(utcBaselineDate, 'EEEE, MMMM d, y', 'en-US');
			this.pvtSnapshotInfo[componentName].info.LastSnapshotDate = formatDate(utcLastSnapshotDate, 'EEEE, MMMM d, y', 'en-US');
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
