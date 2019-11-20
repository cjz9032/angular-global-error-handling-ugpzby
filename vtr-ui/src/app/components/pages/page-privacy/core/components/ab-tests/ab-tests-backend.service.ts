import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PRIVACY_ENVIRONMENT } from '../../../utils/injection-tokens';
import { AbTestsName } from '../../../utils/ab-test/ab-tests.type';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BACKEND_CONFIG_VERSION } from './ab-tests.service';
import { StorageService } from '../../services/storage.service';
import * as config from '../../../utils/ab-test/config.json';

export interface Test {
	key: AbTestsName;
	option: string;
}

interface ResponseShuffleTests {
	version: number;
	tests: Test[];
	config_version: number;
}

export interface ShuffleTests {
	version: number;
	tests: Test[];
}

@Injectable({
	providedIn: 'root'
})
export class AbTestsBackendService {
	private abTestsCache$: Observable<ShuffleTests>;

	constructor(
		private http: HttpClient,
		@Inject(PRIVACY_ENVIRONMENT) private environment,
		private storageService: StorageService
	) {
	}

	shuffle(): Observable<ShuffleTests>  {
		if (!this.abTestsCache$) {
			const headers = new HttpHeaders({
				'Content-Type': 'text/plain;charset=UTF-8',
			});
			this.abTestsCache$ = this.http.post<ResponseShuffleTests>(
				`${this.environment.backendUrl}/api/v1/vantage/tests/shuffle?${this.getVersionForBackend()}`,
				{headers}
			).pipe(
				map((res) => ({
					version: res.config_version,
					tests: res.tests
				})),
				shareReplay(1)
			);
		}

		return this.abTestsCache$;
	}

	sendError(error: string) {
		if (!error) {
			return;
		}

		let errorMsg = '';
		try {
			errorMsg = JSON.stringify(error);
		} catch (e) {
			errorMsg = 'Something went wrong with JSON.stringify(error)';
		}

		const headers = new HttpHeaders({
			'Content-Type': 'text/plain;charset=UTF-8',
		});
		return this.http.post<void>(
			`${this.environment.backendUrl}/api/v1/vantage/tests/error?${this.getVersionForBackend()}&message=${errorMsg}`,
			{headers}
		).subscribe();
	}

	private getVersionForBackend() {
		return `version=${config.version}&known_config_version=${this.getKnownConfigVersion() ? this.getKnownConfigVersion() : ''}`;
	}

	private getKnownConfigVersion() {
		const rawCurrentConfigVersion = Number(this.storageService.getItem(BACKEND_CONFIG_VERSION));
		return rawCurrentConfigVersion ? rawCurrentConfigVersion : null;
	}
}
