import { Component, HostListener, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { LenovoSurveyEnum } from 'src/app/enums/lenovo-survey.enum';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';

@Component({
	selector: 'vtr-survey-form',
	templateUrl: './survey-form.component.html',
	styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent implements OnInit {
	surveyId = '';
	pages: any = [];
	result: any = {};
	completed = false;
	closingleftTime = 3;
	progress = 0;

	constructor(
		public activeModal: NgbActiveModal,
		private translate: TranslateService,
		private localCacheService: LocalCacheService,
		private metricsService: MetricService,
		private appForYouService: AppsForYouService
	) { }

	private initSurveyQuestions() {
		this.pages = [];
		for (let i = 0; i < 5; i++) {	// page5 has no summary
			this.pages.push({
				summary: i !== 4 ? `dashboard.survey.form.page${i + 1}.summary` : '',
				questions: [],
				results: {}
			});
		}

		const page1Questions = this.pages[0].questions;
		for (let i = 0; i < 4; i++) {
			page1Questions.push({
				name: `dashboard.survey.form.page1.question${i + 1}`,
				title: 'dashboard.survey.form.page1.question',
				optionKey: `dashboard.survey.form.page1.question${i + 1}.options`,
				options: this.translate.instant(`dashboard.survey.form.page1.question${i + 1}.options`)
			});
		}

		const page2Questions = this.pages[1].questions;
		const p2Options = this.translate.instant('dashboard.survey.form.page2.options');
		for (let i = 0; i < 2; i++) {
			page2Questions.push({
				name: `dashboard.survey.form.page2.question${i + 1}`,
				title: `dashboard.survey.form.page2.question${i + 1}`,
				optionKey: 'dashboard.survey.form.page2.options',
				options: p2Options
			});
		}

		const page3Questions = this.pages[2].questions;
		const p3Options = this.translate.instant('dashboard.survey.form.page3.options');
		for (let i = 0; i < 2; i++) {
			page3Questions.push({
				name: `dashboard.survey.form.page3.question${i + 1}`,
				title: `dashboard.survey.form.page3.question${i + 1}`,
				optionKey: 'dashboard.survey.form.page3.options',
				options: p3Options
			});
		}

		const page4Questions = this.pages[3].questions;
		const p4Options = this.translate.instant('dashboard.survey.form.page4.options');
		for (let i = 0; i < 4; i++) {
			page4Questions.push({
				name: `dashboard.survey.form.page4.question${i + 1}`,
				title: `dashboard.survey.form.page4.question${i + 1}`,
				optionKey: 'dashboard.survey.form.page4.options',
				options: p4Options
			});
		}

		const page5Questions = this.pages[4].questions;
		for (let i = 0; i < 3; i++) {
			page5Questions.push( {
				name: `dashboard.survey.form.page5.question${i + 1}`,
				title: `dashboard.survey.form.page5.question${i + 1}.title`,
				optionKey: `dashboard.survey.form.page5.question${i + 1}.options`,
				options: this.translate.instant(`dashboard.survey.form.page5.question${i + 1}.options`)
			});
		}
		page5Questions[0].multipleChoice = true;
	}

	ngOnInit(): void {
		this.initSurveyQuestions();
		this.localCacheService.setLocalCacheValue(this.surveyId as LocalStorageKey, LenovoSurveyEnum.Read);
	}

	closeModal() {
		this.activeModal.close('close');
	}

	exclusiveAgainstLastOption(page: any, qa: any, value: number) {
		if (value === qa.options?.length) {	// last option
			page.results[qa.name] = new Set();	// remove all values when add the value of last option
		} else {	// not last option
			page.results[qa.name].delete(qa.options?.length); // delete the value of last option
		}
	}

	setRadioStatus(page: any, qaName: string, value: number) {
		page.results[qaName] = value;
	}


	setCheckboxStatus(page: any, qa: any, value: number) {
		if (!page.results) {
			page.results = {};
		}

		if (!page.results[qa.name]) {
			page.results[qa.name] = new Set();
		}

		if (qa.name === 'dashboard.survey.form.page5.question1') {
			this.exclusiveAgainstLastOption(page, qa, value);
		}

		if (page.results[qa.name].has(value)) {
			page.results[qa.name].delete(value);
		} else {
			page.results[qa.name].add(value);
		}
	}

	disableNextOrSubmit() {
		if (!this.pages[this.progress] || !this.pages[this.progress].results) {
			return true;
		}

		const results = Object.values(this.pages[this.progress].results).filter(qaResult => {
			if (!qaResult) {
				return false;
			}

			if (typeof qaResult !== 'object') {
				return true;
			}

			const resultSet = qaResult as Set<string>;

			return resultSet.size > 0;
		});

		return results.length !== this.pages[this.progress].questions.length;
	}

	onClickNextOrSumbit(): void {
		this.progress += 1;
		if (this.progress === this.pages.length) {
			this.completed = true;
			this.localCacheService.setLocalCacheValue(this.surveyId as LocalStorageKey, LenovoSurveyEnum.Completed);
			this.appForYouService.lenovoSurvey.display = false;
			this.reportResult();
			const leftTimeInterval = setInterval(() => {
				this.closingleftTime--;
				if (this.closingleftTime <= 0) {
					this.activeModal.close();
					clearInterval(leftTimeInterval);
				}
			}, 1000);
		}
	}

	reportResult(): void {
		const data = {
			ItemType: 'LenovoSurvey',
			id: this.surveyId,
			version: '1.0.0.0',
			qa: {}
		};

		this.pages.forEach(page => {
			page.questions.forEach(question => {
				let result = page.results[question.name];
				if (typeof result === 'object') {
					result = Array.from(result);
				}
				data.qa[question.name] = result;
			});
		});

		this.metricsService.sendMetricsForcibly(data);
	}

	submitBtnText() {
		return this.progress < this.pages.length - 1 ? 'next' : 'submit';
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.survey-modal') as HTMLElement;
		modal.focus();
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (event.shiftKey &&
			event.key === 'Tab' &&
			document.activeElement
		) {
			const activeElm: any = document.activeElement;
			if (activeElm.type === 'radio' && activeElm.name?.indexOf('.question1') !== -1) {
				document.getElementById('survey-modal-btn-close').focus();
				event.preventDefault();
			}
		}
	}
}
