import { Component, OnInit, Input, NgZone, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-widget-hardware-scan',
	templateUrl: './widget-hardware-scan.component.html',
	styleUrls: ['./widget-hardware-scan.component.scss']
})

export class WidgetHardwareScanComponent implements OnInit {
	@Input() title: string = this.title || '';
	@Input() subTitle: string = this.subTitle || '';
	@Input() finalResultCode: string = this.finalResultCode || '';
	@Input() finalResultCodeText: string = this.finalResultCodeText || '';
	@Input() buttonText = '';
	@Input() anchorText = '';
	@Input() cancelText = this.translate.instant('hardwareScan.cancel');
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

	@Output() startQuickScan = new EventEmitter();
	@Output() updateProgress = new EventEmitter();
	@Output() checkCancel = new EventEmitter();
	@Output() checkAnchor = new EventEmitter();

	constructor(private translate: TranslateService) { }

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
}
