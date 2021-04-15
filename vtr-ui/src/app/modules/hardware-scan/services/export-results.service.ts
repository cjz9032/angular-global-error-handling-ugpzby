import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toNumber } from 'lodash';
import { ExportLogErrorStatus, ExportLogExtensions } from 'src/app/enums/export-log.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateDefaultValueIfNotFoundPipe } from 'src/app/pipe/translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { environment } from 'src/environments/environment';
import { FormatLocaleDateTimePipe } from '../../../pipe/format-locale-datetime/format-locale-datetime.pipe';
import { DeviceService } from '../../../services/device/device.service';
import { LocalCacheService } from '../../../services/local-cache/local-cache.service';
import {
	FontTypes,
	HardwareScanOverallResult,
	HardwareScanTestResult,
	LanguageCode,
} from '../enums/hardware-scan.enum';
import { HardwareScanResultService } from './hardware-scan-result.service';
import { HardwareScanService } from './hardware-scan.service';
import { RecoverBadSectorsService } from './recover-bad-sectors.service';
import { ScanLogService } from './scan-log.service';
import { LogIcons } from './utils/icons/log-icons';
import { ModulesIcons } from './utils/icons/modules-icons';
import { StatusIcons } from './utils/icons/status-icons';

declare let window;

interface IFont {
	id: string;
	data: string;
}

@Injectable({
	providedIn: 'root',
})
export class ExportResultsService {
	private static readonly TEMPLATE_PATH =
		'assets/templates/hardware-scan/export-results-template.html';

	private shellVersion: string;
	private experienceVersion: string;
	private bridgeVersion: string;
	private exportExtensionSelected = ExportLogExtensions.html;

	// Attributes to build pdf
	private currentFont: string;
	private currentLanguage: string;
	private fonts: Array<IFont> = new Array<IFont>();
	private componentIconSize = 10;
	private darkBlueColor = '#34495E';
	private lightBlueColor = '#4A81FD';
	private whiteColor = '#FFF';
	private hebrewUnicodeRange = /[\u0590-\u05FF]/;
	private logoSize = 10;
	private startX = 10;
	private statusIconSize = 5;
	private firsColumnStyle = {
		cellWidth: 75,
		fontStyle: 'bold',
		halign: 'left',
	};

	private document: HTMLDocument;

	public constructor(
		private http: HttpClient,
		private translate: TranslateDefaultValueIfNotFoundPipe,
		private hardwareScanResultService: HardwareScanResultService,
		private localCacheService: LocalCacheService,
		private shellService: VantageShellService,
		private formatDateTime: FormatLocaleDateTimePipe,
		private scanLogService: ScanLogService,
		private recoverBadSectorsService: RecoverBadSectorsService,
		private hardwareScanService: HardwareScanService,
		private deviceService: DeviceService,
		private logger: LoggerService
	) {
		this.experienceVersion = environment.appVersion;

		if (window.Windows) {
			const packageVersion = window.Windows.ApplicationModel.Package.current.id.version;
			this.shellVersion = `${packageVersion.major}.${packageVersion.minor}.${packageVersion.build}.${packageVersion.revision}`;
		}

		const jsBridgeVersion = this.shellService.getVersion();
		if (
			document.location.href.indexOf('stage') >= 0 ||
			document.location.href.indexOf('vantage.csw.') >= 0
		) {
			this.bridgeVersion = jsBridgeVersion ? jsBridgeVersion.split('-')[0] : '';
		} else {
			this.bridgeVersion = jsBridgeVersion ? jsBridgeVersion : '';
		}

		this.deviceService.getMachineInfo().then((value) => this.loadFonts(value.locale));
	}

	public async exportRbsResults(): Promise<[ExportLogErrorStatus, string]> {
		if (!(await this.validateDocumentsLibrary())) {
			throw ExportLogErrorStatus.AccessDenied;
		}

		try {
			let dataFormatted;
			const reportFileName = 'RecoverBadSectorsLog';
			const rbsResultItems = await this.recoverBadSectorsService.getRecoverResultItems();
			const dataPrepared = await this.prepareDataFromRecoverBadSectors(rbsResultItems);

			if (this.exportExtensionSelected === ExportLogExtensions.html) {
				dataFormatted = await this.generateHtmlReport(dataPrepared);
			} else {
				dataFormatted = this.generatePdfReport(dataPrepared);
			}

			const createdFilePath = await this.exportReportToFile(reportFileName, dataFormatted);
			return [ExportLogErrorStatus.SuccessExport, createdFilePath];
		} catch (error) {
			this.logger.error('Could not get rbs log', error);
			throw ExportLogErrorStatus.GenericError;
		}
	}

	public async exportScanResults(): Promise<[ExportLogErrorStatus, string]> {
		if (!(await this.validateDocumentsLibrary())) {
			throw ExportLogErrorStatus.AccessDenied;
		}

		try {
			let dataFormatted;
			const reportFileName = 'HardwareScanLog';
			const scanLogData = await this.scanLogService.getScanLog();
			const dataPrepared = await this.prepareDataFromScanLog(scanLogData);
			if (this.exportExtensionSelected === ExportLogExtensions.html) {
				dataFormatted = await this.generateHtmlReport(dataPrepared);
			} else {
				dataFormatted = this.generatePdfReport(dataPrepared);
			}
			const createdFilePath = await this.exportReportToFile(reportFileName, dataFormatted);
			return [ExportLogErrorStatus.SuccessExport, createdFilePath];
		} catch (error) {
			this.logger.error('Could not get scan log', error);
			throw ExportLogErrorStatus.GenericError;
		}
	}

	public setExportExtensionSelected(extension: ExportLogExtensions) {
		this.exportExtensionSelected = extension;
	}

	private async loadFonts(currentLanguage: string) {
		this.currentLanguage = currentLanguage;

		switch (currentLanguage) {
			case LanguageCode.japanese:
			case LanguageCode.simplifiedChinese:
			case LanguageCode.traditionalChinese:
				this.currentFont = FontTypes.notosc;
				break;
			case LanguageCode.korean:
				this.currentFont = FontTypes.notokr;
				break;
			case LanguageCode.arabic:
				this.currentFont = FontTypes.amiri;
				break;
			case LanguageCode.hebrew:
				this.currentFont = FontTypes.rubik;
				break;
			default:
				this.currentFont = FontTypes.noto;
				break;
		}

		try {
			this.fonts.push((await import('./utils/fonts/amiri.json')).default as IFont);
			this.fonts.push((await import('./utils/fonts/noto.json')).default as IFont);
			this.fonts.push((await import('./utils/fonts/rubik.json')).default as IFont);
			this.fonts.push((await import('./utils/fonts/noto-kr.json')).default as IFont);
			this.fonts.push((await import('./utils/fonts/noto-sc.json')).default as IFont);
		} catch (error) {
			this.logger.error(
				'[HardwareScan ExportResultsService] Error on loading font files',
				error
			);
		}
	}

	/**
	 * Retrieve the css class which should be used in the status icon
	 *
	 * @param statusCode A number representing the test result status
	 */
	private getIconClassFromStatus(statusCode: HardwareScanTestResult): string {
		return this.getStatusFromStatusCode(statusCode) + '_icon';
	}

	private getStatusFromStatusCode(statusCode: HardwareScanTestResult): string {
		return HardwareScanTestResult[statusCode].toLowerCase() ?? 'fail';
	}

	private getStatusColorFromStatusCode(statusCode: HardwareScanTestResult) {
		let RGB = [];
		switch (statusCode) {
			case HardwareScanTestResult.Pass:
				RGB = [0, 150, 90];
				break;
			case HardwareScanTestResult.Fail:
				RGB = [231, 76, 60];
				break;
			case HardwareScanTestResult.Attention:
				RGB = [255, 126, 62];
				break;
			case HardwareScanTestResult.Cancelled:
			case HardwareScanTestResult.Na:
				RGB = [102, 116, 129];
				break;
		}
		return RGB;
	}

	/**
	 * Retrieve the css class which should be used in the module icon
	 *
	 * @param moduleId The name of the module
	 */
	private getIconClassFromModuleId(moduleId: string): string {
		switch (moduleId) {
			case 'cpu':
				return 'processor_icon';
			case 'memory':
				return 'memory_icon';
			case 'motherboard':
				return 'motherboard_icon';
			case 'pci_express':
				return 'pci_desktop_icon';
			case 'pci_express_laptop':
				return 'pci_laptop_icon';
			case 'storage':
				return 'hdd_icon';
			case 'wireless':
				return 'wireless_icon';
			default:
				return 'processor_icon';
		}
	}

	/**
	 * Retrieve the translated status text based on its code
	 *
	 * @param statusCode A number representing the test result status
	 */
	private getStatusName(statusCode: HardwareScanTestResult): string {
		return this.translate.transform('hardwareScan.' + this.getStatusFromStatusCode(statusCode));
	}

	/**
	 * Helper function to create an html element, filling its innerHTML attribute and applying a css style
	 *
	 * @param elementType A string representing the element's type name (e.g. "div")
	 * @param innerHtml The value that should be used as element's innerHTML
	 * @param classes An array containing the css styles to be applied in the new element
	 */
	private createElement({
		elementType,
		innerHtml,
		classes,
	}: {
		elementType: any;
		innerHtml?: any;
		classes?: any;
	}): Element {
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
	 *
	 * @param name The value of the left span inside the div.
	 * @param value The value of the right span inside the div.
	 * @param gray A boolean indicating whether the div background should be gray or not
	 */
	private createItemDiv(name: string, value: string, gray = false, isResource = false): Element {
		const classProperties = ['font_weight_600', 'capitalize_text', 'item_description'];
		const itemName = this.createElement({
			elementType: 'span',
			innerHtml: name,
			classes: classProperties,
		});
		const itemValue = this.createElement({
			elementType: 'span',
			innerHtml: value,
			classes: ['item_value'],
		});
		const div = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['item'],
		});
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
	 *
	 * @param test A object containing the test information
	 * @param gray A boolean indicating whether the div background should be gray or not.
	 */
	private createTestItemDiv(test: any, gray: boolean): Element {
		const divTestDescription = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['item_description'],
		});
		const divTestValue = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['item_value'],
		});
		const spanTestName = this.createElement({
			elementType: 'span',
			innerHtml: this.translate.transform(
				'hardwareScan.pluginTokens.' + test.name,
				test.name
			),
			classes: ['font_weight_600', 'capitalize_text', 'item_description'],
		});
		const spanStartDate = this.createElement({
			elementType: 'span',
			innerHtml: test.startDate,
			classes: ['item_description'],
		});
		const spanTestStatusText = this.createElement({
			elementType: 'span',
			innerHtml: this.getStatusName(test.statusTest),
			classes: ['test_item_value', 'font_weight_600'],
		});
		const divTestStatusIcon = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['status_icon', this.getIconClassFromStatus(test.statusTest)],
		});
		const spanTestDuration = this.createElement({
			elementType: 'span',
			innerHtml: '(' + test.duration + 's)',
			classes: ['capitalize_text', 'result_description'],
		});
		const divTestStatus = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['test_status'],
		});
		divTestStatus.appendChild(spanTestStatusText);
		divTestStatus.appendChild(spanTestDuration);
		divTestStatus.appendChild(divTestStatusIcon);
		const divTest = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['item', 'item_secondary', 'bg_gray'],
		});
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
		return Object.keys(HardwareScanTestResult)
			.map((k) => Number(k))
			.filter((k) => k >= HardwareScanTestResult.Pass);
	}

	/**
	 * Helper function generate the test summary data.
	 *
	 * @param data A object containing all the diagnostic information
	 */
	private calculateTestSummaryInfo(data: any): any {
		return data.items.reduce((result, current) => {
			const currentKeyValue = result[this.getStatusFromStatusCode(current.resultModule)];

			if (currentKeyValue) {
				result[this.getStatusFromStatusCode(current.resultModule)]++;
			} else {
				result[this.getStatusFromStatusCode(current.resultModule)] = 1;
			}
			return result;
		}, {});
	}

	/**
	 * Helper function to create a row in the Test Summary section
	 *
	 * @param item A object containing the module information
	 * @param gray A boolean indicating whether the div background should be gray or not.
	 * @param moduleCount A number to indicate the module href id.
	 */
	private createTestSummaryItemDiv(item: any, gray: boolean, moduleCount: number): Element {
		const isRecoverBadSectors = item.rbsDetails !== undefined;
		const itemDiv = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['item', 'bg_gray'],
		});
		const divItemTitle = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['font_weight_600', 'item_description'],
		});

		// Creating test summary row title and link
		const linkItemTitle = this.createElement({
			elementType: 'a',
			innerHtml: this.translate.transform(
				'hardwareScan.pluginTokens.' + item.module,
				item.module
			),
			classes: ['test_summary_item_title', 'capitalize_text'],
		});
		linkItemTitle.innerHTML = isRecoverBadSectors
			? item.name
			: this.translate.transform('hardwareScan.pluginTokens.' + item.module, item.module);
		linkItemTitle.setAttribute('href', `#${item.module.toLowerCase()}-${moduleCount}`);
		divItemTitle.appendChild(linkItemTitle);
		itemDiv.appendChild(divItemTitle);

		const columnWrapperDiv = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['column_wrapper'],
		});
		const scanStatusFiltered = this.getScanStatusFiltered();
		for (const key of scanStatusFiltered) {
			const colDiv = this.createElement({
				elementType: 'div',
				innerHtml: undefined,
				classes: ['col', 'test_result_wrapper'],
			});
			if (key === item.resultModule) {
				const spanResultTitle = this.createElement({
					elementType: 'span',
					innerHtml: this.translate.transform(
						'hardwareScan.' + this.getStatusFromStatusCode(key),
						this.getStatusFromStatusCode(key)
					),
					classes: ['test_result_text', 'result_' + this.getStatusFromStatusCode(key)],
				});
				const divResultIcon = this.createElement({
					elementType: 'div',
					innerHtml: undefined,
					classes: ['status_icon', this.getStatusFromStatusCode(key) + '_icon'],
				});
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
	 *
	 * @param item A object containing the module's information
	 * @param moduleCount A number to be used as identify to the module
	 */
	private createModuleDiv(item: any, moduleCount: number): Element {
		const isRecoverBadSectors = item.rbsDetails !== undefined;

		// Module Section Title and icon
		const spanModuleTitle = this.createElement({
			elementType: 'span',
			innerHtml: this.translate.transform(
				'hardwareScan.pluginTokens.' + item.module,
				item.module
			),
			classes: ['font_weight_600', 'capitalize_text', 'section_title'],
		});
		const divModuleIcon = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['module_icon', this.getIconClassFromModuleId(item.icon)],
		});
		const divModuleTitle = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['content_title', 'center_content'],
		});
		divModuleTitle.id = item.module.toLowerCase() + '-' + moduleCount;
		divModuleTitle.appendChild(divModuleIcon);
		divModuleTitle.appendChild(spanModuleTitle);

		// Module Subtitle
		const spanModuleSubTitle = this.createElement({
			elementType: 'span',
			innerHtml: this.translate.transform(
				'hardwareScan.pluginTokens.' + item.name,
				item.name
			),
			classes: ['font_weight_600', 'capitalize_text'],
		});
		const divSubTitle = this.createElement({ elementType: 'div' });
		const divContentSubtitle = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['content_subtitle'],
		});

		if (!isRecoverBadSectors) {
			const spanModuleResultCode = this.createElement({
				elementType: 'span',
				innerHtml: this.translate.transform('hardwareScan.resultCode') + ': ',
				classes: ['font_weight_600', 'capitalize_text'],
			});
			const spanModuleResultCodeValue = this.createElement({
				elementType: 'span',
				innerHtml: item.resultCode,
			});
			divSubTitle.appendChild(spanModuleResultCode);
			divSubTitle.appendChild(spanModuleResultCodeValue);
		}

		divContentSubtitle.appendChild(spanModuleSubTitle);
		divContentSubtitle.appendChild(divSubTitle);

		// Grouping information by index
		const detailsGroupedByIndex = item.details.reduce((acc, curr) => {
			acc[curr.index] = acc[curr.index] || [];
			acc[curr.index].push(curr);
			return acc;
		}, Object.create(null));

		// Module info
		const divInfo = this.document.createElement('div');
		if ('' in detailsGroupedByIndex) {
			// Empty index means the module information
			for (const detail of detailsGroupedByIndex['']) {
				const div = this.createItemDiv(
					this.translate.transform('hardwareScan.pluginTokens.' + detail.key, detail.key),
					this.translate.transform(
						'hardwareScan.pluginTokens.' + detail.value,
						detail.value
					)
				);
				divInfo.appendChild(div);
			}
		}

		delete detailsGroupedByIndex[''];
		let divResources: any;
		// Module resources
		if (Object.keys(detailsGroupedByIndex).length > 0) {
			// If there are resources

			const hrResources = this.document.createElement('hr');
			divResources = this.createElement({
				elementType: 'div',
				innerHtml: undefined,
				classes: ['resources'],
			});
			const spanResources = this.createElement({
				elementType: 'span',
				innerHtml: this.translate.transform('hardwareScan.report.resources'),
				classes: ['resource_or_test_title'],
			});
			const divResourceItems = this.createElement({
				elementType: 'div',
				innerHtml: undefined,
			});

			divResources.appendChild(hrResources);
			divResources.appendChild(spanResources);
			divResources.appendChild(divResourceItems);

			for (const key of Object.keys(detailsGroupedByIndex)) {
				let grayResource = true;
				const isResource = true;

				const indexDiv = this.createItemDiv(
					this.translate.transform('hardwareScan.pluginTokens.INDEX'),
					this.translate.transform('hardwareScan.pluginTokens.' + key, key),
					grayResource,
					isResource
				);
				divResourceItems.appendChild(indexDiv);
				grayResource = !grayResource;

				for (const detail of detailsGroupedByIndex[key]) {
					const div = this.createItemDiv(
						this.translate.transform(
							'hardwareScan.pluginTokens.' + detail.key,
							detail.key
						),
						this.translate.transform(
							'hardwareScan.pluginTokens.' + detail.value,
							detail.value
						),
						grayResource,
						isResource
					);
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
		const divTests = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['tests'],
		});
		const spanTests = this.createElement({
			elementType: 'span',
			innerHtml: this.translate.transform('hardwareScan.report.tests'),
			classes: ['resource_or_test_title'],
		});
		const divTestItems = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['test_items'],
		});
		divTests.appendChild(spanTests);
		divTests.appendChild(divTestItems);
		let gray = true;
		if (item.listTest !== undefined) {
			for (const test of item.listTest) {
				const testItem = this.createTestItemDiv(test, gray);
				divTestItems.appendChild(testItem);
				gray = !gray;
			}
		}

		const divRbsTest = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['tests'],
		});
		gray = true;
		if (isRecoverBadSectors) {
			const spanRbsTest = this.createElement({
				elementType: 'span',
				innerHtml: this.translate.transform('hardwareScan.recoverBadSectors.title'),
				classes: ['resource_or_test_title'],
			});
			const divRbsDetailsItems = this.createElement({
				elementType: 'div',
				innerHtml: undefined,
				classes: ['test_items'],
			});
			divRbsTest.appendChild(spanRbsTest);
			divRbsTest.appendChild(divRbsDetailsItems);
			for (const detail of item.rbsDetails) {
				const rbsDetailItem = this.createItemDiv(
					this.translate.transform(
						'hardwareScan.recoverBadSectors.' + detail.key,
						detail.key
					),
					detail.value,
					gray,
					true
				);
				divRbsDetailsItems.appendChild(rbsDetailItem);
				gray = !gray;
			}
		}

		// Whole module div
		const divModule = this.document.createElement('div');
		divModule.classList.add('module');
		divModule.appendChild(divModuleTitle);
		divModule.appendChild(divContentSubtitle);
		divModule.appendChild(divInfo);
		if (isRecoverBadSectors) {
			divModule.appendChild(hr);
			divModule.appendChild(divRbsTest);
		}
		if (divResources !== undefined) {
			divModule.appendChild(divResources);
		}
		if (!isRecoverBadSectors) {
			divModule.appendChild(hr);
			divModule.appendChild(divTests);
		}
		return divModule;
	}

	private async prepareDataFromScanLog(response: any): Promise<any> {
		const preparedData: any = {};
		let moduleId = 0;

		preparedData.finalResultCode = response.scanSummary.finalResultCode;
		preparedData.resultTestsTitle = HardwareScanTestResult.Pass;

		preparedData.information = response.scanSummary.finalResultCodeDescription;
		preparedData.items = [];

		preparedData.model = {
			machineModel: response.scanSummary.summaryHeader.machineModel,
			serialNumber: response.scanSummary.summaryHeader.serialNumber,
			networkInterfaces: response.scanSummary.summaryHeader.networkInterfaces,
			biosVersion: response.scanSummary.summaryHeader.biosVersion,
			productName: response.scanSummary.summaryHeader.productName,
		};

		preparedData.environment = {
			pluginVersion: response.scanSummary.summaryHeader.pluginVersion,
			applicationVersion: response.scanSummary.summaryHeader.cliVersion,
			shellVersion: this.shellVersion,
			experienceVersion: this.experienceVersion,
			bridgeVersion: this.bridgeVersion,
		};

		preparedData.startDate = this.formatDateTime.transform(
			response.scanSummary.summaryHeader.startDate
		);
		preparedData.endDate = this.formatDateTime.transform(
			response.scanSummary.summaryHeader.endDate
		);

		for (const module of response.modulesResults) {
			const groupResult = module.response.groupResults;
			const groupsResultMeta = module.categoryInformation.groupList;

			for (let i = 0; i < module.response.groupResults.length; i++) {
				const item: any = {};
				const groupResultMeta = groupsResultMeta.find((x) => x.id === groupResult[i].id);
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
				const desktopMachine = await this.localCacheService.getLocalCacheValue(
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
					testInfo.information = testMeta.find((x) => x.id === test[j].id).description;
					testInfo.statusTest = test[j].result;
					testInfo.startDate = this.formatDateTime.transform(test[j].startDate);
					testInfo.duration = test[j].duration?.split('.')[0] ?? '0'; // ignoring decimal content

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
				preparedData.items.push(item);
			}

			moduleId++;
		}
		preparedData.resultTestsTitle = this.hardwareScanResultService.consolidateResults(
			preparedData.items.map((item) => item.resultModule)
		);

		return preparedData;
	}

	private buildDetails(module: any) {
		const result = [];

		for (const item of module.metaInformation) {
			// Preventing UDI to be displayed on details
			if (item.name !== 'UDI') {
				const detail = { index: '', key: '', value: '' };
				detail.index = item.index;
				detail.key = item.name;
				detail.value = item.value;
				result.push(detail);
			}
		}

		return result;
	}

	/**
	 * Retrieve a string containing the scan's results in html format
	 *
	 * @param jsonData A json object containing all scan's result information
	 */
	private generateScanReport(jsonData: any): Promise<string> {
		return new Promise((resolve, reject) => {
			this.http
				.get(ExportResultsService.TEMPLATE_PATH, { responseType: 'text' })
				.toPromise()
				.then((htmlData) => {
					this.document = new DOMParser().parseFromString(htmlData, 'text/html');
					this.populateTemplate(jsonData);
					resolve(this.document.documentElement.outerHTML);
				})
				.catch((error) => {
					this.logger.exception('[ExportResultService] generateScanReport', error);
					reject(error);
				});
		});
	}

	private getDateAndHour(): string {
		const date = new Date();
		const day = date.getDate().toString();
		const maskDay = day.length === 1 ? '0' + day : day;
		const month = (date.getMonth() + 1).toString();
		const maskMonth = month.length === 1 ? '0' + month : month;
		const year = date.getFullYear().toString();
		const time = date.toTimeString().split(' ');

		return year + maskMonth + maskDay + '_' + time[0].replace(/:/g, '');
	}

	private getModelData(): Promise<any> {
		const modelData: any = {};

		// Created a timeout function to return reject if IMController not send any update in 10s
		// Uses this validation to avoid cases that IMController was closed unexpectedly
		const timeoutPromise = new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				reject('Timed out after 10s!');
			}, 10000);
		});

		const deviceServicePromise = new Promise<any>((resolve, reject) => {
			this.deviceService
				.getDeviceInfo()
				.then((info) => {
					modelData.biosVersion = info.bios;
					modelData.serialNumber = info.sn;
					modelData.productName = info.productNo;
					modelData.machineModel = info.family;
					resolve(modelData);
				})
				.catch((error) => {
					this.logger.exception('[ExportResultService] getModelData', error);
					reject(error);
				});
		});

		return Promise.race([deviceServicePromise, timeoutPromise]);
	}

	private async prepareDataFromRecoverBadSectors(rbsResult: any) {
		const isRecoverBadSectors = true;
		const modulesData = this.hardwareScanService.getModulesRetrieved();
		const storageModules = modulesData.categoryList.find((module) => module.id === 'storage')
			.groupList;
		const preparedData: any = {};
		const preparedRbsDevices = [];

		rbsResult.items.map((device) => {
			const rbsDevice = {
				id: device.deviceId,
				name: device.name,
				module: device.module,
				icon: device.module.toLowerCase(),
				details: this.buildDetails(
					storageModules.find((module) => module.id === device.deviceId)
				),
				rbsDetails: device.details,
				resultModule: device.listTest[0].statusTest,
			};
			preparedRbsDevices.push(rbsDevice);
		});

		preparedData.resultModule = rbsResult.resultModule;
		preparedData.startDate = this.formatDateTime.transform(rbsResult.startDate);
		preparedData.endDate = this.formatDateTime.transform(rbsResult.date);
		preparedData.items = preparedRbsDevices;
		preparedData.model = await this.getModelData();
		preparedData.isRecoverBadSectors = isRecoverBadSectors;

		preparedData.environment = {
			experienceVersion: this.experienceVersion,
			shellVersion: this.shellVersion,
			bridgeVersion: this.bridgeVersion,
		};

		preparedData.resultTestsTitle = rbsResult.resultModule;
		preparedData.testSummary = this.calculateTestSummaryInfo(preparedData);

		return preparedData;
	}

	private populateTemplateOverallStatus(data: any): void {
		const headerTitle = this.document.getElementById('title');
		headerTitle.innerText = this.document.title = this.translate.transform(
			'hardwareScan.report.title'
		);
		const scanDateElement = this.document.getElementById('scan_date');
		const overallTestStatusDescElement = this.document.getElementById(
			'overall_test_status_desc'
		);
		const overallTestStatusIconElement = this.document.getElementById(
			'overall_test_status_icon'
		);
		scanDateElement.innerHTML = data.startDate;
		overallTestStatusDescElement.innerHTML = this.getStatusName(data.resultTestsTitle);
		overallTestStatusIconElement.classList.add(
			this.getIconClassFromStatus(data.resultTestsTitle)
		);
	}

	private populateTemplateEnvironmentSection(
		data: any,
		environmentItemsOrder: Array<string>
	): void {
		const environmentSectionTitle = this.document.getElementById('environment_title');
		const environmentInfoSectionItems = this.document.getElementById('environment_info_items');
		environmentSectionTitle.innerHTML = this.translate.transform(
			'hardwareScan.report.environmentTitle'
		);

		for (const key of environmentItemsOrder) {
			const value = data.environment[key];
			const div = this.createItemDiv(
				this.translate.transform('hardwareScan.report.environment.' + key),
				value
			);
			environmentInfoSectionItems.appendChild(div);
		}
	}

	private populateTemplateTestSummarySection(data: any): void {
		const testSummaryHeader = this.document.getElementById('test_summary_header');
		const testSummaryTitle = this.document.getElementById('test_summary_title');
		testSummaryTitle.innerHTML = this.translate.transform('hardwareScan.report.testResult');

		const testSummarySectionItems = this.document.getElementById('test_summary_info_items');
		const totalModulesTestedElement = this.document.getElementById('total_modules_tested');
		const divTotalModulesTestedTitle = this.createElement({
			elementType: 'span',
			innerHtml: this.translate.transform('hardwareScan.report.totalModulesTested'),
			classes: ['font_weight_600'],
		});
		divTotalModulesTestedTitle.append(': ');
		const divTotalModulesTestedValue = this.createElement({
			elementType: 'span',
			innerHtml: data.items.length,
			classes: ['font_weight_400'],
		});
		totalModulesTestedElement.appendChild(divTotalModulesTestedTitle);
		totalModulesTestedElement.appendChild(divTotalModulesTestedValue);

		data.testSummary = this.calculateTestSummaryInfo(data);

		for (const key of this.getScanStatusFiltered()) {
			const value = data.testSummary[this.getStatusFromStatusCode(key)] ?? 0;
			const spanTitle = this.createElement({
				elementType: 'span',
				innerHtml: this.translate.transform(
					'hardwareScan.' + this.getStatusFromStatusCode(key)
				),
				classes: ['font_weight_600'],
			});
			const spanValue = this.createElement({
				elementType: 'span',
				innerHtml: value,
				classes: ['font_weight_400'],
			});
			const col = this.createElement({
				elementType: 'div',
				innerHtml: undefined,
				classes: ['col', 'test_result_wrapper'],
			});

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
	}

	private populateTemplateStartAndEndTime(data: any): void {
		const divStartTimeTitle = this.document.getElementById('test_summary_start_time_title');
		const divStartTimeValue = this.document.getElementById('test_summary_start_time_value');
		divStartTimeTitle.innerHTML = this.translate.transform('hardwareScan.report.startDate');
		divStartTimeValue.innerHTML = data.startDate;

		const divEndTimeTitle = this.document.getElementById('test_summary_end_time_title');
		const divEndTimeValue = this.document.getElementById('test_summary_end_time_value');
		divEndTimeTitle.innerHTML = this.translate.transform('hardwareScan.report.endDate');
		divEndTimeValue.innerHTML = data.endDate;
	}

	private populateTemplateModuleSection(data: any): void {
		let count = 0;
		const modules = this.document.getElementById('modules');
		for (const item of data.items) {
			const module = this.createModuleDiv(item, count);
			modules.appendChild(module);
			count++;
		}
	}

	private populateTemplateModelSection(data: any, modelItemsOrder: Array<string>) {
		const isRecoverBadSectors = data.isRecoverBadSectors ?? false;
		const spanModel = this.document.getElementById('model');
		const machineModel = this.document.getElementById('machine_model');
		const machineInfoItems = this.document.getElementById('machine_info_items');

		spanModel.innerHTML = this.translate.transform('hardwareScan.report.modelTitle');
		machineModel.innerHTML = data.model.machineModel;

		// Set final result code data if non rbs data is received
		if (!isRecoverBadSectors) {
			const finalResultCodeSpan = this.document.getElementById('final_result_code_span');
			const finalResultCode = this.document.getElementById('final_result_code');
			finalResultCodeSpan.innerHTML =
				this.translate.transform('hardwareScan.finalResultCode') + ': ';
			finalResultCode.innerHTML = data.finalResultCode;
		}

		for (const key of modelItemsOrder) {
			if (key !== 'networkInterfaces') {
				const value = data.model[key];
				const div = this.createItemDiv(
					this.translate.transform('hardwareScan.report.model.' + key),
					value
				);
				machineInfoItems.appendChild(div);
			} else {
				for (const ni of data.model.networkInterfaces) {
					const div = this.createItemDiv(
						this.translate.transform('hardwareScan.report.model.' + ni.name) +
							' ' +
							ni.index,
						ni.mac
					);
					machineInfoItems.appendChild(div);
				}
			}
		}
	}

	/**
	 * Main function that will be create each needed element
	 *
	 * @param data A json object containing all data needed to export the results
	 */
	private populateTemplate(data: any) {
		const isRecoverBadSectors = data.isRecoverBadSectors ?? false;
		let environmentInfoItemsOrder = [];
		let modelItemsOrder = [];

		if (isRecoverBadSectors) {
			environmentInfoItemsOrder = ['experienceVersion', 'shellVersion', 'bridgeVersion'];
			modelItemsOrder = ['productName', 'serialNumber', 'biosVersion'];
		} else {
			modelItemsOrder = ['productName', 'serialNumber', 'networkInterfaces', 'biosVersion'];
			environmentInfoItemsOrder = [
				'applicationVersion',
				'pluginVersion',
				'experienceVersion',
				'shellVersion',
				'bridgeVersion',
			];
		}

		// OverallStatus and Header
		this.populateTemplateOverallStatus(data);

		// Model Section
		this.populateTemplateModelSection(data, modelItemsOrder);

		// Environment Section
		this.populateTemplateEnvironmentSection(data, environmentInfoItemsOrder);

		// Test Summary Section
		this.populateTemplateTestSummarySection(data);

		// StartTime and EndTime
		this.populateTemplateStartAndEndTime(data);

		// Modules information
		this.populateTemplateModuleSection(data);
	}

	private getNetworkInterfaces(networkInterfaces: any): any {
		const interfaces = [];
		networkInterfaces.forEach((interfaceInfo) => {
			interfaces.push([
				this.translate.transform('hardwareScan.report.model.' + interfaceInfo.name) +
					' ' +
					interfaceInfo.index,
				interfaceInfo.mac,
			]);
		});

		return interfaces;
	}

	private generateModelTable(
		doc: jsPDF,
		jsonData: any,
		startY: number,
		isRecoverBadSectors: boolean
	): void {
		(doc as any).autoTable({
			theme: 'plain',
			startY,
			didDrawCell: (data) => {
				if (data.column.index === 0) {
					doc.addImage(
						LogIcons.get('MODEL'),
						'PNG',
						data.cell.x,
						data.cell.y,
						this.componentIconSize,
						this.componentIconSize
					);
				}
			},
			columnStyles: {
				0: { cellWidth: this.componentIconSize, minCellHeight: this.componentIconSize },
				1: { fontSize: 16, valign: 'middle', cellPadding: 2 },
			},
			body: [['', this.translate.transform('hardwareScan.report.modelTitle')]],
		});
		startY = (doc as any).lastAutoTable.finalY;

		(doc as any).autoTable({
			startY: startY + 2,
			columnStyles: {
				0: this.firsColumnStyle,
			},
			bodyStyles: {
				fillColor: null,
			},
			alternateRowStyles: {
				fillColor: null,
			},
			head: [
				[
					{
						content: jsonData.model.machineModel,
						styles: {
							halign: 'left',
						},
					},
					{
						content: !isRecoverBadSectors
							? this.translate.transform('hardwareScan.finalResultCode') +
							  ': ' +
							  jsonData.finalResultCode
							: '',
						styles: {
							halign: 'right',
						},
					},
				],
			],
			body: [
				[
					this.translate.transform('hardwareScan.report.model.productName'),
					jsonData.model.productName,
				],
				[
					this.translate.transform('hardwareScan.report.model.serialNumber'),
					jsonData.model.serialNumber,
				],
				...(!isRecoverBadSectors
					? this.getNetworkInterfaces(jsonData.model.networkInterfaces)
					: []),
				[
					this.translate.transform('hardwareScan.report.model.biosVersion'),
					jsonData.model.biosVersion,
				],
			],
		});
	}

	private generateEnvironmentTable(
		doc: jsPDF,
		environmentData: any,
		startY: number,
		isRecoverBadSectors: boolean
	): void {
		(doc as any).autoTable({
			theme: 'plain',
			startY,
			didDrawCell: (data) => {
				if (data.column.index === 0) {
					doc.addImage(
						LogIcons.get('ENVIRONMENT'),
						'PNG',
						data.cell.x,
						data.cell.y,
						this.componentIconSize,
						this.componentIconSize
					);
				}
			},
			columnStyles: {
				0: { cellWidth: this.componentIconSize, minCellHeight: this.componentIconSize },
				1: { fontSize: 16, valign: 'middle', cellPadding: 2 },
			},
			body: [['', this.translate.transform('hardwareScan.report.environmentTitle')]],
		});
		startY = (doc as any).lastAutoTable.finalY;
		(doc as any).autoTable({
			startY: startY + 2,
			columnStyles: {
				0: this.firsColumnStyle,
			},
			bodyStyles: {
				fillColor: null,
			},
			alternateRowStyles: {
				fillColor: null,
			},
			head: [['', '']],
			body: [
				...(!isRecoverBadSectors
					? [
							[
								this.translate.transform(
									'hardwareScan.report.environment.applicationVersion'
								),
								environmentData.applicationVersion,
							],
							[
								this.translate.transform(
									'hardwareScan.report.environment.pluginVersion'
								),
								environmentData.pluginVersion,
							],
					  ]
					: []),
				[
					this.translate.transform('hardwareScan.report.environment.experienceVersion'),
					environmentData.experienceVersion,
				],
				[
					this.translate.transform('hardwareScan.report.environment.shellVersion'),
					environmentData.shellVersion,
				],
				[
					this.translate.transform('hardwareScan.report.environment.bridgeVersion'),
					environmentData.bridgeVersion,
				],
			],
		});
	}

	private getTestsResultsToTable(modules: any, isRecoverBadSectors: boolean): any {
		return modules.map((module) => {
			const currentName = isRecoverBadSectors
				? module.name
				: this.translate.transform(
						'hardwareScan.pluginTokens.' + module.module,
						module.module
				  );

			// This switch case defines the position where the status icon it will be draw in the future
			// the "x" indicate the column position in the test result table
			switch (module.resultModule) {
				case HardwareScanTestResult.Pass:
					return [currentName, 'x', '', '', '', ''];

				case HardwareScanTestResult.Fail:
					return [currentName, '', 'x', '', '', ''];

				case HardwareScanTestResult.Attention:
					return [currentName, '', '', 'x', '', ''];

				case HardwareScanTestResult.Cancelled:
					return [currentName, '', '', '', 'x', ''];

				case HardwareScanTestResult.Na:
					return [currentName, '', '', '', '', 'x'];

				default:
					return [currentName, '', '', '', '', ''];
			}
		});
	}

	private getModuleDetails(details: any): any {
		const detailsList = [];
		const detailsInfo = details.filter((detail) => detail.index === '');

		detailsInfo.forEach((detail) => {
			detailsList.push([
				this.translate.transform('hardwareScan.pluginTokens.' + detail.key, detail.key),
				detail.value,
			]);
		});

		return detailsList;
	}

	private generateResourcesTable(doc: jsPDF, values: any, title: string, startY: number): void {
		(doc as any).autoTable({
			startY: startY + 2,
			headStyles: {
				textColor: this.lightBlueColor,
				fillColor: null,
				fontSize: 10,
			},
			columnStyles: {
				0: this.firsColumnStyle,
				2: { halign: 'right' },
			},
			didParseCell: (data) => {
				if (data.column.index === 1) {
					data.cell.styles.font = this.setCorrectFont(
						data.cell.raw.content ?? data.cell.raw
					);
				}
			},
			head: [[title, '', '']],
			body: [...values],
		});
	}

	private generateTestsTable(doc: jsPDF, values: any, title: string, startY: number): void {
		const preparedList = values.map((test) => [
			this.translate.transform('hardwareScan.pluginTokens.' + test.name, test.name),
			test.startDate,
			this.translate.transform(
				'hardwareScan.' + this.getStatusFromStatusCode(test.statusTest)
			) +
				' (' +
				test.duration +
				's)',
			test.statusTest,
		]);

		(doc as any).autoTable({
			startY: startY + 2,
			headStyles: {
				textColor: this.lightBlueColor,
				fillColor: null,
				fontSize: 10,
			},
			columnStyles: {
				0: this.firsColumnStyle,
				2: { halign: 'right' },
				3: { cellWidth: this.statusIconSize * 2 },
			},
			didDrawCell: (data) => {
				if (data.row.section === 'body' && data.column.index === 3) {
					const oldFillColor = doc.getFillColor();
					doc.setFillColor(data.cell.styles.fillColor);
					doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
					doc.setFillColor(oldFillColor);

					doc.addImage(
						StatusIcons.get(toNumber(data.cell.raw)),
						'PNG',
						data.cell.x,
						data.cell.y + 1,
						this.statusIconSize,
						this.statusIconSize
					);
				}
			},
			head: [[title, '', '', '']],
			body: [...preparedList],
		});
	}

	private generateRbsTestsTable(doc: jsPDF, values: any, title: string, startY: number): void {
		const preparedList = values.map((result) => [
			this.translate.transform('hardwareScan.recoverBadSectors.' + result.key, result.key),
			result.value,
		]);

		(doc as any).autoTable({
			startY: startY + 2,
			headStyles: {
				textColor: this.lightBlueColor,
				fillColor: null,
				fontSize: 10,
			},
			columnStyles: {
				0: this.firsColumnStyle,
				1: { halign: 'left' },
			},
			head: [[title, '']],
			body: [...preparedList],
		});
	}

	private getResources(resources: any): any[] {
		const resourceList = [];
		const indexToken = this.translate.transform('hardwareScan.pluginTokens.INDEX');
		let currentIndex = resources[0].index;

		resourceList.push([indexToken, currentIndex]);
		resources.forEach((resource) => {
			if (resource.index !== currentIndex) {
				resourceList.push(['', '']);
				currentIndex = resource.index;
				resourceList.push([indexToken, currentIndex]);
			}

			resourceList.push([
				this.translate.transform('hardwareScan.pluginTokens.' + resource.key, resource.key),
				this.translate.transform(
					'hardwareScan.pluginTokens.' + resource.value,
					resource.value
				),
			]);
		});

		return resourceList;
	}

	private generateModulesTables(
		doc: jsPDF,
		modules: any,
		startY: number,
		isRecoverBadSectors: boolean
	): void {
		let currentStartPosition = startY;
		modules.forEach((module) => {
			currentStartPosition = (doc as any).lastAutoTable.finalY + 10;
			(doc as any).autoTable({
				theme: 'plain',
				startY: currentStartPosition,
				didDrawCell: (data) => {
					if (data.column.index === 0) {
						doc.addImage(
							ModulesIcons.get(module.icon.toUpperCase()),
							'PNG',
							data.cell.x,
							data.cell.y,
							this.componentIconSize,
							this.componentIconSize
						);
					}
				},
				columnStyles: {
					0: { cellWidth: this.componentIconSize, minCellHeight: this.componentIconSize },
					1: { fontSize: 16, valign: 'middle', cellPadding: 2 },
				},
				body: [
					[
						'',
						this.translate.transform(
							'hardwareScan.pluginTokens.' + module.module,
							module.module
						),
					],
				],
			});
			currentStartPosition = (doc as any).lastAutoTable.finalY;

			(doc as any).autoTable({
				margin: this.startX,
				startY: currentStartPosition + 2,
				columnStyles: {
					0: this.firsColumnStyle,
				},
				bodyStyles: {
					fillColor: null,
				},
				alternateRowStyles: {
					fillColor: null,
				},
				didParseCell: (data) => {
					if (data.column.index === 1) {
						data.cell.styles.font = this.setCorrectFont(
							data.cell.raw.content ?? data.cell.raw
						);
					}
				},
				head: [
					[
						{
							content: this.translate.transform(
								'hardwareScan.pluginTokens.' + module.name,
								module.name
							),
							styles: {
								halign: 'left',
								fillColor: this.darkBlueColor,
								textColor: this.whiteColor,
							},
						},
						{
							content: !isRecoverBadSectors
								? this.translate.transform('hardwareScan.resultCode') +
								  ': ' +
								  module.resultCode
								: '',
							styles: {
								halign: 'right',
							},
						},
					],
				],
				body: [...this.getModuleDetails(module.details)],
			});
			currentStartPosition = (doc as any).lastAutoTable.finalY + 10;

			if (isRecoverBadSectors) {
				this.generateRbsTestsTable(
					doc,
					module.rbsDetails,
					this.translate.transform('hardwareScan.recoverBadSectors.title').toUpperCase(),
					currentStartPosition
				);

				currentStartPosition = (doc as any).lastAutoTable.finalY + 10;
			}

			const resources = module.details.filter((resource) => resource.index !== '');
			if (resources.length) {
				this.generateResourcesTable(
					doc,
					this.getResources(resources),
					this.translate.transform('hardwareScan.report.resources').toUpperCase(),
					currentStartPosition
				);

				currentStartPosition = (doc as any).lastAutoTable.finalY + 10;
			}

			if (!isRecoverBadSectors) {
				this.generateTestsTable(
					doc,
					module.listTest,
					this.translate.transform('hardwareScan.report.tests').toUpperCase(),
					currentStartPosition
				);
			}
			currentStartPosition = (doc as any).lastAutoTable.finalY + 10;
		});
	}

	private getTestTableTitle(jsonData: any, status: HardwareScanTestResult): string {
		const statusName = HardwareScanTestResult[status].toLocaleLowerCase();
		const value = jsonData.testSummary[statusName] ?? 0;
		return this.translate.transform('hardwareScan.' + statusName) + ': ' + value;
	}

	private generateTestResultTable(
		doc: jsPDF,
		jsonData: any,
		startY: number,
		isRecoverBadSectors: boolean
	): void {
		(doc as any).autoTable({
			theme: 'plain',
			startY,
			didDrawCell: (data) => {
				if (data.column.index === 0) {
					doc.addImage(
						LogIcons.get('TESTSUMMARY'),
						'PNG',
						data.cell.x,
						data.cell.y,
						this.componentIconSize,
						this.componentIconSize
					);
				}
			},
			columnStyles: {
				0: { cellWidth: this.componentIconSize, minCellHeight: this.componentIconSize },
				1: { fontSize: 16, valign: 'middle', cellPadding: 2 },
			},
			body: [['', this.translate.transform('hardwareScan.report.testResult')]],
		});
		startY = (doc as any).lastAutoTable.finalY;

		jsonData.testSummary = this.calculateTestSummaryInfo(jsonData);
		(doc as any).autoTable({
			margin: this.startX,
			headStyles: { halign: 'center' },
			startY: startY + 3,
			columnStyles: {
				0: {
					cellWidth: 50,
				},
			},
			head: [
				[
					{
						content: this.translate.transform('hardwareScan.report.totalModulesTested'),
						styles: { halign: 'left' },
					},
					{
						content: this.getTestTableTitle(jsonData, HardwareScanTestResult.Pass),
					},
					{
						content: this.getTestTableTitle(jsonData, HardwareScanTestResult.Fail),
					},
					{
						content: this.getTestTableTitle(jsonData, HardwareScanTestResult.Attention),
					},
					{
						content: this.getTestTableTitle(jsonData, HardwareScanTestResult.Cancelled),
					},
					{
						content: this.getTestTableTitle(jsonData, HardwareScanTestResult.Na),
					},
				],
			],
			didDrawCell: (data) => {
				if (
					data.row.section === 'body' &&
					data.column.index > 0 &&
					data.cell.raw &&
					StatusIcons.has(data.column.index + 1) &&
					data.row.index < data.table.body.length - 2
				) {
					const oldFillColor = doc.getFillColor();
					doc.setFillColor(data.cell.styles.fillColor);
					doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
					doc.setFillColor(oldFillColor);

					doc.addImage(
						StatusIcons.get(data.column.index + 1),
						'PNG',
						data.cell.x + (data.cell.width - this.statusIconSize) / 2,
						data.cell.y + 1.5,
						this.statusIconSize,
						this.statusIconSize
					);
				}
			},
			body: [
				...this.getTestsResultsToTable(jsonData.items, isRecoverBadSectors),
				[
					{ content: this.translate.transform('hardwareScan.report.startDate') },
					{ content: jsonData.startDate, colSpan: 5 },
				],
				[
					{ content: this.translate.transform('hardwareScan.report.endDate') },
					{ content: jsonData.endDate, colSpan: 5 },
				],
			],
		});
	}

	private generateHeaderPdf(doc: jsPDF, title: string, jsonData: any, startY: number): void {
		(doc as any).autoTable({
			startY,
			theme: 'plain',
			bodyStyles: {
				cellPadding: 0,
			},
			willDrawCell: (data) => {
				switch (data.row.index) {
					case 0: {
						doc.addImage(
							LogIcons.get('HARDWAREDIAGNOSTICSLOG'),
							'PNG',
							data.cell.x,
							data.cell.y,
							this.logoSize,
							this.logoSize
						);
						data.cell.x += this.logoSize + 2;
						data.cell.y += (this.logoSize - data.cell.contentHeight) / 2;
						break;
					}
					case 1: {
						data.cell.x -= this.statusIconSize + 1;
						doc.addImage(
							StatusIcons.get(jsonData.resultTestsTitle),
							'PNG',
							data.cell.width + data.cell.x + 1,
							data.cell.y - 1,
							this.statusIconSize,
							this.statusIconSize
						);
						break;
					}
				}
			},
			body: [
				[
					{
						content: 'LENOVO VANTAGE',
						styles: { fontSize: 12, fontStyle: 'bold' },
					},
				],
				[
					{
						content: this.translate.transform(
							'hardwareScan.' +
								this.getStatusFromStatusCode(jsonData.resultTestsTitle)
						),
						styles: { halign: 'right', fontStyle: 'bold' },
					},
				],
				[
					{
						content: jsonData.startDate,
						styles: { halign: 'right' },
					},
				],
				[
					{
						content: title,
						styles: { fontSize: 22 },
					},
				],
			],
		});
	}

	private generatePdfReport(jsonData: any): any {
		const isRecoverBadSectors = jsonData.isRecoverBadSectors ?? false;

		const doc = new jsPDF();

		this.fonts.forEach((font) => {
			doc.addFileToVFS(font.id + '.ttf', font.data);
			doc.addFont(font.id + '.ttf', font.id, 'normal');
		});

		(jsPDF as any).autoTableSetDefaults({
			margin: 10,
			showHead: 'firstPage',
			headStyles: {
				fillColor: this.darkBlueColor,
				textColor: this.whiteColor,
			},
			bodyStyles: {
				textColor: this.darkBlueColor,
			},
			styles: {
				font: this.currentFont,
			},
			didParseCell: (data) => {
				const value = this.reverseForHebrew(data);

				if (value !== undefined) {
					data.cell.text = value;
				}
			},
		});
		let startY = 10;

		this.generateHeaderPdf(
			doc,
			this.translate.transform('hardwareScan.report.title'),
			jsonData,
			startY
		);

		startY = (doc as any).lastAutoTable.finalY + 10;
		this.generateModelTable(doc, jsonData, startY, isRecoverBadSectors);

		startY = (doc as any).lastAutoTable.finalY + 10;
		this.generateEnvironmentTable(doc, jsonData.environment, startY, isRecoverBadSectors);

		startY = (doc as any).lastAutoTable.finalY + 10;
		this.generateTestResultTable(doc, jsonData, startY, isRecoverBadSectors);

		startY = (doc as any).lastAutoTable.finalY + 10;
		this.generateModulesTables(doc, jsonData.items, startY, isRecoverBadSectors);

		return doc.output('arraybuffer');
	}

	private generateHtmlReport(jsonData: any): Promise<string> {
		return new Promise((resolve, reject) => {
			this.http
				.get(ExportResultsService.TEMPLATE_PATH, { responseType: 'text' })
				.toPromise()
				.then((htmlData) => {
					this.document = new DOMParser().parseFromString(htmlData, 'text/html');
					this.populateTemplate(jsonData);
					resolve(this.document.documentElement.outerHTML);
				})
				.catch((error) => {
					this.logger.exception('[ExportResultService] generateHtmlReport', error);
					reject(error);
				});
		});
	}

	private async exportReportToFile(reportFileName: string, dataFormatted: any): Promise<string> {
		let pathSaved = '';
		const fileName = reportFileName + '_' + this.getDateAndHour();
		const picker = new window.Windows.Storage.Pickers.FileSavePicker();
		picker.suggestedFileName = fileName;

		// Display selected extension in file picker
		if (this.exportExtensionSelected === ExportLogExtensions.html) {
			picker.fileTypeChoices.insert('Hyper Text Markup Language File', ['.html']);
			const file = await picker.pickSaveFileAsync();
			if (file !== null) {
				await window.Windows.Storage.FileIO.writeTextAsync(file, dataFormatted);
				pathSaved = file.path;
			} else {
				this.logger.info('File is null');
			}
		} else {
			picker.fileTypeChoices.insert('Portable Document Format', ['.pdf']);
			const file = await picker.pickSaveFileAsync();
			if (file !== null) {
				const dataArray = new Uint8Array(dataFormatted);
				await window.Windows.Storage.FileIO.writeBytesAsync(file, dataArray);
				pathSaved = file.path;
			} else {
				this.logger.info('File is null');
			}
		}

		if (pathSaved === '') {
			throw new Error('Operation cancelled');
		}

		return pathSaved;
	}

	private async validateDocumentsLibrary(): Promise<boolean> {
		const permissionDeniedErrorNumber = -2147024891; // Error code got from error object

		try {
			await window.Windows.Storage.KnownFolders.documentsLibrary;
		} catch (error) {
			// I'll only return false if this specific error happens
			// Any other error will be treated as "generic error"
			if (error.number === permissionDeniedErrorNumber) {
				return false;
			}
		}
		return true;
	}

	private setCorrectFont(content: string): any {
		const fontByInterval = [
			{ font: FontTypes.notokr, range: /[\u3131-\uD79D]/ }, // korean
			{ font: FontTypes.notosc, range: /[\u4e00-\u9eff]/ }, // chinese and japanese
			{ font: FontTypes.amiri, range: /[\u0600-\u06FF]/ }, // arabic
			{ font: FontTypes.rubik, range: this.hebrewUnicodeRange }, // hebrew
			{ font: FontTypes.rubik, range: /[\u0370-\u03FF]/ }, // greek
			{ font: FontTypes.rubik, range: /[\u0161\u0111\u010D\u0107\u017E]/ }, // croatian or others
			{ font: FontTypes.noto, range: /[^\u0000-\u00ff]/ }, // default
		];

		return fontByInterval.find((data) => data.range.test(content))?.font ?? FontTypes.noto;
	}

	// Method used as workaround when content is in hebrew, because jspdf print it reversed
	private reverseForHebrew(data: any): string {
		const content = data.cell.raw?.content ?? data.cell?.raw;

		if (this.currentLanguage === LanguageCode.hebrew && this.hebrewUnicodeRange.test(content)) {
			// Avoid wrong positioning of : and () characters
			const specialCharacters = (word: string) => {
				let currentValue = word;
				const lastElement = word.slice(-1);

				if (lastElement === ':') {
					currentValue = currentValue.slice(0, -1);
					currentValue = ':' + currentValue;
				} else if (lastElement === ')') {
					currentValue = currentValue.slice(1, -1);
					currentValue = ')' + currentValue + '(';
				}

				return [...currentValue];
			};

			return content
				.split(' ')
				.map((word: string) => specialCharacters(word).reverse().join(''))
				.join(' ');
		}

		return undefined;
	}
}
