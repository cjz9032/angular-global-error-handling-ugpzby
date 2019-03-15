import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import Translation from 'src/app/data-models/translation/translation';
import { TranslationSection } from 'src/app/enums/translation-section.enum';

@Injectable({
	providedIn: 'root'
})
export class TranslationService {
	public subscription: Observable<Translation>;
	private subject: BehaviorSubject<Translation>;

	constructor(translate: TranslateService) {
		this.subject = new BehaviorSubject<Translation>(
			new Translation(TranslationSection.Unknown, undefined)
		);
		this.subscription = this.subject;
		this.translateStrings(translate);
	}

	private translateStrings(translate: TranslateService) {
		// runtime change in language can be handled like below.
		// subscribe to top level object and update text in one go
		translate.get(TranslationSection.CommonMenu)
			.subscribe((changes: any) => {
				console.log('translateStrings', changes);

				this.notifyChanges(TranslationSection.CommonMenu, changes);

			});

		translate.get(TranslationSection.CommonUi)
			.subscribe((changes: any) => {
				this.notifyChanges(TranslationSection.CommonUi, changes);

			});
	}

	private notifyChanges(type: TranslationSection, payload: any) {
		this.subject.next(new Translation(type, payload));
	}
}

