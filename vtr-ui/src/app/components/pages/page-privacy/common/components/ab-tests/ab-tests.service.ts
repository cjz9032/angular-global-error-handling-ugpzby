import { Injectable } from '@angular/core';
import { AbTestsName } from '../../../utils/ab-test/ab-tests.type';
import * as config from '../../../utils/ab-test/config.json';

@Injectable({
	providedIn: 'root'
})
export class AbTestsService {

	constructor() {
	}

	getDefaultOption(testName: AbTestsName) {
		return this.findTest(testName).defaultOptions[0];
	}

	private findTest(testName: AbTestsName) {
		return config.tests.find((test) => test.key === testName);
	}
}
