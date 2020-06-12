import { Component, OnInit, Input } from '@angular/core';

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

	constructor() {
	}

	ngOnInit() {
	}

	public getKey(obj: any) {
		return Object.keys(obj);
	}

	public getValue(obj: any) {
		return Object.values(obj);
	}

	public getInformation(text: string) {
		this.tooltipText = text;
	}

	// Changes status expanded of the module test list when the user request
	public toggleTestListVisibility (item: any) {
		item.expanded = !item.expanded;
		item.visibilityChangedByUser = !item.visibilityChangedByUser;
	}
}
