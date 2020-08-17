import { Injectable } from '@angular/core';

import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';


@Injectable({
  providedIn: 'root'
})
export class HardwareScanResultService {

	private failedTests = 0;

	// This is used to determine the scan overall status when sending metrics information
	private resultSeverityConversion = {};

	constructor() {
		this.initResultSeverityConversion();
	}

	private initResultSeverityConversion() {
		// the enum HardwareScanTestResult isn't really in the best order to determine the severity of the results
		// because of that, I'm creating a map with the best order to determine the scan overall status
		this.resultSeverityConversion[HardwareScanTestResult.NotStarted] = 0;
		this.resultSeverityConversion[HardwareScanTestResult.InProgress] = 1;
		this.resultSeverityConversion[HardwareScanTestResult.Na] = 2;
		this.resultSeverityConversion[HardwareScanTestResult.Attention] = 3;
		this.resultSeverityConversion[HardwareScanTestResult.Pass] = 4;
		this.resultSeverityConversion[HardwareScanTestResult.Cancelled] = 5;
		this.resultSeverityConversion[HardwareScanTestResult.Fail] = 6;
	}

	public consolidateResults(partialResults: any): HardwareScanTestResult {
		let consolidatedResult = HardwareScanTestResult.Na;

		partialResults.forEach(partialResult => {
			// Only change result when finds a worse case
			if (this.resultSeverityConversion[consolidatedResult] < this.resultSeverityConversion[partialResult]) {
				consolidatedResult = partialResult;
			}
		});

		return consolidatedResult;
	}

	public countFailedTests(testList: any) {
		this.failedTests += testList.filter(item => (item.statusTest || item.result) === HardwareScanTestResult.Fail).length;
	}

	public getFailedTests() {
		return this.failedTests;
	}

	public clearFailedTests() {
		this.failedTests = 0;
	}
}
