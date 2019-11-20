import { Injectable } from '@angular/core';
import { Test } from './ab-tests-backend.service';
import { BehaviorSubject } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { AbTestsName } from '../../utils/ab-test/ab-tests.type';

export const BACKEND_CONFIG_VERSION = '[abTests] backendConfigVersion';
export const AB_TESTS_CONFIG = '[abTests] config';

@Injectable({
	providedIn: 'root'
})
export class AbTestsService {
	private currentOptions = new BehaviorSubject<Test[]>(this.getCurrentOptionsFromStorage());

	constructor(
		private storageService: StorageService,
	) {
	}

	setCurrentOptions(value: Test[]) {
		if (!this.currentOptions.getValue()) {
			this.currentOptions.next(value);
		}
	}

	getCurrentOptions(testName: AbTestsName) {
		return this.currentOptions.pipe(
			filter(res => res !== null),
			map((tests) => tests.find((test) => test.key === testName)),
			first()
		);
	}

	private getCurrentOptionsFromStorage() {
		try {
			return JSON.parse(this.storageService.getItem(AB_TESTS_CONFIG)) as Test[] || null;
		} catch (e) {
			return null;
		}
	}
}
