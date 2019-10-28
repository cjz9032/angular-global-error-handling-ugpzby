import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PRIVACY_ENVIRONMENT } from '../../../utils/injection-tokens';
import { AbTestsName } from '../../../utils/ab-test/ab-tests.type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

	constructor(
		private http: HttpClient,
		@Inject(PRIVACY_ENVIRONMENT) private environment
	) {
	}

	shuffle(version: number, knownConfigVersion: number = null): Observable<ShuffleTests>  {
		const headers = new HttpHeaders({
			'Content-Type': 'text/plain;charset=UTF-8',
		});
		return this.http.post<ResponseShuffleTests>(
			`${this.environment.backendUrl}/api/v1/vantage/tests/shuffle?version=${version}&known_config_version=${knownConfigVersion ? knownConfigVersion : ''}`,
			{headers}
		).pipe(
			map((res) => ({
				version: res.config_version,
				tests: res.tests
			}))
		);
	}

	sendError(error: string) {

	}
}
