import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { timer, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
	flatMap,
	first,
	toArray,
	refCount,
	distinctUntilChanged,
	publishReplay,
	catchError,
	concatMap,
} from 'rxjs/operators';
import isEqual from 'lodash/isEqual';

@Injectable({
	providedIn: 'root',
})
export class NetworkRequestService {
	constructor(
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document
	) {}

	/*
	 * @param url: a complete url string
	 * @param timeInterval: interval time(s)
	 */
	networkStatus(
		url: URL = new URL(this.document.location.href)
	) {
		const urlStr = url.toString();
		const observer = timer(0, 1000).pipe(
			concatMap((val: number) => {
				if (val > 0 && val <= 21) { val += 9; }
				if (val > 30) { val = 30; }
				return timer(val * 1000).pipe(
					flatMap(() =>
						this.fetch(urlStr).pipe(
							catchError(() => of(false)),
							first(),
							flatMap((res: any) => {
								return of(res.status >= 200 && res.status < 300);
							}),
							toArray()
						)
					),
					distinctUntilChanged(isEqual),
					publishReplay(1),
					refCount()
				);
			})
		);
		return observer;
	}

	private fetch(url: string) {
		return this.http.head(url, {
			observe: 'response',
		});
	}
}
