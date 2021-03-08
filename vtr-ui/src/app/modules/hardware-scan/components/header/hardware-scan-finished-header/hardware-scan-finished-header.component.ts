import {
	Component,
	OnInit,
	Input,
	NgZone,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { HardwareScanService } from '../../../services/hardware-scan.service';
import { PreviousResultService } from '../../../services/previous-result.service';
import { HardwareScanResultService } from '../../../services/hardware-scan-result.service';
import { RecoverBadSectorsService } from '../../../services/recover-bad-sectors.service';
import { LenovoSupportService } from 'src/app/modules/hardware-scan/services/lenovo-support.service';
import { HardwareScanFinishedHeaderType } from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { HardwareScanFeaturesService } from '../../../services/hardware-scan-features.service';

@Component({
	selector: 'vtr-hardware-scan-finished-header',
	templateUrl: './hardware-scan-finished-header.component.html',
	styleUrls: ['./hardware-scan-finished-header.component.scss'],
})
export class HardwareScanFinishedHeaderComponent implements OnInit {
	supportUrl: string;
	contactusUrl: string;
	headerType: HardwareScanFinishedHeaderType = HardwareScanFinishedHeaderType.None;
	numberTestsFailed = 0;
	lastScanResultCompletionInfo: any;
	scanResult: string;
	recoverResult: string;

	// Metrics
	@Input() itemParentCancel: string;
	@Input() itemNameCancel: string;

	// Emitters
	@Output() scanAgain = new EventEmitter();

	// Wrapper
	public enumScanHeaderTypeFinished = HardwareScanFinishedHeaderType;

	constructor(
		private hardwareScanService: HardwareScanService,
		private previousResultService: PreviousResultService,
		private hardwareScanResultService: HardwareScanResultService,
		private recoverBadSectorsService: RecoverBadSectorsService,
		private lenovoSupportService: LenovoSupportService,
		private featuresService: HardwareScanFeaturesService,
		private logger: LoggerService
	) {}

	ngOnInit() {
		this.headerType = this.hardwareScanService.getScanFinishedHeaderType();
		let scanDate: Date;
		let finalResultCode: string;

		if (this.headerType === HardwareScanFinishedHeaderType.Scan) {
			scanDate = this.hardwareScanService.getFinalResultStartDate();
			this.scanResult = this.hardwareScanService.getScanResult();
			finalResultCode = this.getFinalResultCode();
		} else if (this.headerType === HardwareScanFinishedHeaderType.ViewResults) {
			this.lastScanResultCompletionInfo = this.previousResultService.getLastPreviousResultCompletionInfo();
			this.scanResult = this.lastScanResultCompletionInfo.result;
			scanDate = this.lastScanResultCompletionInfo.date;
			finalResultCode = this.getLastFinalResultCode();
		} else if (this.headerType === HardwareScanFinishedHeaderType.RecoverBadSectors) {
			this.recoverResult = this.recoverBadSectorsService.getLastRecoverResultTitle();
			this.featuresService.setExportLogAsAvailableForRecover();
		}

		// Avoid override recover's action
		if (this.headerType !== HardwareScanFinishedHeaderType.RecoverBadSectors) {
			this.featuresService.startCheckFeatures();
		}

		this.configureSupportUrl(scanDate, finalResultCode);
		this.configureContactusUrl();
		this.setupFailedTests();
	}

	private async configureSupportUrl(scanDate: Date, finalResultCode: string) {
		await this.lenovoSupportService
			.getETicketUrl(scanDate, finalResultCode)
			.then((response) => {
				this.supportUrl = response;
			})
			.catch((error) => {
				this.logger.exception(
					'[HardwareScanFinishHeaderComponent] configureSupportUrl',
					error
				);
			});
	}

	private async configureContactusUrl() {
		await this.lenovoSupportService
			.getContactusUrl()
			.then((response) => {
				this.contactusUrl = response;
			})
			.catch((error) => {
				this.logger.exception(
					'[HardwareScanFinishHeaderComponent] configureContactusUrl',
					error
				);
			});
	}

	public setupFailedTests() {
		this.numberTestsFailed = 0;
		if (this.hardwareScanService) {
			this.numberTestsFailed = this.hardwareScanResultService.getFailedTests();
		}
	}

	public getFinalResultCode() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getFinalResultCode();
		}
		return '';
	}

	public getLastFinalResultCode() {
		return this.previousResultService.getLastFinalResultCode();
	}

	public onScanAgain() {
		this.scanAgain.emit();
	}

	openContactusPage() {
		window.open(this.contactusUrl);
	}
}
