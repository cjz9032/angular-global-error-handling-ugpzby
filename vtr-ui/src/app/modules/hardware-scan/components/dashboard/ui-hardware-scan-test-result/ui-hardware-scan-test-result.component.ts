import { Component, OnInit, Input } from '@angular/core';
import { HardwareScanTestResult } from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';

@Component({
	selector: 'vtr-ui-hardware-scan-test-result',
	templateUrl: './ui-hardware-scan-test-result.component.html',
	styleUrls: ['./ui-hardware-scan-test-result.component.scss'],
})
export class UiHardwareScanTestResultComponent implements OnInit {
	@Input() componentId: string;
	@Input() module: any;

	// "Wrapper" value to be accessed from the HTML
	public testResultEnum = HardwareScanTestResult;

	constructor() {}

	ngOnInit(): void {}
}
