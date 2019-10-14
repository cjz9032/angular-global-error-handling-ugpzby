import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PRIVACY_ENVIRONMENT } from '../../../utils/injection-tokens';
import { AbTestsName } from '../../../utils/ab-test/ab-tests.type';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Test {
	key: AbTestsName;
	option: string;
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
		// return this.http.post<ShuffleTests>(
		// 	`${this.environment.backendUrl}/api/v1/vantage/tests/shuffle`,
		// 	{
		// 		version,
		// 		known_config_version: Number(knownConfigVersion)
		// 	},
		// 	{headers}
		// );

		return of({
			version: 1,
			tests: [
				{
					key: AbTestsName.colorButton,
					option: 'C'
				},
				{
					key: AbTestsName.colorLink,
					option: 'A'
				}
			]
		}).pipe(
			delay(1000)
		);
	}

	sendError(error: string) {

	}
}
