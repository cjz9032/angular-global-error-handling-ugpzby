import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateDefaultValueIfNotFoundPipe } from 'src/app/pipe/translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { FormatLocaleDateTimePipe } from '../../../pipe/format-locale-datetime/format-locale-datetime.pipe';
import { HardwareScanResultService } from './hardware-scan-result.service';
import { LocalCacheService } from '../../../services/local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { environment } from 'src/environments/environment';
import { ScanLogService } from './scan-log.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { HardwareScanOverallResult, HardwareScanTestResult } from '../enums/hardware-scan.enum';

declare var window;

@Injectable({
	providedIn: 'root'
})
export class ExportResultsService {

	private static readonly TEMPLATE_PATH = 'assets/templates/hardware-scan/export-results-template.html';

	private shellVersion: string;
	private experienceVersion: string;
	private bridgeVersion: string;

	private document: HTMLDocument;

	public constructor(
		private http: HttpClient,
		private translate: TranslateDefaultValueIfNotFoundPipe,
		private hardwareScanResultService: HardwareScanResultService,
		private localCacheService: LocalCacheService,
		private shellService: VantageShellService,
		private formatDateTime: FormatLocaleDateTimePipe,
		private scanLogService: ScanLogService,
		private logger: LoggerService) {
		this.experienceVersion = environment.appVersion;

		if (window.Windows) {
			const packageVersion = window.Windows.ApplicationModel.Package.current.id.version;
			this.shellVersion = `${packageVersion.major}.${packageVersion.minor}.${packageVersion.build}.${packageVersion.revision}`;
		}

		const jsBridgeVersion = this.shellService.getVersion();
		if (document.location.href.indexOf('stage') >= 0
			|| document.location.href.indexOf('vantage.csw.') >= 0) {
			this.bridgeVersion = jsBridgeVersion ? jsBridgeVersion.split('-')[0] : '';
		} else {
			this.bridgeVersion = jsBridgeVersion ? jsBridgeVersion : '';
		}
	 }

	/**
	 * Retrieve the css class which should be used in the status icon
	 * @param statusCode A number representing the test result status
	 */
	private getIconClassFromStatus(statusCode: HardwareScanTestResult): string {
		switch (statusCode) {
			case HardwareScanTestResult.Pass: return 'pass_icon';
			case HardwareScanTestResult.Fail: return 'fail_icon';
			case HardwareScanTestResult.Attention: return 'attention_icon';
			case HardwareScanTestResult.Na: return 'na_icon';
			case HardwareScanTestResult.Cancelled: return 'cancel_icon';
			default: return 'fail_icon';
		}
	}

	/**
	 * Retrieve the css class which should be used in the module icon
	 * @param moduleId The name of the module
	 */
	private getIconClassFromModuleId(moduleId: string): string {
		switch (moduleId) {
			case 'cpu': return 'processor_icon';
			case 'memory': return 'memory_icon';
			case 'motherboard': return 'motherboard_icon';
			case 'pci_express': return 'pci_desktop_icon';
			case 'pci_express_laptop': return 'pci_laptop_icon';
			case 'storage': return 'hdd_icon';
			case 'wireless': return 'wireless_icon';
			default: return 'processor_icon';
		}
	}

	/**
	 * Retrieve the translated status text based on its code
	 * @param statusCode A number representing the test result status
	 */
	private getStatusName(statusCode: HardwareScanTestResult): string {

		switch (statusCode) {
			case HardwareScanTestResult.Cancelled:
				return this.translate.transform('hardwareScan.cancelled');
			case HardwareScanTestResult.Fail:
				return this.translate.transform('hardwareScan.fail');
			case HardwareScanTestResult.Pass:
				return this.translate.transform('hardwareScan.pass');
			case HardwareScanTestResult.Attention:
				return this.translate.transform('hardwareScan.attention');
			case HardwareScanTestResult.Na:
				return this.translate.transform('hardwareScan.na');
			default: return this.translate.transform('hardwareScan.fail');
		}
	}

	/**
	 * Helper function to create an html element, filling its innerHTML attribute and applying a css style
	 * @param elementType A string representing the element's type name (e.g. "div")
	 * @param innerHtml The value that should be used as element's innerHTML
	 * @param classes An array containing the css styles to be applied in the new element
	 */
	private createElement({ elementType, innerHtml, classes }: { elementType: any; innerHtml?: any; classes?: any; }): Element {
		const element = this.document.createElement(elementType);

		if (innerHtml !== undefined) {
			element.innerHTML = innerHtml;
		}

		if (classes !== undefined) {
			for (const c of classes) {
				element.classList.add(c);
			}
		}

		return element;
	}

	/**
	 * Helper function to create a "key: value" style div, applying the right css style.
	 * @param name The value of the left span inside the div.
	 * @param value The value of the right span inside the div.
	 * @param gray A boolean indicating whether the div background should be gray or not
	 */
	private createItemDiv(name: string, value: string, gray = false, isResource = false): Element {
		const classProperties = ['font_weight_600', 'capitalize_text', 'item_description'];
		const itemName = this.createElement({ elementType: 'span', innerHtml: name, classes: classProperties });
		const itemValue = this.createElement({ elementType: 'span', innerHtml: value, classes: ['item_value'] });
		const div = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['item'] });
		div.appendChild(itemName);
		div.appendChild(itemValue);
		if (gray) {
			div.classList.add('bg_gray');
		}
		if (isResource) {
			div.classList.add('item_secondary');
		}

		return div;
	}

	/**
	 * Helper function to create a div representing one test result line.
	 * @param test A object containing the test information
	 * @param gray A boolean indicating whether the div background should be gray or not.
	 */
	private createTestItemDiv(test: any, gray: boolean): Element {
		const divTestDescription = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['item_description'] });
		const divTestValue = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['item_value'] });
		const spanTestName = this.createElement({ elementType: 'span', innerHtml: this.translate.transform('hardwareScan.pluginTokens.' + test.name, test.name), classes: ['font_weight_600', 'capitalize_text', 'item_description'] });
		const spanStartDate = this.createElement({ elementType: 'span', innerHtml: this.formatDateTime.transform(test.startDate), classes: ['item_description'] });
		const spanTestStatusText = this.createElement({ elementType: 'span', innerHtml: this.getStatusName(test.statusTest), classes: ['test_item_value', 'font_weight_600'] });
		const divTestStatusIcon = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['status_icon', this.getIconClassFromStatus(test.statusTest)] });
		const spanTestDuration = this.createElement({ elementType: 'span', innerHtml: '(' + test.duration + 's)', classes: ['capitalize_text', 'result_description'] });
		const divTestStatus = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['test_status'] });
		divTestStatus.appendChild(spanTestStatusText);
		divTestStatus.appendChild(spanTestDuration);
		divTestStatus.appendChild(divTestStatusIcon);
		const divTest = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['item', 'item_secondary', 'bg_gray'] });
		if (!gray) {
			divTest.classList.remove('bg_gray');
		}

		divTestDescription.appendChild(spanTestName);
		divTest.appendChild(divTestDescription);
		divTestValue.appendChild(spanStartDate);
		divTestValue.appendChild(divTestStatus);
		divTest.appendChild(divTestValue);

		return divTest;
	}

	/**
	 * Helper function to get only the desired Hardware Scan status
	 */
	private getScanStatusFiltered(): Array<number> {
		return Object.keys(HardwareScanTestResult).map(k => Number(k)).filter(k => k >= HardwareScanTestResult.Pass);
	}

	/**
	 * Helper function generate the test summary data.
	 * @param data A object containing all the diagnostic information
	 */
	private generateTestSummaryInfo(data: any): object {
		return data.items.reduce((result, current) => {
			const currentKeyValue = result[HardwareScanTestResult[current.resultModule]];

			if (currentKeyValue) {
				result[HardwareScanTestResult[current.resultModule]]++;
			} else {
				result[HardwareScanTestResult[current.resultModule]] = 1;
			}
			return result;
		}, {});
	}

	/**
	 * Helper function to create a row in the Test Summary section
	 * @param item A object containing the module information
	 * @param gray A boolean indicating whether the div background should be gray or not.
	 * @param moduleCount A number to indicate the module href id.
	 */
	private createTestSummaryItemDiv(item: any, gray: boolean, moduleCount: number): Element {
		const itemDiv = this.createElement({elementType: 'div', innerHtml: undefined, classes: ['item', 'bg_gray']});
		const divItemTitle = this.createElement(({elementType: 'div', innerHtml: undefined, classes: ['font_weight_600', 'item_description']}));
		const linkItemTitle = this.createElement(({elementType: 'a', innerHtml: this.translate.transform('hardwareScan.pluginTokens.' + item.module, item.module), classes: ['test_summary_item_title', 'capitalize_text']}));
		linkItemTitle.setAttribute('href', `#${item.module.toLowerCase()}-${moduleCount}`);
		divItemTitle.appendChild(linkItemTitle);
		itemDiv.appendChild(divItemTitle);
		const columnWrapperDiv = this.createElement({elementType: 'div', innerHtml: undefined, classes: ['column_wrapper']});

		const scanStatusFiltered = this.getScanStatusFiltered();
		for (const key of scanStatusFiltered) {
			const colDiv = this.createElement({elementType: 'div', innerHtml: undefined, classes: ['col', 'test_result_wrapper']});
			if (key === item.resultModule) {
				const spanResultTitle = this.createElement({elementType: 'span', innerHtml: HardwareScanTestResult[key], classes: ['test_result_text', 'result_' + HardwareScanTestResult[key].toLowerCase()]});
				const divResultIcon = this.createElement({elementType: 'div', innerHtml: undefined, classes: ['status_icon', HardwareScanTestResult[key].toLowerCase() + '_icon']});
				colDiv.appendChild(spanResultTitle);
				colDiv.appendChild(divResultIcon);
			}
			columnWrapperDiv.appendChild(colDiv);
		}
		itemDiv.appendChild(columnWrapperDiv);
		if (!gray) {
			itemDiv.classList.remove('bg_gray');
		}

		return itemDiv;
	}

	/**
	 * Helper function to create a div representing a whole module
	 * @param item A object containing the module's information
	 * @param moduleCount A number to be used as identify to the module
	 */
	private createModuleDiv(item: any, moduleCount: number): Element {
		// Module Section Title and icon
		const spanModuleTitle = this.createElement({ elementType: 'span', innerHtml: this.translate.transform('hardwareScan.pluginTokens.' + item.module, item.module), classes: ['font_weight_600', 'capitalize_text', 'section_title'] });
		const divModuleIcon = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['module_icon', this.getIconClassFromModuleId(item.icon)] });
		const divModuleTitle = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['content_title', 'center_content'] });
		divModuleTitle.id = item.module.toLowerCase() + '-' + moduleCount;
		divModuleTitle.appendChild(divModuleIcon);
		divModuleTitle.appendChild(spanModuleTitle);

		// Module Subtitle
		const spanModuleSubTitle = this.createElement({ elementType: 'span', innerHtml: this.translate.transform('hardwareScan.pluginTokens.' + item.name, item.name), classes: ['font_weight_600', 'capitalize_text'] });
		const spanModuleResultCode = this.createElement({ elementType: 'span', innerHtml: this.translate.transform('hardwareScan.resultCode') + ': ', classes: ['font_weight_600', 'capitalize_text'] });
		const spanModuleResultCodeValue = this.createElement({ elementType: 'span', innerHtml: item.resultCode });
		const divSubTitle = this.createElement({ elementType: 'div' });
		divSubTitle.appendChild(spanModuleResultCode);
		divSubTitle.appendChild(spanModuleResultCodeValue);
		const divContentSubtitle = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['content_subtitle'] });
		divContentSubtitle.appendChild(spanModuleSubTitle);
		divContentSubtitle.appendChild(divSubTitle);

		// Grouping information by index
		const detailsGroupedByIndex = item.details.reduce( (acc, curr) => {
			acc[curr.index] = acc[curr.index] || [];
			acc[curr.index].push(curr);
			return acc;
		}, Object.create(null));


		// Module info
		const divInfo = this.document.createElement('div');
		if ('' in detailsGroupedByIndex) { // Empty index means the module information
			for (const detail of detailsGroupedByIndex['']) {
				const div = this.createItemDiv(this.translate.transform('hardwareScan.pluginTokens.' + detail.key, detail.key), this.translate.transform('hardwareScan.pluginTokens.' + detail.value, detail.value));
				divInfo.appendChild(div);
			}
		}

		delete detailsGroupedByIndex[''];
		let divResources: any;
		// Module resources
		if (Object.keys(detailsGroupedByIndex).length > 0) { // If there are resources

			const hrResources = this.document.createElement('hr');
			divResources = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['resources'] });
			const spanResources = this.createElement({ elementType: 'span', innerHtml: this.translate.transform('hardwareScan.report.resources'), classes: ['resource_or_test_title'] });
			const divResourceItems = this.createElement({ elementType: 'div', innerHtml: undefined });

			divResources.appendChild(hrResources);
			divResources.appendChild(spanResources);
			divResources.appendChild(divResourceItems);

			for (const key of Object.keys(detailsGroupedByIndex)) {
				let grayResource = true;
				const isResource = true;

				const indexDiv = this.createItemDiv(this.translate.transform('hardwareScan.pluginTokens.INDEX'), this.translate.transform('hardwareScan.pluginTokens.' + key, key), grayResource, isResource);
				divResourceItems.appendChild(indexDiv);
				grayResource = !grayResource;

				for (const detail of detailsGroupedByIndex[key]) {
					const div = this.createItemDiv(this.translate.transform('hardwareScan.pluginTokens.' + detail.key, detail.key), this.translate.transform('hardwareScan.pluginTokens.' + detail.value, detail.value), grayResource, isResource);
					divResourceItems.appendChild(div);
					grayResource = !grayResource;
				}

				const emptyDiv = this.createItemDiv('', '');
				divResourceItems.appendChild(emptyDiv);
			}
		}

		// Separator
		const hr = this.document.createElement('hr');

		// Module tests
		const divTests = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['tests'] });
		const spanTests = this.createElement({ elementType: 'span', innerHtml: this.translate.transform('hardwareScan.report.tests'), classes: ['resource_or_test_title'] });
		const divTestItems = this.createElement({ elementType: 'div', innerHtml: undefined, classes: ['test_items'] });
		divTests.appendChild(spanTests);
		divTests.appendChild(divTestItems);
		let gray = true;
		for (const test of item.listTest) {
			const testItem = this.createTestItemDiv(test, gray);
			divTestItems.appendChild(testItem);
			gray = !gray;
		}

		// Whole module div
		const divModule = this.document.createElement('div');
		divModule.classList.add('module');
		divModule.appendChild(divModuleTitle);
		divModule.appendChild(divContentSubtitle);
		divModule.appendChild(divInfo);
		if (divResources !== undefined) {
			divModule.appendChild(divResources);
		}
		divModule.appendChild(hr);
		divModule.appendChild(divTests);
		return divModule;
	}

	/**
	 * Main function that will be create each needed element
	 * @param data A json object containing all data needed to export the results
	 */
	private populateTemplate(data: any) {

		// Overall status
		const headerTitle = this.document.getElementById('title');
		headerTitle.innerText = this.document.title =  this.translate.transform('hardwareScan.report.title');

		const scanDateElement = this.document.getElementById('scan_date');
		const overallTestStatusDescElement = this.document.getElementById('overall_test_status_desc');
		const overallTestStatusIconElement = this.document.getElementById('overall_test_status_icon');
		scanDateElement.innerHTML = this.formatDateTime.transform(data.startDate);
		overallTestStatusDescElement.innerHTML = this.getStatusName(data.resultTestsTitle);
		overallTestStatusIconElement.classList.add(this.getIconClassFromStatus(data.resultTestsTitle));

		// Machine information
		const spanModel = this.document.getElementById('model');
		const machineModel = this.document.getElementById('machine_model');
		const finalResultCodeSpan = this.document.getElementById('final_result_code_span');
		const finalResultCode = this.document.getElementById('final_result_code');
		const machineInfoItems = this.document.getElementById('machine_info_items');

		spanModel.innerHTML = this.translate.transform('hardwareScan.report.modelTitle');
		machineModel.innerHTML = data.model.machineModel;
		finalResultCodeSpan.innerHTML = this.translate.transform('hardwareScan.finalResultCode') + ': ';
		finalResultCode.innerHTML = data.finalResultCode;

		const summaryHeaderOrder = ['productName', 'serialNumber', 'networkInterfaces', 'biosVersion'];
		for (const key of summaryHeaderOrder) {

			if (key !== 'networkInterfaces') {
				const value = data.model[key];
				const div = this.createItemDiv(this.translate.transform('hardwareScan.report.model.' + key), value );
				machineInfoItems.appendChild(div);
			} else {
				for (const ni of data.model.networkInterfaces) {
					const div = this.createItemDiv(this.translate.transform('hardwareScan.report.model.' + ni.name) + ' ' + ni.index, ni.mac);
					machineInfoItems.appendChild(div);
				}
			}
		}

		// Environment Section
		const environmentInfoItemsOrder = ['applicationVersion', 'pluginVersion', 'experienceVersion', 'shellVersion', 'bridgeVersion'];
		const environmentSectionTitle = this.document.getElementById('environment_title');
		const environmentInfoSectionItems = this.document.getElementById('environment_info_items');
		environmentSectionTitle.innerHTML = this.translate.transform('hardwareScan.report.environmentTitle');

		for (const key of environmentInfoItemsOrder) {
			const value = data.environment[key];
			const div = this.createItemDiv(this.translate.transform('hardwareScan.report.environment.' + key), value);
			environmentInfoSectionItems.appendChild(div);
		}

		// Test Summary Section
		const testSummaryHeader = this.document.getElementById('test_summary_header');
		const testSummaryTitle = this.document.getElementById('test_summary_title');
		testSummaryTitle.innerHTML = this.translate.transform('hardwareScan.report.testResult');

		const testSummarySectionItems = this.document.getElementById('test_summary_info_items');
		const totalModulesTestedElement = this.document.getElementById('total_modules_tested');
		const divTotalModulesTestedTitle = this.createElement({elementType: 'span', innerHtml: this.translate.transform('hardwareScan.report.totalModulesTested'), classes: ['font_weight_600']});
		divTotalModulesTestedTitle.append(': ');
		const divTotalModulesTestedValue = this.createElement({elementType: 'span', innerHtml: '5', classes: ['font_weight_400']});
		totalModulesTestedElement.appendChild(divTotalModulesTestedTitle);
		totalModulesTestedElement.appendChild(divTotalModulesTestedValue);

		data.testSummary = this.generateTestSummaryInfo(data);

		for (const key of this.getScanStatusFiltered()) {
			const value = data.testSummary[HardwareScanTestResult[key]] ?? 0;
			const spanTitle = this.createElement({elementType: 'span', innerHtml: this.translate.transform('hardwareScan.' + HardwareScanTestResult[key].toLowerCase()), classes: ['font_weight_600']});
			const spanValue = this.createElement({elementType: 'span', innerHtml: value, classes: ['font_weight_400']});
			const col = this.createElement({elementType: 'div', innerHtml: undefined, classes: ['col', 'test_result_wrapper']});

			spanTitle.append(': ');
			col.appendChild(spanTitle);
			col.appendChild(spanValue);

			testSummaryHeader.appendChild(col);
		}

		let gray = true;
		let count = 0;
		for (const item of data.items) {
			const module = this.createTestSummaryItemDiv(item, gray, count);
			testSummarySectionItems.appendChild(module);

			gray = !gray;
			count++;
		}

		// StartTime and EndTime
		const divStartTimeTitle = this.document.getElementById('test_summary_start_time_title');
		const divStartTimeValue = this.document.getElementById('test_summary_start_time_value');
		divStartTimeTitle.innerHTML = this.translate.transform( 'hardwareScan.report.startDate');
		divStartTimeValue.innerHTML = this.formatDateTime.transform(data.startDate);

		const divEndTimeTitle = this.document.getElementById('test_summary_end_time_title');
		const divEndTimeValue = this.document.getElementById('test_summary_end_time_value');
		divEndTimeTitle.innerHTML = this.translate.transform( 'hardwareScan.report.endDate');
		divEndTimeValue.innerHTML = this.formatDateTime.transform(data.endDate);

		// Modules information
		count = 0;
		const modules = this.document.getElementById('modules');
		for (const item of data.items) {
			const module = this.createModuleDiv(item, count);
			modules.appendChild(module);
			count++;
		}
	}

	private async prepareDataFromScanLog(response: any): Promise<any> {

		const preparedData: any = {};
		let moduleId = 0;

		preparedData.finalResultCode = response.scanSummary.finalResultCode;
		preparedData.resultTestsTitle = HardwareScanTestResult.Pass;

		preparedData.information = response.scanSummary.finalResultCodeDescription;
		preparedData.items = [];

		preparedData.model = {
			machineModel:  response.scanSummary.summaryHeader.machineModel,
			serialNumber: response.scanSummary.summaryHeader.serialNumber,
			networkInterfaces: response.scanSummary.summaryHeader.networkInterfaces,
			biosVersion: response.scanSummary.summaryHeader.biosVersion,
			productName: response.scanSummary.summaryHeader.productName
		};

		preparedData.environment = {
			pluginVersion: response.scanSummary.summaryHeader.pluginVersion,
			applicationVersion: response.scanSummary.summaryHeader.cliVersion,
			shellVersion: this.shellVersion,
			experienceVersion: this.experienceVersion,
			bridgeVersion: this.bridgeVersion
		};

		preparedData.startDate = response.scanSummary.summaryHeader.startDate;
		preparedData.endDate = response.scanSummary.summaryHeader.endDate;

		for (const module of response.modulesResults) {
			const groupResult = module.response.groupResults;
			const groupsResultMeta = module.categoryInformation.groupList;

			for (let i = 0; i < module.response.groupResults.length; i++) {
				const item: any = {};
				const groupResultMeta = groupsResultMeta.find(x => x.id === groupResult[i].id);
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

				// There is a chance that ExportResult will be called on HardwareScanService, so I'm checking
				// if the system is desktop with localCacheService to avoid a possible cyclical dependency by adding
				// HardwareScanService here (similar reason to why PreviousResultService also uses localCacheService)
				const desktopMachine = await this.localCacheService.getLocalCacheValue(LocalStorageKey.DesktopMachine);
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
					testInfo.name = testMeta.find(x => x.id === test[j].id).name;
					testInfo.information = testMeta.find(x => x.id === test[j].id).description;
					testInfo.statusTest = test[j].result;
					testInfo.startDate = test[j].startDate;
					testInfo.duration = test[j].duration.split('.')[0]; // ignoring decimal content

					if (testInfo.statusTest === HardwareScanTestResult.NotStarted ||
						testInfo.statusTest === HardwareScanTestResult.InProgress) {
						testInfo.statusTest = HardwareScanOverallResult.Cancelled;
					}
					item.listTest.push(testInfo);
				}
				item.resultModule = this.hardwareScanResultService.consolidateResults(test.map(itemTest => itemTest.result));
				preparedData.items.push(item);
			}

			moduleId++;
		}
		preparedData.resultTestsTitle = this.hardwareScanResultService.consolidateResults(preparedData.items.map(item => item.resultModule));

		return preparedData;
	}

	private buildDetails(module: any) {
		const result = [];

		for (const item of module.metaInformation) {
			const detail = { index: '', key: '', value: '' };
			detail.index = item.index;
			detail.key = item.name;
			detail.value = item.value;
			result.push(detail);
		}

		return result;
	}

	/**
	 * Retrieve a string containing the scan's results in html format
	 * @param jsonData A json object containing all scan's result information
	 */
	private generateScanReport(jsonData: any): Promise<string> {
		return new Promise((resolve, reject) => {
			this.http.get(ExportResultsService.TEMPLATE_PATH, { responseType: 'text' }).toPromise().then(htmlData => {
				this.document = new DOMParser().parseFromString(htmlData, 'text/html');
				this.populateTemplate(jsonData);
				resolve(this.document.documentElement.outerHTML);
			}).catch(error => {
				reject(error);
			});
		});
	}

	private getDateAndHour() {
		const date = new Date();
		const day = date.getDate().toString();
		const maskDay = (day.length === 1) ? '0' + day : day;
		const month = (date.getMonth() + 1).toString();
		const maskMonth = (month.length === 1) ? '0' + month : month;
		const year = date.getFullYear().toString();
		const time = date.toTimeString().split(' ');

		return year + maskMonth + maskDay + '_' + time[0].replace(/:/g,'');
	}

	public exportScanResults() {

		if (this.scanLogService) {
			return new Promise((resolve, reject) => {
				this.scanLogService.getScanLog()
				.then((scanLogData) => {
					this.prepareDataFromScanLog(scanLogData)
					.then((dataPrepared) => {
						this.generateScanReport(dataPrepared)
						.then((htmlData) => {
							const fileName = 'HardwareScanLog_' + this.getDateAndHour() + '.html';
							window.Windows.Storage.KnownFolders.documentsLibrary.createFileAsync(fileName)
							.done((logFile) => {
								window.Windows.Storage.FileIO.appendTextAsync(logFile, htmlData);
								resolve();
							});
						})
						.catch((error) => {
							this.logger.error('Could not generate scan report', error);
							reject();
						});
					})
					.catch((error) => {
						this.logger.error('Could not prepare data', error);
						reject();
					});
				})
				.catch((error) => {
					this.logger.error('Could not get scan log', error);
					reject();
				});
			});
		}
	}
}
