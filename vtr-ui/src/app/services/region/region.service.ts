import {
	Injectable
} from '@angular/core';
import { Observable, Observer } from 'rxjs';

declare var Windows;

@Injectable({
	providedIn: 'root'
})
export class RegionService {
	getRegion(): Observable<string> {
		return Observable.create((observer: Observer<string>) => {
			if (Windows) {
				observer.next(
					Windows.System.UserProfile.GlobalizationPreferences.homeGeographicRegion
				);
			} else {
				observer.error('Windows is undefined');
			}
			observer.complete();
		});
	}

	getLanguage(): Observable<string> {
		return Observable.create((observer: Observer<string>) => {
			if (Windows) {
				const language = Windows.System.UserProfile.GlobalizationPreferences.languages[0];
				observer.next(
					language.lastIndexOf('-') > 0 ?
						language.substring(0, language.lastIndexOf('-')) : language
				);
			} else {
				observer.error('Windows is undefined');
			}
			observer.complete();
		});
	}
}
