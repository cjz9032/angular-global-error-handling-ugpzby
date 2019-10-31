import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanService } from '../../../services/hardware-scan/hardware-scan.service';

@Component({
	selector: 'vtr-hardware-view-results',
	templateUrl: './hardware-view-results.component.html',
	styleUrls: ['./hardware-view-results.component.scss']
})
export class HardwareViewResultsComponent implements OnInit, OnDestroy {

	public title = this.translate.instant('hardwareScan.latestResult');
	public item: any;
	public finalResultCodeText = this.translate.instant('hardwareScan.finalResultCode');
	public resultCodeText = this.translate.instant('hardwareScan.resultCode');
	public detailsText = this.translate.instant('hardwareScan.details');
	public anchorText = this.translate.instant('hardwareScan.save');
	public showProgress = false;
	public isLoadingDone = false;
	public lenovoSupport = this.translate.instant('hardwareScan.support.subtitle');

	constructor(
		public deviceService: DeviceService,
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService,
	) { }

	ngOnInit() {
		this.item = this.hardwareScanService.getViewResultItems();
	}

	ngOnDestroy() {
		this.hardwareScanService.setIsViewingRecoverLog(false);
		// Clearing the last response received from Scan/RBS to ensure that
		// the Hardware Components page will be shown, since user just clicked
		// in the back button from View Results page.
		this.hardwareScanService.clearLastResponse();
	}
}
