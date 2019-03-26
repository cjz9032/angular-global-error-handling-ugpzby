import {
	AfterViewInit,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { FaqService } from '../../common-services/faq/faq.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';

@Component({
	// selector: 'vtr-faq-page',
	templateUrl: './faq-page.component.html',
	styleUrls: ['./faq-page.component.scss']
})
export class FaqPageComponent implements OnInit, OnDestroy, AfterViewInit {
	categories: {
		[id: string]: {
			id: string,
			title: string,
			questions: Array<{
				id: string,
				title: string,
				iconPath: string,
				texts: Array<string>
			}>
		}
	} = {};

	questionsState: {
		[id: string]: {
			isOpen: boolean
		}
	} = {};

	constructor(
		private faqService: FaqService,
		private route: ActivatedRoute,
	) {
	}

	ngOnInit() {
		this.categories = this.faqService.categories;
		for (const categoryKey in this.categories) {
			if (this.categories.hasOwnProperty(categoryKey)) {
				const categoryValue = this.categories[categoryKey];
				categoryValue.questions.forEach((questionItem) => {
					this.questionsState[questionItem.id] = {
						isOpen: false
					};
				});
			}
		}
	}

	ngOnDestroy() {
	}

	ngAfterViewInit() {
		this.getParamFromUrl('openId')
			.pipe(
				takeUntil(instanceDestroyed(this)),
				filter((openId) => Boolean(this.questionsState[openId]))
			)
			.subscribe((openId) => {
				requestAnimationFrame(() => {
					this.handleOpen(openId);

					requestAnimationFrame(() => {
						this.scrollToElement(openId);
					});
				});
			});
	}

	scrollToElement(elementId: string) {
		const $targetElement = document.getElementById(elementId);
		const $topHeader = document.querySelector('.vtr-menu-main');
		const headerHeight = $topHeader.clientHeight;
		const targetElementY = $targetElement.getBoundingClientRect().top;

		const magicIndent = 20;
		window.scrollTo({
			top: targetElementY - headerHeight - magicIndent,
			behavior: 'smooth'
		});
	}

	handleOpen(id: string) {
		if (this.questionsState[id]) {
			this.closeAllExcept(id);
			this.questionsState[id].isOpen = !this.questionsState[id].isOpen;
		}
	}

	closeAllExcept(id?: string) {
		for (const itemId in this.questionsState) {
			if (this.questionsState.hasOwnProperty(itemId) && itemId !== id) {
				this.questionsState[itemId].isOpen = false;
			}
		}
	}

	private getParamFromUrl(paramName: string) {
		return this.route.queryParams.pipe(
			filter((params) => params[paramName]),
			map((param) => param[paramName]),
		);
	}
}
