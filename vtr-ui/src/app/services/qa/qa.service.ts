import { Injectable } from '@angular/core';
import { QA } from '../../data-models/qa/qa.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
	providedIn: 'root'
})
export class QaService {

	imagePath = 'assets/images/qa';
	qas: QA[] = [
		{
			id: 1,
			path: 'support-detail/1',
			iconPath: `${this.imagePath}/svg_icon_qa_backup.svg`,
			title: `faq.question1.title`,
			like: false,
			dislike: false,
			description: `faq.question1.description`
		},
		{
			id: 2,
			path: 'support-detail/2',
			iconPath: `${this.imagePath}/svg_icon_qa_refresh.svg`,
			title: 'faq.question2.title',
			like: false,
			dislike: false,
			description: `faq.question2.description`
		},
		{
			id: 3,
			path: 'support-detail/3',
			iconPath: `${this.imagePath}/svg_icon_qa_pcbit.svg`,
			title: 'faq.question3.title',
			like: false,
			dislike: false,
			description: `faq.question3.description`
		},
		{
			id: 4,
			path: 'support-detail/4',
			iconPath: `${this.imagePath}/svg_icon_qa_battery.svg`,
			title: 'faq.question4.title',
			like: false,
			dislike: false,
			description: `faq.question4.description`
		},
		{
			id: 5,
			path: 'support-detail/5',
			iconPath: `${this.imagePath}/svg_icon_qa_tablet.svg`,
			title: 'faq.question5.title',
			like: false,
			dislike: false,
			description: `faq.question5.description`
		},
		{
			id: 6,
			path: 'support-detail/6',
			iconPath: `${this.imagePath}/svg_icon_qa_cortana.svg`,
			title: 'faq.question6.title',
			like: false,
			dislike: false,
			description: `faq.question6.description`
		}
	];

	constructor(private translate: TranslateService) {
		translate.addLangs(['en', 'zh-Hans']);
		this.translate.setDefaultLang('en');
		const browserLang = this.translate.getBrowserLang();
		this.translate.use(browserLang);
	}

	setTranslationService(translate: TranslateService) {
		this.translate = translate;
	}

	getById(id: number): QA {
		return this.qas.find((element, index, array) => {
			return element.id === id;
		});
	}
}
