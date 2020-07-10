import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';

@Component({
	selector: 'vtr-ui-hardware-list',
	templateUrl: './ui-hardware-list.component.html',
	styleUrls: ['./ui-hardware-list.component.scss']
})
export class UiHardwareListComponent implements OnInit {
	@Input() items: Array<any>;
	@Input() template = 1;

	public information: string;
	public testResultList: typeof HardwareScanTestResult;

	constructor(private translate: TranslateService) {
		this.testResultList = HardwareScanTestResult;
	 }

	ngOnInit() {
	}

	public getInformation(text: string) {
		this.information = text;
	}
}
