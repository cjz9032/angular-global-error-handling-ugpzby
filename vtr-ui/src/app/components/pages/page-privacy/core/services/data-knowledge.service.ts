import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, expand, map, reduce, shareReplay, tap } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';
import { PRIVACY_ENVIRONMENT } from '../../utils/injection-tokens';
import { PrivacyModule } from '../../privacy.module';

export interface DataKnowledgeItem {
	id: number;
	title: string;
	domains: string[];
	change_password_link?: string;
	reset_password_link?: string;
	icon_link: string;
}

export interface ResponseDataKnowledge {
	status: string;
	items?: DataKnowledgeItem[];
	next_since: string;
	message?: string;
}

export interface DataKnowledge {
	[key: string]: DataKnowledgeItem;
}

export const DEFAULT_SITES_FAVICON = '/assets/images/privacy-tab/default-site.png';

@Injectable({
	providedIn: 'root'
})
export class DataKnowledgeService {
	private dataKnowledgeCache$: Observable<DataKnowledge>;

	constructor(
		private http: HttpClient,
		@Inject(PRIVACY_ENVIRONMENT) private environment
	) {
	}

	private getKnowledgeBase() {
		if (!this.dataKnowledgeCache$) {
			this.dataKnowledgeCache$ = this.requestDataKnowledge().pipe(
				expand((response) => {
					const hasNextSince = (response.items && response.items.length > 0) && !response.message;
					return hasNextSince ?
						this.requestDataKnowledge(response.next_since) : EMPTY;
				}),
				reduce((acc, data) => {
					const items = data.items ? data.items : [];
					return {...acc, items: [...acc.items, ...items]};
				}),
				map((response) => response.items.reduce((result, item) => {
					result[item.domains[0]] = item;
					return result;
				}, {})),
				shareReplay(1)
			);
		}

		return this.dataKnowledgeCache$;
	}

	getFaviconImages(domain: string, defaultImageType?: string): Observable<string | null> {
		const defaultFavicon = defaultImageType || DEFAULT_SITES_FAVICON;
		return this.getKnowledgeBase().pipe(
			map((knowledgeBase) => knowledgeBase[domain] ? knowledgeBase[domain].icon_link : defaultFavicon),
			catchError((err) => {
				console.error(err);
				return of(defaultFavicon);
			})
		);
	}

	private requestDataKnowledge(since = '0', limit = '1000') {
		return this.http.get<ResponseDataKnowledge>(
			`${this.environment.backendUrl}/api/v1/public/kb`,
			{
				params: {
					since,
					limit
				}
			}
		);
	}
}
