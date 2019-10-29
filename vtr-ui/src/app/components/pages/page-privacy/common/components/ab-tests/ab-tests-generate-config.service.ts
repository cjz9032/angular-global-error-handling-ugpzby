import { Injectable } from '@angular/core';
import * as config from '../../../utils/ab-test/config.json';
import { StorageService } from '../../services/storage.service';
import { AbTestsBackendService, ShuffleTests, Test } from './ab-tests-backend.service';
import { AbTestsName } from '../../../utils/ab-test/ab-tests.type';
import { AB_TESTS_CONFIG, AbTestsService, BACKEND_CONFIG_VERSION } from './ab-tests.service';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

const TIMEOUT_FOR_BACKEND = 3000;

@Injectable({
	providedIn: 'root'
})
export class AbTestsGenerateConfigService {

	constructor(
		private storageService: StorageService,
		private abTestsBackendService: AbTestsBackendService,
		private abTestsService: AbTestsService
	) {
	}

	shuffle() {
		this.abTestsBackendService.shuffle().pipe(
			timeout(TIMEOUT_FOR_BACKEND),
			catchError((err: HttpErrorResponse) => {
				this.abTestsBackendService.sendError(err.error);
				return of(this.getDefaultConfig());
			})
		).subscribe((res) => {
				try {
					this.storageService.setItem(BACKEND_CONFIG_VERSION, JSON.stringify(res.version));
					this.storageService.setItem(AB_TESTS_CONFIG, JSON.stringify(res.tests));
					this.abTestsService.setCurrentOptions(res.tests);
				} catch (err) {
					console.error(err);
					this.abTestsBackendService.sendError(err);
				}
			}, (err) => this.abTestsBackendService.sendError(err));
	}

	private getDefaultConfig(): ShuffleTests {
		return {
			version: Number(this.storageService.getItem(BACKEND_CONFIG_VERSION)) || null,
			tests: JSON.parse(this.storageService.getItem(AB_TESTS_CONFIG)) as Test[] || this.getDefaultTests()
		};
	}

	private getDefaultTests() {
		return config.tests.map((test) => ({key: test.key as AbTestsName, option: test.defaultOptions[0]}));
	}
}
