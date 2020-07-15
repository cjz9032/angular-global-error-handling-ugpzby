import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';
import { HardwareScanFinishedHeaderType } from 'src/app/enums/hardware-scan-finished-header-type.enum';
import { HardwareScanService } from '../../../../../services/hardware-scan/hardware-scan.service';
import { PreviousResultService } from '../../../../../services/hardware-scan/previous-result.service';

@Component({
	selector: 'vtr-hardware-view-results',
	templateUrl: './hardware-view-results.component.html',
	styleUrls: ['./hardware-view-results.component.scss']
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
	) { }

	ngOnInit() {
		// Get the view result information
		this.item = this.previousResultService.getViewResultItems();

		// Validates if the view result information has failured tests and update this value
		this.previousResultService.updateLastFailuredTest(this.item.items);

		// Sets the Header with the type "View Results"
		this.hardwareScanService.setScanFinishedHeaderType(HardwareScanFinishedHeaderType.ViewResults);
	}

	ngOnDestroy() {
		this.hardwareScanService.setIsViewingRecoverLog(false);

		// Ensure that the homepage will be shown,
		// in case of reaching here from the results page
		this.hardwareScanService.setScanOrRBSFinished(false);

		// Sets the Header with the type "None"
		this.hardwareScanService.setScanFinishedHeaderType(HardwareScanFinishedHeaderType.None);
	}
}
