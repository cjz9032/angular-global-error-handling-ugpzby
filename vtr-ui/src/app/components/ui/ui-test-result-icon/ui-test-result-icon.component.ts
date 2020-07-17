import { Component, OnInit, Input } from '@angular/core';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';

@Component({
	selector: 'vtr-ui-test-result-icon',
	templateUrl: './ui-test-result-icon.component.html',
	styleUrls: ['./ui-test-result-icon.component.scss']
})
export class UiTestResultIconComponent implements OnInit {
	// Inputs
	@Input() testResultResponse: any;

	// "Wrapper" value to be accessed from the HTML
	public testResultEnum = HardwareScanTestResult;

	constructor() { }

	ngOnInit(): void {
	}

}
