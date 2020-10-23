import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { LenovoSurveyEnum } from 'src/app/enums/lenovo-survey.enum';

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

	progress = 0;
	constructor(
		public activeModal: NgbActiveModal,
		private translate: TranslateService,
		private localCacheService: LocalCacheService,
		private metricsService: MetricService
	) { }

	private initSurveyQuestions() {
		this.pages = [
			{	// page 1
				summary: 'dashboard.survey.form.page1.summary',
				lineNumber: true,
				questions: [
					{
						name: 'q2_preferred_attribute',
						title: 'dashboard.survey.form.page1.question',
						optionKey: 'dashboard.survey.form.page1.question1.options',
						options: this.translate.instant('dashboard.survey.form.page1.question1.options')
					},
					{
						name: 'q3_preferred_attribute',
						title: 'dashboard.survey.form.page1.question',
						options: this.translate.instant('dashboard.survey.form.page1.question2.options')
					},
					{
						name: 'q4_preferred_attribute',
						title: 'dashboard.survey.form.page1.question',
						optionKey: 'dashboard.survey.form.page1.question3.options',
						options: this.translate.instant('dashboard.survey.form.page1.question3.options')
					},
					{
						name: 'q5_preferred_attribute',
						title: 'dashboard.survey.form.page1.question',
						optionKey: 'dashboard.survey.form.page1.question4.options',
						options: this.translate.instant('dashboard.survey.form.page1.question4.options')
					}
				]
			},
			{	// page 2
				summary: 'dashboard.survey.form.page2.summary',
				questions: [
					{
						name: 'q6_hdr_importrancy',
						title: 'dashboard.survey.form.page2.question1',
						optionKey: 'dashboard.survey.form.page2.options',
						options: this.translate.instant('dashboard.survey.form.page2.options')
					},
					{
						name: 'q6_touchscreen_importrancy',
						title: 'dashboard.survey.form.page2.question2',
						optionKey: 'dashboard.survey.form.page2.options',
						options: this.translate.instant('dashboard.survey.form.page2.options')
					}
				]
			}, {	// page 3
				summary: 'dashboard.survey.form.page3.summary',
				questions: [
					{
						name: 'q7_people_notice_importancy',
						title: 'dashboard.survey.form.page3.question1',
						optionKey: 'dashboard.survey.form.page3.options',
						options: this.translate.instant('dashboard.survey.form.page3.options')
					},
					{
						name: 'q7_material _importancy',
						title: 'dashboard.survey.form.page3.question2',
						optionKey: 'dashboard.survey.form.page3.options',
						options: this.translate.instant('dashboard.survey.form.page3.options')
					}
				]
			},
			{	// page 4
				summary: 'dashboard.survey.form.page4.summary',
				questions: [
					{
						name: 'q8_working_for_job_importancy',
						title: 'dashboard.survey.form.page4.question1',
						optionKey: 'dashboard.survey.form.page4.options',
						options: this.translate.instant('dashboard.survey.form.page4.options')
					},
					{
						name: 'q8_playing_game_importancy',
						title: 'dashboard.survey.form.page4.question2',
						optionKey: 'dashboard.survey.form.page4.options',
						options: this.translate.instant('dashboard.survey.form.page4.options')
					},
					{
						name: 'q8_keeping_up_news_importancy',
						title: 'dashboard.survey.form.page4.question3',
						optionKey: 'dashboard.survey.form.page4.options',
						options: this.translate.instant('dashboard.survey.form.page4.options')
					},
					{
						name: 'q8_watching_movies_importancy',
						title: 'dashboard.survey.form.page4.question4',
						optionKey: 'dashboard.survey.form.page4.options',
						options: this.translate.instant('dashboard.survey.form.page4.options')
					}
				]
			},
			{	// page 5
				questions: [
					{
						name: 'q9_use_of_voice_assistant',
						title: 'dashboard.survey.form.page5.question1.title',
						multipleChoice: true,
						optionKey: 'dashboard.survey.form.page5.question1.options',
						options: this.translate.instant('dashboard.survey.form.page5.question1.options')
					},
					{
						name: 'q10_best_describe_you',
						title: 'dashboard.survey.form.page5.question2.title',
						optionKey: 'dashboard.survey.form.page5.question2.options',
						options: this.translate.instant('dashboard.survey.form.page5.question2.options')
					},
					{
						name: 'q11_spend_on_computer',
						title: 'dashboard.survey.form.page5.question3.title',
						optionKey: 'dashboard.survey.form.page5.question3.options',
						options: this.translate.instant('dashboard.survey.form.page5.question3.options')
					}
				]
			}
		];

	}
	ngOnInit(): void {
		this.initSurveyQuestions();
		this.localCacheService.setLocalCacheValue(this.surveyId as LocalStorageKey, LenovoSurveyEnum.Read);
	}

	closeModal() {
		this.activeModal.close('close');
	}

	setRadioStatus(page: number, question: string, event: any) {
		if (!this.pages[page].results) {
			this.pages[page].results = {};
		}

		this.pages[page].results[question] = event.target.value;
	}

	exclusiveAgainstLastOption(page: number, question: string, event: any) {
		const inputCtrls = document.querySelectorAll(`input[name="${question}"]`);
		if (!event.target.checked) {
			this.pages[page].results[question].delete(event.target.value);
			return;
		}

		if (event.target === inputCtrls[inputCtrls.length - 1]) {
			for (let i = 0; i < inputCtrls.length - 1; i++) {
				const inputCtrl: any = inputCtrls[i];
				inputCtrl.checked = false;
			}
			this.pages[page].results[question] = new Set(); // remove all option
		}
		else {
			const inputCtrl: any = inputCtrls[inputCtrls.length - 1];
			inputCtrl.checked = false;
			this.pages[page].results[question].delete(inputCtrls.length);
		}
		this.pages[page].results[question].add(event.target.value);
	}

	setCheckboxStatus(page: number, question: string, event: any) {
		if (!this.pages[page].results) {
			this.pages[page].results = {};
		}

		if (!this.pages[page].results[question]) {
			this.pages[page].results[question] = new Set();
		}

		if (question === 'q9_use_of_voice_assistant') {
			this.exclusiveAgainstLastOption(page, question, event);
		} else {
			if (event.target.checked) {
				this.pages[page].results[question].add(event.target.value);
			} else {
				this.pages[page].results[question].delete(event.target.value);
			}
		}
	}

	disableNextButton() {
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
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SurveyVAN22149, true);
			this.localCacheService.setLocalCacheValue(this.surveyId as LocalStorageKey, LenovoSurveyEnum.Completed);
			this.reportResult();
			setTimeout(() => {
				this.activeModal.close('close');
			}, 3000);
		}
	}

	reportResult(): void {
		const data = {
			ItemType: 'LenovoSurvey',
			id: this.surveyId,
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
}
