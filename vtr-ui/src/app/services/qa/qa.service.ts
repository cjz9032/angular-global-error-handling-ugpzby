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
			category: 'q&a',
			path: '/device/support-detail/1',
			iconPath: `${this.imagePath}/svg_icon_qa_backup.svg`,
			like: false,
			dislike: false,
		},
		{
			id: 2,
			category: 'q&a',
			path: '/device/support-detail/2',
			iconPath: `${this.imagePath}/svg_icon_qa_reset.svg`,
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

	constructor(
		private translate: TranslateService,
	) { }

	setCurrentLangTranslations() {
		this.translate
		.stream([
			'faq.question1.title',
			'faq.question2.title',
			'faq.question3.title',
			'faq.question4.title',
			'faq.question5.title',
			'faq.question6.title'
		])
		.subscribe((result) => {
			for (let i = 0; i < this.qas.length; i++) {
				const key = `faq.question${i + 1}.title`
				this.qas[i].title = result[key];
			}
		});
	}

	getById(id: number): QA {
		return this.qas.find((element, index, array) => {
			return element.id === id;
		});
	}
}
