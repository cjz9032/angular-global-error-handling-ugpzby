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
	private areFontsLoaded: Promise<void>;

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
			this.areFontsLoaded = new Promise<void>((resolve) => {
				this.shellService
					.getSysinfo()
					.getMachineInfo()
					.then(async (info) => {
						this.machineModel = info?.family;
						this.serialNumber = info?.serialnumber;
						this.biosVersion = info?.biosVersion;
						this.productName = info?.mtm;
						this.currentLanguage = info?.locale;
						await this.loadFonts(this.currentLanguage);
						resolve();
					});
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

			const timeoutPromise = new Promise((resolve, reject) => {
				const timeout = setTimeout(() => {
					clearTimeout(timeout);
					reject('Timed out after 10s when tried to prepareData to export log!');
				}, 10000);
			});

			const dataPrepared = await Promise.race([this.prepareData(), timeoutPromise]);

			if (this.exportExtensionSelected === ExportLogExtensions.html) {
				dataFormatted = await this.generateHtmlReport(dataPrepared);
			} else {
				await this.areFontsLoaded;
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
		const fontsFolder = 'assets/fonts/export-log/';
		const fontNames = ['noto-sc.ttf', 'noto.ttf', 'noto-kr.ttf', 'rubik.ttf', 'amiri.ttf'];

		const convertBlobToBase64 = (blob) =>
			new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onerror = reject;
				reader.onload = () => {
					resolve((reader.result as string).split(',')[1]);
				};
				reader.readAsDataURL(blob);
			});

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
			fontNames.forEach(async (fontName) => {
				await this.http
					.get(fontsFolder + fontName, {
						responseType: 'blob',
					})
					.toPromise()
					.then((fontData) => {
						convertBlobToBase64(fontData).then((fontBase64) => {
							this.logger.info(`[Load Fonts Export Log] - ${fontName} loaded`);
							this.fonts.push({
								id: fontName.substring(0, fontName.length - 4),
								data: fontBase64 as string,
							});
						});
					})
					.catch((error) => {
						this.logger.exception(`[Load Fonts Export Log] - ${fontName}`, error);
					});
			});
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

		switch (this.currentLogType) {
			case LogType.scan:
			case LogType.rbs:
				templatePath = 'assets/templates/hardware-scan/export-results-template.html';
				break;
			case LogType.snapshot:
				templatePath = 'assets/templates/snapshot/snapshot-results-template.html';
				break;
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
