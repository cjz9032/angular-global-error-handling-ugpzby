import { Component, OnInit, Input, NgZone, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanService } from '../../services/hardware-scan/hardware-scan.service';

@Component({
	selector: 'vtr-widget-hardware-scan',
	templateUrl: './widget-hardware-scan.component.html',
	styleUrls: ['./widget-hardware-scan.component.scss']
})

export class WidgetHardwareScanComponent implements OnInit {
	@Input() title = '';
	@Input() subTitle = '';
	@Input() warningMessage = this.translate.instant('hardwareScan.warningMessage');
	@Input() finalResultCode = '';
	@Input() finalResultCodeText = '';
	@Input() buttonText = '';
	@Input() anchorText = '';
	@Input() completeText = this.translate.instant('hardwareScan.complete');
	@Input() statusText: string;
	@Input() lenovoSupport = '';
	@Input() percent = 0;
	@Input() showProgress = false;
	@Input() disableQuickScan: boolean;
	@Input() disableCancel: boolean;
	@Input() tooltipInformation: any;
	@Input() offlineText: string;
	@Input() isOnline = true;

	@Input() itemParentCancel: string;
	@Input() itemNameCancel: string;

	@Output() startQuickScan = new EventEmitter();
	@Output() updateProgress = new EventEmitter();
	@Output() checkCancel = new EventEmitter();
	@Output() checkAnchor = new EventEmitter();

	constructor(private hardwareScanService: HardwareScanService, private translate: TranslateService) { }

	ngOnInit() { }

	onQuickScan() {
		// this.showProgress = true;
		this.startQuickScan.emit();
	}

	onAnchor() {
		this.checkAnchor.emit();
	}

	onCancel() {
		this.showProgress = true;
		this.checkCancel.emit();
	}

	public isScanOrRBSFinished() {
		return this.hardwareScanService.isScanOrRBSFinished();
	}

	public getFinalResultCode() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getFinalResultCode();
		}
		return '';
	}

	public getTooltipInformation() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getFinalResultDescription();
		}
		return '';
	}
}
