import { Injectable } from '@angular/core';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import {
	HardwareScanTestResult,
	HardwareScanOverallResult,
} from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { HardwareScanResultService } from 'src/app/modules/hardware-scan/services/hardware-scan-result.service';
import { LocalCacheService } from '../../../services/local-cache/local-cache.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { HardwareScanPluginGetPreviousResultResponse } from '../models/hardware-scan.interface';

@Injectable({
	providedIn: 'root',
})
export class PreviousResultService {
	private hardwareScanBridge: any;
	private viewResultItems: any;

	private hasLastResults = false;
	private previousResults: HardwareScanPluginGetPreviousResultResponse = {};
	private previousItemsWidget = {};
	private previousResultsResponse: any = undefined;

	public shouldUpdatePreviousResult = false;

	constructor(
		shellService: VantageShellService,
		private localCacheService: LocalCacheService,
		private hardwareScanResultService: HardwareScanResultService,
		private loggerService: LoggerService
	) {
		this.hardwareScanBridge = shellService.getHardwareScan();
	}

	public getLastPreviousResultCompletionInfo() {
		const item: any = this.getPreviousResultsWidget();
		return {
			date: item?.date,
			result: !item?.modules
				? null
				: HardwareScanTestResult[
						this.hardwareScanResultService.consolidateResults(
							item.modules.map((module) => module.resultModule)
						)
				  ],
		};
	}

	private buildPreviousResultsWidget(previousResults: any) {
		const previousItems: any = {};

		try {
			previousItems.date = previousResults.date;
			previousItems.modules = [];
			for (const item of previousResults.items) {
				const module: any = {};
				module.name = item.module;
				module.subname = item.name;
				module.resultModule = this.hardwareScanResultService.consolidateResults(
					item.listTest.map((itemTest) => itemTest.statusTest)
				);

				previousItems.modules.push(module);
			}
		} catch (ex) {
			this.loggerService.error(
				'[PreviousResultService] buildPreviousResultsWidget - Failed to build previous results widget',
				ex
			);
		}

		this.previousItemsWidget = previousItems;
	}

	public buildPreviousResults(response: any) {
		const previousResults: any = {};
		let moduleId = 0;
		this.hasLastResults = false;

		if (response) {
			this.hasLastResults = response.hasPreviousResults;
			previousResults.finalResultCode = response.scanSummary.finalResultCode;
			previousResults.resultTestsTitle = HardwareScanTestResult.Pass;

			previousResults.date = new Date(response.scanSummary.ScanDate);

			previousResults.information = response.scanSummary.finalResultCodeDescription;
			previousResults.items = [];

			for (const module of response.modulesResults) {
				const groupResult = module.response.groupResults;
				const groupsResultMeta = module.categoryInformation.groupList;

				for (let i = 0; i < module.response.groupResults.length; i++) {
					const item: any = {};
					const groupResultMeta = groupsResultMeta.find(
						(x) => x.id === groupResult[i].id
					);
					const moduleName = groupResult[i].moduleName;

					item.id = moduleId;
					item.module = module.categoryInformation.name;
					item.name = groupResultMeta.name;
					item.resultCode = groupResult[i].resultCode;
					item.information = groupResult[i].resultDescription;
					item.expanded = false;
					item.expandedStatusChangedByUser = false;
					item.detailsExpanded = false;
					item.icon = moduleName;
					item.resultModule = HardwareScanTestResult.Pass;

					// Use this validation prevent cyclical dependency with hardwareScanService
					// [NOTICE] When remove the isDesktopMachine from hardware-scan.service to another service
					// change this line to use the newest function
					const desktopMachine = this.localCacheService.getLocalCacheValue(
						LocalStorageKey.DesktopMachine
					);
					if (!desktopMachine) {
						if (item.icon === 'pci_express') {
							item.icon += '_laptop';
						}
					}
					item.details = this.buildDetails(groupResultMeta);
					item.listTest = [];
					const test = groupResult[i].testResultList;
					const testMeta = groupResultMeta.testList;

					for (let j = 0; j < groupResult[i].testResultList.length; j++) {
						const testInfo: any = {};
						testInfo.id = test[j].id;
						testInfo.name = testMeta.find((x) => x.id === test[j].id).name;
						testInfo.information = testMeta.find(
							(x) => x.id === test[j].id
						).description;
						testInfo.statusTest = test[j].result;

						if (
							testInfo.statusTest === HardwareScanTestResult.NotStarted ||
							testInfo.statusTest === HardwareScanTestResult.InProgress
						) {
							testInfo.statusTest = HardwareScanOverallResult.Cancelled;
						}
						item.listTest.push(testInfo);
					}
					item.resultModule = this.hardwareScanResultService.consolidateResults(
						test.map((itemTest) => itemTest.result)
					);
					previousResults.items.push(item);
				}

				moduleId++;
			}
			previousResults.resultTestsTitle = this.hardwareScanResultService.consolidateResults(
				previousResults.items.map((item) => item.resultModule)
			);
		}

		// This will clean the previous result widget and previous result when a null response is received
		this.previousResults = previousResults;
		this.buildPreviousResultsWidget(this.previousResults);
	}

	public buildDetails(module: any) {
		const result = [];

		for (const item of module.metaInformation) {
			const detail = { key: '', value: '' };
			detail.key = item.name;
			detail.value = item.value;
			result.push(detail);
		}

		return result;
	}

	public getLastResults() {
		if (this.hardwareScanBridge) {
			if (this.shouldUpdatePreviousResult) {
				this.updatePreviousResultsResponse();
			}
			return this.previousResultsResponse
				.then((response) => {
					this.buildPreviousResults(response);
					this.loggerService.info('[getLastResults]', response);
					return response;
				})
				.catch((ex) => {
					this.loggerService.error(
						'[getLastResults] -> buildPreviousResults error: ',
						ex
					);
				});
		}
		return undefined;
	}

	public getLastFinalResultCode() {
		const item: any = this.getViewResultItems();
		return item.finalResultCode;
	}

	public updateLastFailuredTest(moduleList: any) {
		// Clear Failed Tests before count
		this.hardwareScanResultService.clearFailedTests();

		moduleList.forEach((module) => {
			this.hardwareScanResultService.countFailedTests(module.listTest);
		});
	}

	public updatePreviousResultsResponse() {
		this.previousResultsResponse = this.hardwareScanBridge
			.getPreviousResults()
			.then((response) => {
				this.shouldUpdatePreviousResult = false;
				return response;
			})
			.catch((ex) => {
				this.loggerService.error('[updatePreviousResultsResponse]', ex);
			});
	}

	public getPreviousResultsWidget() {
		return this.previousItemsWidget;
	}

	public hasPreviousResults() {
		return this.hasLastResults;
	}

	public getPreviousResults(): HardwareScanPluginGetPreviousResultResponse {
		return this.previousResults;
	}

	public getViewResultItems() {
		return this.viewResultItems;
	}

	public setViewResultItems(items: any) {
		this.viewResultItems = items;
	}

	public async getLastHardwareScanDate(): Promise<any> {
		this.updatePreviousResultsResponse();
		await this.getLastResults();
		const previousResultsWidget: any = this.getPreviousResultsWidget();
		if (previousResultsWidget) {
			return previousResultsWidget.date;
		} else {
			return undefined;
		}
	}
}
