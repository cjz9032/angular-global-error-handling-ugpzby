import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-widget-hardware-scan-item',
	templateUrl: './widget-hardware-scan-item.component.html',
	styleUrls: ['./widget-hardware-scan-item.component.scss']
})
export class WidgetHardwareScanItemComponent implements OnInit {
	@Input() items: any[];
	@Input() resultCodeText: string;
	@Input() detailsText: string;
	@Input() isLoadingDone = false;
	@Input() lenovoSupport: string = this.translate.instant('hardwareScan.support.subtitle');
	public tooltipText: string;

	constructor(
		private translate: TranslateService,
	) {

	}

	ngOnInit() {
	}

	public getInformation(text: string) {
		this.tooltipText = text;
	}
}
