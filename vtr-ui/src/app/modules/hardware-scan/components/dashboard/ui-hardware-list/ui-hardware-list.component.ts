import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanTestResult } from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';

@Component({
	selector: 'vtr-ui-hardware-list',
	templateUrl: './ui-hardware-list.component.html',
	styleUrls: ['./ui-hardware-list.component.scss']
})
export class UiHardwareListComponent implements OnInit {
	@Input() componentId: string;
	@Input() items: Array<any>;
	@Input() template = 1;

	public information: string;
	public tooltipIndex: number;
	public testResultEnum: typeof HardwareScanTestResult;

	constructor(private translate: TranslateService) {
		this.testResultEnum = HardwareScanTestResult;
	 }

	ngOnInit() {
	}

	public setTooltipInfo(text: string, index: number) {
		this.information = text;
		this.tooltipIndex = index;
	}
}
