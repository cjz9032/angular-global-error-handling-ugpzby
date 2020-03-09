import { Injectable } from '@angular/core';
import { QA } from '../../data-models/qa/qa.model';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Injectable({
	providedIn: 'root'
})
export class QaService {
	title = `${this.translate.instant('faq.pageTitle')}`; // sahinul, 24June2019 VAN-5534
	imagePath = 'assets/images/qa';
	qas: QA[] = [
		{
			id: 1,
			category: 'q&a',
			path: '/device/support-detail/1',
			iconPath: `${this.imagePath}/svg_icon_qa_backup.svg`,
			like: false,
			dislike: false,
		},
		{
			id: 3,
			category: 'q&a',
			path: '/device/support-detail/3',
			iconPath: `${this.imagePath}/svg_icon_qa_pcbit.svg`,
			like: false,
			dislike: false,
		},
		{
			id: 4,
			category: 'q&a',
			path: '/device/support-detail/4',
			iconPath: `${this.imagePath}/svg_icon_qa_battery.svg`,
			like: false,
			dislike: false,
		},
		{
			id: 5,
			category: 'q&a',
			path: '/device/support-detail/5',
			iconPath: `${this.imagePath}/svg_icon_qa_tablet.svg`,
			like: false,
			dislike: false,
		},
		{
			id: 6,
			category: 'q&a',
			path: '/device/support-detail/6',
			iconPath: `${this.imagePath}/svg_icon_qa_cortana.svg`,
			like: false,
			dislike: false,
		}
	];

	// VAN-5872, server switch feature
	// only preserving those keys that are used in html
	preserveTransKeys: any = {
		pageTitle: 'faq.pageTitle',
		qasTransKeys: {},
		isPreserved: false,
		isSubscribed: <any>false
	};

	constructor(private translate: TranslateService) { }

	setTranslationService(translate: TranslateService) {
		this.translate = translate;
	}

	getById(id: number): QA {
		return this.qas.find((element, index, array) => {
			return element.id === id;
		});
	}

	setCurrentLangTranslations() {
		// Evaluate the translations for QA on language Change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.qas.forEach((qa) => {
				try {
					qa.title = this.translate.instant(qa.title);
					this.translate.stream(qa.title).subscribe((value) => {
						qa.title = value;
					});
				} catch (e) {}

				try {
					qa.description = this.translate.instant(qa.description);
					this.translate.stream(qa.description).subscribe((value) => {
						qa.description = value;
					});
				} catch (e) {}

				try {
					this.translate.get(qa.keys).subscribe((translation: [string]) => {
						qa.keys = translation;
					});
				} catch (e) {}
			});

			// sahinul, 24June2019 VAN-5534
			try {
				this.title = this.translate.instant(this.title);
				this.translate.stream(this.title).subscribe((value) => {
					this.title = value;
				});
			} catch (e) {}
		});

		this.qas.forEach((qa) => {
			try {
				qa.title = this.translate.instant(qa.title);
				this.translate.stream(qa.title).subscribe((value) => {
					qa.title = value;
				});
			} catch (e) {}

			try {
				qa.description = this.translate.instant(qa.description);
				this.translate.stream(qa.description).subscribe((value) => {
					qa.description = value;
				});
			} catch (e) {}

			try {
				this.translate.get(qa.keys).subscribe((translation: [string]) => {
					qa.keys = translation;
				});
			} catch (e) {}
		});

		// sahinul, 24June2019 VAN-5534
		try {
			this.title = this.translate.instant(this.title);
			this.translate.stream(this.title).subscribe((value) => {
				this.title = value;
			});
		} catch (e) {}
	}

	// VAN-5872, server switch feature
	getQATranslation(translateQA: TranslateService) {
		try {
			// preserving translation keys to use every time
			if (!this.preserveTransKeys.isPreserved) {
				this.qas.forEach((qa) => {
					this.preserveTransKeys.qasTransKeys[qa.id] = {
						title: 'faq.question' + qa.id + '.title',
						description: 'faq.question' + qa.id + '.description'
					};
				});
				this.preserveTransKeys.isPreserved = true;
			}

			// respond to onLangChange
			if (!this.preserveTransKeys.isSubscribed) {
				this.preserveTransKeys.isSubscribed = translateQA.onLangChange.subscribe((event: LangChangeEvent) => {
					// Page Title
					this.title = this.getObjectValue(event.translations, this.preserveTransKeys.pageTitle); // setting this again
					this.qas.forEach((qa) => {
						// segment or list Title
						const qaTitleKey = this.preserveTransKeys.qasTransKeys[qa.id].title;
						qa.title = this.getObjectValue(event.translations, qaTitleKey);
						const qaDescriptionKey = this.preserveTransKeys.qasTransKeys[qa.id].description;
						qa.description = this.getObjectValue(event.translations, qaDescriptionKey);
					});
				});
			}

			// Stream all the values
			translateQA.stream(this.preserveTransKeys.pageTitle).subscribe((value) => {
				this.title = value;
			});

			this.qas.forEach((qa) => {
				const qaTitleKey = this.preserveTransKeys.qasTransKeys[qa.id].title;
				translateQA.stream(qaTitleKey).subscribe((value) => {
					qa.title = value;
				});
				const qaDescriptionKey = this.preserveTransKeys.qasTransKeys[qa.id].description;
				translateQA.stream(qaDescriptionKey).subscribe((value) => {
					qa.description = value;
				});
			});
		} catch (err) {}
	}

	// key=> faq.question1.title
	getObjectValue(sourceValue: object, key: string): any {
		if (!sourceValue) {
			return null;
		}

		const parents = key.split('.');
		let returnValue = sourceValue;
		parents.forEach((v) => {
			returnValue = returnValue[v];
		});
		return returnValue;
	}

	destroyChangeSubscribed() {
        if (this.preserveTransKeys.isSubscribed) {
			this.preserveTransKeys.isSubscribed = false;
			// this.preserveTransKeys.isSubscribed.unsubscribe();
		}
    }
}
