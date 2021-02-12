import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import {
	HardwareScanTestResult,
	HardwareScanFinishedHeaderType,
} from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { HardwareScanService } from '../../../services/hardware-scan.service';
import { PreviousResultService } from '../../../services/previous-result.service';
import { HardwareScanFeaturesService } from '../../../services/hardware-scan-features.service';
import { CommonService } from 'src/app/services/common/common.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';

@Component({
	selector: 'vtr-hardware-view-results',
	templateUrl: './hardware-view-results.component.html',
	styleUrls: ['./hardware-view-results.component.scss'],
})
export class HardwareViewResultsComponent implements OnInit, OnDestroy {
	public item: any;
	public resultCodeText = this.translate.instant('hardwareScan.resultCode');
	public detailsText = this.translate.instant('hardwareScan.details');
	public showProgress = false;
	public isLoadingDone = false;

	// "Wrapper" value to be accessed from the HTML
	public testResultEnum = HardwareScanTestResult;

	constructor(
		public deviceService: DeviceService,
		private hardwareScanService: HardwareScanService,
		private previousResultService: PreviousResultService,
		private translate: TranslateService,
		private hardwareScanFeaturesService: HardwareScanFeaturesService,
		private commonService: CommonService
	) {}

	ngOnInit() {
		// Get the view result information
		this.item = this.previousResultService.getViewResultItems();

		// Validates if the view result information has failured tests and update this value
		this.previousResultService.updateLastFailuredTest(this.item.items);

		// Sets the Header with the type "View Results"
		this.hardwareScanService.setScanFinishedHeaderType(
			HardwareScanFinishedHeaderType.ViewResults
		);
	}

	ngOnDestroy() {
		// Ensure that the homepage will be shown,
		// in case of reaching here from the results page
		this.hardwareScanService.setScanOrRBSFinished(false);

		// Sets the Header with the type "None"
		this.hardwareScanService.setScanFinishedHeaderType(HardwareScanFinishedHeaderType.None);
	}

	public get isFeatureExportAvailable(): boolean {
		const previousResult: any = this.previousResultService.getLastPreviousResultCompletionInfo();
		return (
			this.hardwareScanFeaturesService.isExportLogAvailable &&
			this.commonService.getSessionStorageValue(SessionStorageKey.HwScanHasExportLogData) &&
			this.previousResultService.getLastFinalResultCode() &&
			previousResult.result !== HardwareScanTestResult[HardwareScanTestResult.Cancelled]
		); // Uses this validation to avoid cases that CLI doesn't send final result code, it is invalid(Abort CLI error) or result Cancelled
	}
}
