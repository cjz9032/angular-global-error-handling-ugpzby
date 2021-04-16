import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import {
	ExportLogErrorStatus,
	ExportLogExtensions,
	FontTypes,
	LanguageCode,
	LogType,
} from 'src/app/enums/export-log.enum';
import { environment } from 'src/environments/environment';
import { LoggerService } from '../logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

declare let window;

interface IFont {
	id: string;
	data: string;
}

export abstract class CommonExportLogService {
	protected exportExtensionSelected = ExportLogExtensions.html;
	protected currentLogType: LogType;

	// Application attributes
	protected experienceVersion: string;
	protected shellVersion: string;
	protected bridgeVersion: string;

	// Machine attributes
	protected machineModel: string;
	protected serialNumber: string;
	protected biosVersion: string;
	protected productName: string;

	// Attributes to build pdf
	private hebrewUnicodeRange = /[\u0590-\u05FF]/;
	protected darkBlueColor = '#34495E';
	protected lightBlueColor = '#4A81FD';
	protected whiteColor = '#FFF';
	protected currentFont = FontTypes.noto;
	protected currentLanguage: string;
	protected fonts: Array<IFont> = new Array<IFont>();
	protected componentIconSize = 10;
	protected logoSize = 10;
	protected startX = 10;
	protected firsColumnStyle = {
		cellWidth: 75,
		fontStyle: 'bold',
		halign: 'left',
	};

	// Atributes to html
	protected document: HTMLDocument;

	constructor(
		protected http: HttpClient,
		protected logger: LoggerService,
		protected shellService: VantageShellService
	) {
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

		this.experienceVersion = environment.appVersion;

		// Consult Machine Information
		try {
			this.shellService
				.getSysinfo()
				.getMachineInfo()
				.then((info) => {
					this.machineModel = info?.family;
					this.serialNumber = info?.serialnumber;
					this.biosVersion = info?.biosVersion;
					this.productName = info?.mtm;
					this.currentLanguage = info?.locale;

					this.loadFonts(this.currentLanguage);
				});
		} catch (error) {
			logger.error('[Export Log] Could not load environment info', error);
		}
	}

	/**
	 * Function that will export a log file
	 *
	 * @param logType value to differenciate log type
	 */
	public async exportLog(logType: LogType): Promise<[ExportLogErrorStatus, string]> {
		try {
			let dataFormatted: any;
			this.currentLogType = logType;
			const reportFileName = logType.valueOf();
			const dataPrepared = await this.prepareData();

			if (this.exportExtensionSelected === ExportLogExtensions.html) {
				dataFormatted = await this.generateHtmlReport(dataPrepared);
			} else {
				dataFormatted = this.generatePdfReport(dataPrepared);
			}

			const createdFilePath = await this.exportReportToFile(reportFileName, dataFormatted);
			return [ExportLogErrorStatus.SuccessExport, createdFilePath];
		} catch (error) {
			this.logger.error('[Export Log] Could not export log', error);
			throw ExportLogErrorStatus.GenericError;
		}
	}

	/**
	 * Set log file extension
	 *
	 * @param extension html or pdf diferentiation
	 */
	public setExportExtensionSelected(extension: ExportLogExtensions) {
		this.exportExtensionSelected = extension;
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
				this.logger.info('[Export Report to File] File is null');
			}
		} else {
			picker.fileTypeChoices.insert('Portable Document Format', ['.pdf']);
			const file = await picker.pickSaveFileAsync();
			if (file !== null) {
				const dataArray = new Uint8Array(dataFormatted);
				await window.Windows.Storage.FileIO.writeBytesAsync(file, dataArray);
				pathSaved = file.path;
			} else {
				this.logger.info('[Export Report to File] File is null');
			}
		}

		if (pathSaved === '') {
			throw new Error('[Export Report to File] Operation cancelled');
		}

		return pathSaved;
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

	private async loadFonts(currentLanguage: string) {
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
			this.logger.error('[Export Log] Error on loading font files', error);
		}
	}

	protected setCorrectFont(content: string): any {
		const fontByInterval = [
			{ font: FontTypes.notokr, range: /[\u3131-\uD79D]/ }, // korean
			{ font: FontTypes.notosc, range: /[\u4e00-\u9eff]/ }, // chinese and japanese
			{ font: FontTypes.amiri, range: /[\u0600-\u06FF]/ }, // arabic
			{ font: FontTypes.rubik, range: this.hebrewUnicodeRange }, // hebrew
			{ font: FontTypes.rubik, range: /[\u0370-\u03FF]/ }, // greek
			{ font: FontTypes.rubik, range: /[\u0161\u0111\u010D\u0107\u017E]/ }, // croatian or others
		];

		return fontByInterval.find((data) => data.range.test(content))?.font ?? this.currentFont;
	}

	// Method used as workaround when content is in hebrew, because jspdf print it reversed
	protected reverseForHebrew(data: any): string {
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

	private generatePdfReport(jsonData: any): any {
		const doc = new jsPDF();

		this.fonts.forEach((font) => {
			doc.addFileToVFS(font.id + '.ttf', font.data);
			doc.addFont(font.id + '.ttf', font.id, 'normal');
		});

		(jsPDF as any).autoTableSetDefaults({
			margin: 10,
			showHead: 'firstPage',
			headStyles: {
				fillColor:
					this.currentLogType === LogType.snapshot ? this.whiteColor : this.darkBlueColor,
				textColor:
					this.currentLogType === LogType.snapshot
						? this.lightBlueColor
						: this.whiteColor,
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

		this.populatePdf(doc, jsonData);

		return doc.output('arraybuffer');
	}

	private generateHtmlReport(jsonData: any): Promise<string> {
		let templatePath: string;

		if (this.currentLogType === LogType.scan) {
			templatePath = 'assets/templates/hardware-scan/export-results-template.html';
		} else {
			templatePath = 'assets/templates/snapshot/snapshot-results-template.html';
		}

		return new Promise((resolve, reject) => {
			this.http
				.get(templatePath, { responseType: 'text' })
				.toPromise()
				.then((htmlData) => {
					this.document = new DOMParser().parseFromString(htmlData, 'text/html');
					this.populateHtml(jsonData);
					resolve(this.document.documentElement.outerHTML);
				})
				.catch((error) => {
					this.logger.exception('[ExportResultService] generateHtmlReport', error);
					reject(error);
				});
		});
	}

	/**
	 * Function that will populate pdf file
	 *
	 * @param doc jsPDF object
	 * @param jsonData A json object containing all data needed to export the results
	 */
	protected abstract populatePdf(doc: jsPDF, jsonData: any): void;

	/**
	 * Function that will populate html template
	 *
	 * @param jsonData A json object containing all data needed to export the results
	 */
	protected abstract populateHtml(jsonData: any): void;

	/**
	 * Function that will get correct data and prepare it deppending on log type
	 */
	protected abstract prepareData(): Promise<any>;
}
