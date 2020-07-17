import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { timer, of, interval, range } from 'rxjs';
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
	map
} from 'rxjs/operators';
import isEqual from 'lodash/isEqual';

@Injectable({
	providedIn: 'root',
})
export class NetworkRequestService {
	constructor(
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document
	) { }

	/*
	 * @param url: a complete url string
	 */
	networkStatus(
		url: URL = new URL(this.document.location.href)
	) {
		const urlStr = url.toString();

		const observer = range(0, 6).pipe(
			map(val => val === 0 ? val : val * 5 + 5),
			concatMap((val: number) => {
				if (val === 30) {
					return interval(30 * 1000).pipe(
						flatMap(() =>
							this.fetch(urlStr)
						),
						distinctUntilChanged(isEqual),
						publishReplay(1),
						refCount()
					);
				}
				else {
					return timer(val * 1000).pipe(
						flatMap(() =>
							this.fetch(urlStr)
						),
						distinctUntilChanged(isEqual),
						publishReplay(1),
						refCount()
					);
				}
			})
		);
		return observer;
	}

	private fetch(url: string) {
		return this.http.head(url, {
			observe: 'response',
		}).pipe(
			catchError(() => of(false)),
			first(),
			flatMap((res: any) => {
				return of(res.status >= 200 && res.status < 300);
			}),
			toArray()
		);
	}
}
