import { Component, OnInit, Input } from '@angular/core';
import { LenovoSupportService } from 'src/app/services/hardware-scan/lenovo-support.service';

@Component({
	selector: 'vtr-widget-hardware-scan-item',
	templateUrl: './widget-hardware-scan-item.component.html',
	styleUrls: ['./widget-hardware-scan-item.component.scss']
})
export class WidgetHardwareScanItemComponent implements OnInit {
	@Input() items: any[];
	@Input() resultCodeText: string;
	@Input() isScanExecute = false;
	@Input() isRecoverExecute = false;
	@Input() isEnableViewResults = false;

	public tooltipText: string;
	public tooltipIndex: number;
	contactusUrl: string;

	constructor(private lenovoSupportService: LenovoSupportService) {
	}

	ngOnInit() {
		this.configureContactusUrl();
	}

	public setTooltipInfo(text: string, index: number) {
		this.tooltipText = text;
		this.tooltipIndex = index;
	}

	// Changes status expanded of the module test list when the user request
	public toggleTestListVisibility(item: any) {
		item.expanded = !item.expanded;
		item.expandedStatusChangedByUser = !item.expandedStatusChangedByUser;
	}

	private async configureContactusUrl() {
		await this.lenovoSupportService.getContactusUrl().then((response) => {
			this.contactusUrl = response;
		});
	}

	openContactusPage() {
		window.open(this.contactusUrl);
	}
}
