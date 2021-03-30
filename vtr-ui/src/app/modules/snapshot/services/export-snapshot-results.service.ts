import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SnapshotService } from './snapshot.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { TranslateDefaultValueIfNotFoundPipe } from 'src/app/pipe/translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { ExportLogExtensions, ExportLogErrorStatus } from 'src/app/enums/export-log.enum';

declare let window;

@Injectable({
	providedIn: 'root',
})
export class ExportSnapshotResultsService {
	public static readonly METRICS_SUCCESS_RESULT = 'Success';
	public static readonly METRICS_FAIL_RESULT = 'Fail';

	private static readonly TEMPLATE_PATH =
		'assets/templates/snapshot/snapshot-results-template.html';

	private shellVersion: string;
	private experienceVersion: string;
	private bridgeVersion: string;
	private machineModel: string;
	private serialNumber: string;
	private biosVersion: string;
	private productName: string;

	private exportExtensionSelected = ExportLogExtensions.html;
	private optionsToConvertDate = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	private document: HTMLDocument;
	private metricsService: any;

	constructor(
		private http: HttpClient,
		private logger: LoggerService,
		private snapshotService: SnapshotService,
		private shellService: VantageShellService,
		private translate: TranslateDefaultValueIfNotFoundPipe
	) {
		this.metricsService = shellService.getMetrics();

		// Consult experienceVersion
		this.experienceVersion = environment.appVersion;

		// Consult shellVersion
		if (window.Windows) {
			const packageVersion = window.Windows.ApplicationModel.Package.current.id.version;
			this.shellVersion = `${packageVersion.major}.${packageVersion.minor}.${packageVersion.build}.${packageVersion.revision}`;
		}

		// Consult Machine Information
		this.shellService
			.getSysinfo()
			.getMachineInfo()
			.then((info) => {
				this.machineModel = info?.family;
				this.serialNumber = info?.serialnumber;
				this.biosVersion = info?.biosVersion;
				this.productName = info?.mtm;
			});

		// Consult bridgeVersion
		const jsBridgeVersion = this.shellService.getVersion();
		if (
			document.location.href.indexOf('stage') >= 0 ||
			document.location.href.indexOf('vantage.csw.') >= 0
		) {
			this.bridgeVersion = jsBridgeVersion ? jsBridgeVersion.split('-')[0] : '';
		} else {
			this.bridgeVersion = jsBridgeVersion ? jsBridgeVersion : '';
		}
	}

	public async exportSnapshotResults() {
		try {
			let dataFormatted;
			const reportFileName = 'SnapshotLog';
			const dataPrepared = await this.prepareDataFromScanLog();
			if (this.exportExtensionSelected === ExportLogExtensions.html) {
				dataFormatted = await this.generateHtmlReport(dataPrepared);
			} else {
				// Include pdf generate function here
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

	public sendTaskActionMetrics(
		taskCount: number,
		taskParam: string,
		taskResult: any,
		taskDuration: number
	) {
		const data = {
			ItemType: 'TaskAction',
			TaskName: 'ExportLog',
			TaskCount: taskCount,
			TaskResult: taskResult,
			TaskParam: taskParam,
			TaskDuration: taskDuration,
		};
		if (this.metricsService) {
			this.metricsService.sendAsync(data);
		}
	}

	/**
	 * Retrieve the css class which should be used in the module icon
	 *
	 * @param moduleId The name of the module
	 */
	private getIconClassFromModuleId(moduleId: string): string {
		switch (moduleId) {
			case 'DisplayDevices':
				return 'display_icon';
			case 'HardDrives':
				return 'hard_drive_icon';
			case 'Keyboards':
				return 'keyboard_icon';
			case 'Memory':
				return 'memory_icon';
			case 'Motherboard':
				return 'motherboard_icon';
			case 'MouseDevices':
				return 'mouse_icon';
			case 'Network':
				return 'network_icon';
			case 'CdRomDrives':
				return 'cd_rom_icon';
			case 'Printers':
				return 'printer_icon';
			case 'Processors':
				return 'processor_icon';
			case 'SoundCards':
				return 'sound_card_icon';
			case 'VideoCards':
				return 'video_card_icon';
			case 'Programs':
				return 'program_icon';
			case 'OperatingSystems':
				return 'operating_system_icon';
			case 'StartupPrograms':
				return 'startup_program_icon';
			case 'WebBrowsers':
				return 'web_browser_icon';
			default:
				return 'processor_icon';
		}
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
			// Include pdf save file function here
		}

		if (pathSaved === '') {
			throw new Error('Operation cancelled');
		}

		return pathSaved;
	}

	private generateHtmlReport(jsonData: any): Promise<string> {
		return new Promise((resolve, reject) => {
			this.http
				.get(ExportSnapshotResultsService.TEMPLATE_PATH, { responseType: 'text' })
				.toPromise()
				.then((htmlData) => {
					this.document = new DOMParser().parseFromString(htmlData, 'text/html');
					this.populateTemplate(jsonData);
					resolve(this.document.documentElement.outerHTML);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	private async prepareDataFromScanLog(): Promise<any> {
		const preparedData: any = {};
		preparedData.hardwareComponents = [];
		preparedData.softwareComponents = [];

		preparedData.model = {
			machineModel: this.machineModel,
			serialNumber: this.serialNumber,
			biosVersion: this.biosVersion,
			productName: this.productName,
		};

		preparedData.environment = {
			experienceVersion: this.experienceVersion,
			shellVersion: this.shellVersion,
			bridgeVersion: this.bridgeVersion,
			addinVersion: this.snapshotService.addinVersion,
		};

		this.snapshotService.getSoftwareComponentsList().forEach((key) => {
			preparedData.softwareComponents.push({
				name: key,
				content: this.snapshotService.snapshotInfo[key],
			});
		});

		this.snapshotService.getHardwareComponentsList().forEach((key) => {
			preparedData.hardwareComponents.push({
				name: key,
				content: this.snapshotService.snapshotInfo[key],
			});
		});

		return preparedData;
	}

	/**
	 * Main function that will be create each needed element
	 *
	 * @param data A json object containing all data needed to export the results
	 */
	private populateTemplate(data: any) {
		let environmentInfoItemsOrder = [];
		let modelItemsOrder = [];

		modelItemsOrder = ['productName', 'serialNumber', 'biosVersion'];
		environmentInfoItemsOrder = [
			'experienceVersion',
			'shellVersion',
			'bridgeVersion',
			'addinVersion',
		];

		// Model Section
		this.populateTemplateModelSection(data, modelItemsOrder);

		// Environment Section
		this.populateTemplateEnvironmentSection(data, environmentInfoItemsOrder);

		// Hardware and Software List Section
		this.populateTemplateModulesListSection(data);
	}

	private populateTemplateModelSection(data: any, modelItemsOrder: Array<string>) {
		let grayItem = true;

		const spanModel = this.document.getElementById('model');
		const machineModel = this.document.getElementById('machine_model');
		const machineInfoItems = this.document.getElementById('machine_info_items');

		spanModel.innerHTML = this.translate.transform('snapshot.report.modelTitle');
		machineModel.innerHTML = data.model.machineModel;

		for (const key of modelItemsOrder) {
			const value = data.model[key];
			const div = this.createItemDiv(
				this.translate.transform('snapshot.report.model.' + key),
				value,
				grayItem
			);
			machineInfoItems.appendChild(div);
			grayItem = !grayItem;
		}
	}

	private populateTemplateEnvironmentSection(
		data: any,
		environmentItemsOrder: Array<string>
	): void {
		let grayItem = true;

		const environmentSectionTitle = this.document.getElementById('environment_title');
		const environmentInfoSectionItems = this.document.getElementById('environment_info_items');
		environmentSectionTitle.innerHTML = this.translate.transform(
			'snapshot.report.environmentTitle'
		);

		for (const key of environmentItemsOrder) {
			const value = data.environment[key];
			const div = this.createItemDiv(
				this.translate.transform('snapshot.report.environment.' + key, key),
				value,
				grayItem
			);
			environmentInfoSectionItems.appendChild(div);
			grayItem = !grayItem;
		}
	}

	private populateTemplateModulesListSection(data: any) {
		let count = 0;
		const hardwareList = this.document.getElementById('modules_hardware_components');
		const softwareList = this.document.getElementById('modules_software_components');

		for (const item of data.hardwareComponents) {
			if (item.content.info.Items.length > 0) {
				const module = this.createModuleDiv(item, count);
				hardwareList.appendChild(module);
				count++;
			}
		}

		count = 0;
		for (const item of data.softwareComponents) {
			if (item.content.info.Items.length > 0) {
				const module = this.createModuleDiv(item, count);
				softwareList.appendChild(module);
				count++;
			}
		}
	}

	/**
	 * Used to create a details block style div, applying the right css style.
	 *
	 * @param name The value of the left span inside the div.
	 * @param value The value of the right/center span inside the div.
	 * @param secondValue The value of the right inside the div.
	 * @param gray A boolean indicating whether the div background should be gray or not.
	 */
	private createItemDivDetails(
		name: string,
		value: string,
		secondValue: string,
		gray = false,
		isDifferent = false
	) {
		let itemSecondValue;

		// If name is empty, change the css to especify the details title.
		const classeProperty = name ? 'item_value' : 'details_light_blue_title';

		// Create elements to append in the div
		const itemName = this.createElement({
			elementType: 'span',
			innerHtml: name,
			classes: ['font_weight_600', 'capitalize_text', 'item_description'],
		});
		const itemValue = this.createElement({
			elementType: 'span',
			innerHtml: value,
			classes: [classeProperty],
		});

		if (!isDifferent) {
			itemSecondValue = this.createElement({
				elementType: 'span',
				innerHtml: secondValue,
				classes: [classeProperty],
			});
		} else {
			itemSecondValue = this.createElement({
				elementType: 'span',
				innerHtml: secondValue,
				classes: ['details_light_blue_title'],
			});
		}

		// Create the div main element
		const div = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['item'],
		});

		// Append the previous elements in the div
		div.appendChild(itemName);
		div.appendChild(itemValue);
		div.appendChild(itemSecondValue);

		// Defines the div background
		if (gray) {
			div.classList.add('bg_gray');
		}

		return div;
	}

	/**
	 * Helper function to create a "key: value" style div, applying the right css style.
	 *
	 * @param name The value of the left span inside the div.
	 * @param value The value of the right/center span inside the div.
	 * @param gray A boolean indicating whether the div background should be gray or not
	 */
	private createItemDiv(name: string, value: string, gray = false): Element {
		// Create elements to append in the div
		const itemName = this.createElement({
			elementType: 'span',
			innerHtml: name,
			classes: ['font_weight_600', 'capitalize_text', 'item_description'],
		});
		const itemValue = this.createElement({
			elementType: 'span',
			innerHtml: value,
			classes: ['item_value'],
		});

		// Create the div main element
		const div = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['item'],
		});

		// Append the previous elements in the div
		div.appendChild(itemName);
		div.appendChild(itemValue);

		// Defines the div background
		if (gray) {
			div.classList.add('bg_gray');
		}

		return div;
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
	 * Helper function to create a div representing a whole module
	 *
	 * @param item A object containing the module's information
	 * @param moduleCount A number to be used as identify to the module
	 */
	private createModuleDiv(item: any, moduleCount: number): Element {
		let grayItem = true;
		const baselineDate = new Date(item.content.info.BaselineDate + ' UTC');
		const lastSnapshotDate = new Date(item.content.info.LastSnapshotDate + ' UTC');

		// Module Section Title and icon
		const spanModuleTitle = this.createElement({
			elementType: 'span',
			innerHtml: this.translate.transform('snapshot.components.' + item.name, item.name),
			classes: ['font_weight_600', 'capitalize_text', 'section_title'],
		});
		const divModuleIcon = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['module_icon', this.getIconClassFromModuleId(item.name)],
		});
		const divModuleTitle = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['content_title', 'center_content'],
		});
		divModuleTitle.id = item.name.toLowerCase() + '-' + moduleCount;
		divModuleTitle.appendChild(divModuleIcon);
		divModuleTitle.appendChild(spanModuleTitle);

		// Separator
		const hrSeparator = this.document.createElement('hr');

		// Details titles
		const titleDetailsModule = this.createItemDivDetails(
			'',
			this.translate.transform('snapshot.baselineSnapshot'),
			this.translate.transform('snapshot.lastSnapshot')
		);

		// Details div items
		const divModuleDetails = this.document.createElement('div');

		// Create update line module information
		const updateDateModule = this.createItemDivDetails(
			this.translate.transform('snapshot.properties.UpdatedDate'),
			baselineDate.toLocaleString(undefined, this.optionsToConvertDate),
			lastSnapshotDate.toLocaleString(undefined, this.optionsToConvertDate),
			grayItem
		);

		divModuleDetails.appendChild(hrSeparator);
		divModuleDetails.appendChild(titleDetailsModule);
		divModuleDetails.appendChild(updateDateModule);

		// Create the details lines to properties
		for (const device of item.content.info.Items) {
			for (const property of device.Properties) {
				grayItem = !grayItem;

				const divProperty = this.createItemDivDetails(
					this.translate.transform(
						'snapshot.properties.' + property.PropertyName,
						property.PropertyName
					),
					property.BaseValue,
					property.CurrentValue,
					grayItem,
					property.IsDifferent
				);

				divModuleDetails.appendChild(divProperty);
			}

			// Create a separator between properties
			grayItem = false;
			let divPropertyItem = this.createItemDiv('', '', grayItem);
			divModuleDetails.appendChild(divPropertyItem);

			if (device.SubDevices != null) {
				for (const subDevice of device.SubDevices) {
					for (const property of subDevice.Properties) {
						grayItem = !grayItem;

						const divProperty = this.createItemDivDetails(
							this.translate.transform(
								'snapshot.properties.' + property.PropertyName,
								property.PropertyName
							),
							property.BaseValue,
							property.CurrentValue,
							grayItem,
							property.IsDifferent
						);
						divModuleDetails.appendChild(divProperty);
					}

					// Create a separator between properties
					grayItem = false;
					divPropertyItem = this.createItemDiv('', '', grayItem);
					divModuleDetails.appendChild(divPropertyItem);
				}
			}
		}

		// Whole module div
		const divModule = this.createElement({
			elementType: 'div',
			innerHtml: undefined,
			classes: ['section'],
		});
		divModule.classList.add('module');
		divModule.appendChild(divModuleTitle);
		divModule.appendChild(divModuleDetails);

		return divModule;
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
}
