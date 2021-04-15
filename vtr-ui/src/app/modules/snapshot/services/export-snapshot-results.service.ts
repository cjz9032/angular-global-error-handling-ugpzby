import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LogType } from 'src/app/enums/export-log.enum';
import { TranslateDefaultValueIfNotFoundPipe } from 'src/app/pipe/translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';
import { CommonExportLogService } from 'src/app/services/export-log/common-export-log.service';
import { logIcons } from 'src/app/services/export-log/utils/icons/log-tables';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SnapshotService } from './snapshot.service';
import { snapshotModulesIcons } from './utils/icons/snapshot';

@Injectable({
	providedIn: 'root',
})
export class ExportSnapshotResultsService extends CommonExportLogService {
	// Colors used to build pdf
	private RgbLightGreyColor = [214, 219, 223];

	private optionsToConvertDate = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	private metricsService: any;

	constructor(
		private snapshotService: SnapshotService,
		private translate: TranslateDefaultValueIfNotFoundPipe,
		http: HttpClient,
		logger: LoggerService,
		shellService: VantageShellService
	) {
		super(http, logger, shellService);

		this.metricsService = shellService.getMetrics();
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
		const hardwareListTitle = this.document.getElementById('title_hardware_components');
		const softwareList = this.document.getElementById('modules_software_components');
		const softwareListTitle = this.document.getElementById('title_software_components');

		hardwareListTitle.innerHTML = this.translate.transform('snapshot.hardwareListTitle');
		softwareListTitle.innerHTML = this.translate.transform('snapshot.softwareListTitle');

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
				classes: ['details_light_blue_title', 'font_weight_600'],
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
			baselineDate.toLocaleString(undefined, this.optionsToConvertDate as any),
			lastSnapshotDate.toLocaleString(undefined, this.optionsToConvertDate as any),
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

	private generateHeaderPdf(doc: jsPDF, title: string, startY: number): void {
		(doc as any).autoTable({
			startY,
			theme: 'plain',
			bodyStyles: {
				cellPadding: 0,
			},
			willDrawCell: (data) => {
				switch (data.row.index) {
					case 0:
						doc.addImage(
							logIcons.get('HARDWAREDIAGNOSTICSLOG'),
							'PNG',
							data.cell.x,
							data.cell.y,
							this.logoSize,
							this.logoSize
						);
						data.cell.x += this.logoSize + 2;
						data.cell.y += (this.logoSize - data.cell.contentHeight) / 2;
						break;

					case 1:
						data.cell.y += this.logoSize;
						break;
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
						content: title,
						styles: { fontSize: 22 },
					},
				],
			],
		});
	}

	private generateModelTable(doc: jsPDF, modelData: any, startY: number): void {
		(doc as any).autoTable({
			theme: 'plain',
			startY,
			didDrawCell: (data) => {
				if (data.column.index === 0) {
					doc.addImage(
						logIcons.get('MODEL'),
						'PNG',
						data.cell.x,
						data.cell.y,
						this.componentIconSize,
						this.componentIconSize
					);

					doc.setDrawColor(
						this.RgbLightGreyColor[0],
						this.RgbLightGreyColor[1],
						this.RgbLightGreyColor[2]
					);
					doc.line(
						data.cursor.x,
						data.cursor.y + this.componentIconSize + 3,
						data.cursor.x + 190, // A4 size
						data.cursor.y + this.componentIconSize + 3
					);
				}
			},
			willDrawCell: (data) => {
				const rows = data.table.body;

				if (data.row.index === rows.length - 1) {
					doc.setFillColor(0, 0, 0);
				}
			},
			columnStyles: {
				0: { cellWidth: this.componentIconSize, minCellHeight: this.componentIconSize },
				1: { fontSize: 16, valign: 'middle', cellPadding: 2 },
			},
			body: [['', this.translate.transform('snapshot.report.modelTitle')]],
		});
		startY = (doc as any).lastAutoTable.finalY + 3;

		(doc as any).autoTable({
			startY: startY + 2,
			columnStyles: {
				0: this.firsColumnStyle,
			},
			head: [[modelData.machineModel, '']],
			body: [
				[
					this.translate.transform('snapshot.report.model.productName'),
					modelData.productName,
				],
				[
					this.translate.transform('snapshot.report.model.serialNumber'),
					modelData.serialNumber,
				],
				[
					this.translate.transform('snapshot.report.model.biosVersion'),
					modelData.biosVersion,
				],
			],
		});
	}

	private generateEnvironmentTable(doc: jsPDF, environmentData: any, startY: number): void {
		(doc as any).autoTable({
			theme: 'plain',
			startY,
			didDrawCell: (data) => {
				if (data.column.index === 0) {
					doc.addImage(
						logIcons.get('ENVIRONMENT'),
						'PNG',
						data.cell.x,
						data.cell.y,
						this.componentIconSize,
						this.componentIconSize
					);

					doc.setDrawColor(
						this.RgbLightGreyColor[0],
						this.RgbLightGreyColor[1],
						this.RgbLightGreyColor[2]
					);
					doc.line(
						data.cursor.x,
						data.cursor.y + this.componentIconSize + 3,
						data.cursor.x + 190, // A4 size
						data.cursor.y + this.componentIconSize + 3
					);
				}
			},
			columnStyles: {
				0: { cellWidth: this.componentIconSize, minCellHeight: this.componentIconSize },
				1: { fontSize: 16, valign: 'middle', cellPadding: 2 },
			},
			body: [['', this.translate.transform('snapshot.report.environmentTitle')]],
		});
		startY = (doc as any).lastAutoTable.finalY + 3;

		(doc as any).autoTable({
			startY: startY + 2,
			columnStyles: {
				0: this.firsColumnStyle,
			},
			body: [
				[
					this.translate.transform('snapshot.report.environment.experienceVersion'),
					environmentData.experienceVersion,
				],
				[
					this.translate.transform('snapshot.report.environment.shellVersion'),
					environmentData.shellVersion,
				],
				[
					this.translate.transform('snapshot.report.environment.bridgeVersion'),
					environmentData.bridgeVersion,
				],
				[
					this.translate.transform('snapshot.report.environment.addinVersion'),
					environmentData.addinVersion,
				],
			],
		});
	}

	private generateModulesTables(
		doc: jsPDF,
		modules: any,
		startY: number,
		componentTitle: string
	): void {
		let currentStartPosition = startY;

		// Component title
		(doc as any).autoTable({
			theme: 'plain',
			startY: currentStartPosition,
			bodyStyles: {
				cellPadding: 0,
			},
			columnStyles: {
				0: {
					fontSize: 16,
					textColor: this.lightBlueColor,
				},
			},
			body: [[componentTitle]],
		});

		currentStartPosition = (doc as any).lastAutoTable.finalY + 1;

		modules.forEach((module) => {
			currentStartPosition = (doc as any).lastAutoTable.finalY + 10;

			if (module.content.info.Items.length <= 0) {
				return;
			}

			// Table title
			(doc as any).autoTable({
				theme: 'plain',
				startY: currentStartPosition,
				didDrawCell: (data) => {
					if (data.column.index === 0) {
						doc.addImage(
							snapshotModulesIcons.get(module.name.toUpperCase()),
							'PNG',
							data.cell.x,
							data.cell.y,
							this.componentIconSize,
							this.componentIconSize
						);

						doc.setDrawColor(
							this.RgbLightGreyColor[0],
							this.RgbLightGreyColor[1],
							this.RgbLightGreyColor[2]
						);
						doc.line(
							data.cursor.x,
							data.cursor.y + this.componentIconSize + 3,
							data.cursor.x + 190, // A4 size
							data.cursor.y + this.componentIconSize + 3
						);
					}
				},
				columnStyles: {
					0: { cellWidth: this.componentIconSize, minCellHeight: this.componentIconSize },
					1: { fontSize: 16, valign: 'middle', cellPadding: 2 },
				},
				body: [['', this.translate.transform('snapshot.components.' + module.name)]],
			});

			currentStartPosition = (doc as any).lastAutoTable.finalY + 3;

			(doc as any).autoTable({
				margin: this.startX,
				startY: currentStartPosition + 2,
				columnStyles: {
					0: this.firsColumnStyle,
				},
				didParseCell: (data) => {
					if (data.column.index > 0 && data.cell.raw) {
						data.cell.styles.font = this.setCorrectFont(
							data.cell.raw.content ?? data.cell.raw
						);
					}
				},
				head: [
					[
						{
							content: ' ',
						},
						{
							content: this.translate.transform('snapshot.baselineSnapshot'),
						},
						{
							content: this.translate.transform('snapshot.lastSnapshot'),
						},
					],
				],
				body: [
					[
						this.translate.transform('snapshot.properties.UpdatedDate'),
						module.content.info.BaselineDate,
						module.content.info.LastSnapshotDate,
					],
					...this.getModuleDetails(module.content.info),
				],
			});
			currentStartPosition = (doc as any).lastAutoTable.finalY + 10;
		});
	}

	private getModuleDetails(moduleInfo: any): any {
		const detailsList = [];
		const lastItem = moduleInfo.Items[moduleInfo.Items.length - 1];

		moduleInfo.Items.forEach((moduleItem: any) => {
			moduleItem.Properties.forEach((propertie: any) => {
				let currentValue = propertie.CurrentValue;

				if (propertie.BaseValue !== propertie.CurrentValue) {
					currentValue = {
						content: propertie.CurrentValue,
						styles: {
							textColor: this.lightBlueColor,
						},
					};
				}

				detailsList.push([
					this.translate.transform('snapshot.properties.' + propertie.PropertyName),
					propertie.BaseValue,
					currentValue,
				]);
			});

			if (lastItem !== moduleItem) {
				detailsList.push([' ', ' ', ' ']);
			}

			if (moduleItem.SubDevices) {
				detailsList.push([' ', ' ', ' ']);
				detailsList.push(...this.getModuleDetails({ Items: moduleItem.SubDevices }));
			}
		});

		return detailsList;
	}

	protected populatePdf(doc: jsPDF, jsonData: any): void {
		let startY = 10;

		this.generateHeaderPdf(doc, this.translate.transform('snapshot.title'), startY);

		startY = (doc as any).lastAutoTable.finalY + 20;
		this.generateModelTable(doc, jsonData.model, startY);

		startY = (doc as any).lastAutoTable.finalY + 10;
		this.generateEnvironmentTable(doc, jsonData.environment, startY);

		startY = (doc as any).lastAutoTable.finalY + 10;
		this.generateModulesTables(
			doc,
			jsonData.hardwareComponents,
			startY,
			this.translate.transform('snapshot.hardwareListTitle')
		);

		startY = (doc as any).lastAutoTable.finalY + 10;
		this.generateModulesTables(
			doc,
			jsonData.softwareComponents,
			startY,
			this.translate.transform('snapshot.softwareListTitle')
		);
	}

	protected populateHtml(jsonData: any) {
		let environmentInfoItemsOrder = [];
		let modelItemsOrder = [];
		const fileTitle = this.document.getElementById('title');

		fileTitle.innerHTML = this.translate.transform('snapshot.title');

		modelItemsOrder = ['productName', 'serialNumber', 'biosVersion'];
		environmentInfoItemsOrder = [
			'experienceVersion',
			'shellVersion',
			'bridgeVersion',
			'addinVersion',
		];

		// Model Section
		this.populateTemplateModelSection(jsonData, modelItemsOrder);

		// Environment Section
		this.populateTemplateEnvironmentSection(jsonData, environmentInfoItemsOrder);

		// Hardware and Software List Section
		this.populateTemplateModulesListSection(jsonData);
	}

	protected prepareData(logType?: LogType): Promise<any> {
		return this.prepareDataFromScanLog();
	}
}
