import { Component, OnDestroy, OnInit } from '@angular/core';
import { FaqService, Questions } from '../../../core/services/faq/faq.service';
import { filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../../core/services/router-change-handler.service';


@Component({
	selector: 'vtr-faq',
	templateUrl: './faq.component.html',
	styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
	mainTitle = 'Q&A';
	isVisible = false;
	openId = null;
	questions: Questions;

	constructor(
		private faqService: FaqService,
		private routerChangeHandler: RouterChangeHandlerService
	) {	}

	ngOnDestroy() {
	}

	ngOnInit() {
		this.questions = this.faqService.questionCategories.dataBreaches;
		this.isVisible = true;

		this.routerChangeHandler.onChange$
			.pipe(
				takeUntil(instanceDestroyed(this)),
				filter((currentPath) => this.faqService.pagesSettings[currentPath])
			)
			.subscribe(
				(currentPath) => {
					this.openId = null;
					this.isVisible = this.faqService.pagesSettings[currentPath].visible;
					this.questions = this.faqService.pagesSettings[currentPath].questions;
				}
			);
	}

	openAccordion(index) {
		this.openId = this.openId === index ? null : index;
	}
}
