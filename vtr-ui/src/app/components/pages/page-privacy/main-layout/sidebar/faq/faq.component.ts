import { Component, OnDestroy, OnInit } from '@angular/core';
import { FaqService } from '../../../common-services/faq/faq.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../shared/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../../shared/services/router-change-handler.service';

interface PageSettings {
	visible: boolean;
	questionId: string;
}

@Component({
	selector: 'vtr-faq',
	templateUrl: './faq.component.html',
	styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
	mainTitle = 'FAQ’s';
	seeMoreText = 'See all';
	seeMoreLink = './faq';
	isVisible = false;

	// TODO: Add correct settings when we have full list of questions and pages
	// look on route list
	pagesSettings: {
		[pageRoute: string]: PageSettings
	} = {
		privacy: {
			visible: true,
			questionId: 'general-questions'
		},
		scan: {
			visible: true,
			questionId: 'other-questions'
		},
		breaches: {
			visible: true,
			questionId: 'general-questions'
		},
		trackers: {
			visible: true,
			questionId: 'general-questions'
		},
		result: {
			visible: true,
			questionId: 'general-questions'
		},
		installed: {
			visible: true,
			questionId: 'general-questions'
		},
		'browser-accounts': {
			visible: true,
			questionId: 'general-questions'
		},
		faq: {
			visible: false,
			questionId: 'general-questions'
		}
	};

	generalQuestions: {
		id: string,
		title: string,
		questions: Array<{
			id: string,
			title: string,
			iconPath: string,
			texts: Array<string>
		}>
	};

	constructor(
		private faqService: FaqService,
		private router: Router,
		private routerChangeHandler: RouterChangeHandlerService
	) {
	}

	goToFaq(id: string) {
		this.router.navigate(['privacy', 'faq'], {
			queryParams: {
				openId: id
			}
		});
	}

	ngOnDestroy() {
	}

	ngOnInit() {
		this.generalQuestions = this.faqService.categories['general-questions'];
		this.isVisible = true;

		this.routerChangeHandler.onChange$
			.pipe(
				takeUntil(instanceDestroyed(this))
			)
			.subscribe(
				(currentPath) => {
					if (this.pagesSettings[currentPath]) {
						this.isVisible = this.pagesSettings[currentPath].visible;
						this.generalQuestions = this.faqService.categories[this.pagesSettings[currentPath].questionId];
					}
				}
			);
	}
}
