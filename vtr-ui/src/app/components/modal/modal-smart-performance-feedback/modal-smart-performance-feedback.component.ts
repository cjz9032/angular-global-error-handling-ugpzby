import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { FormGroup, FormControl } from '@angular/forms';
import { isNull, isUndefined } from 'util';

@Component({
	selector: 'vtr-modal-smart-performance-feedback',
	templateUrl: './modal-smart-performance-feedback.component.html',
	styleUrls: ['./modal-smart-performance-feedback.component.scss']
})
export class ModalSmartPerformanceFeedbackComponent implements OnInit {
	selected: number;
	radioSelected: any;

	isSubscribed: any;
	isSubmitButtonActive = false;

	questions = [
		/* UnSubscribed Users */
		{
			likelyValues: [0, 1, 2, 3, 4, 5],
			name: 'fbQ1',
			question: 'smartPerformance.feedbackContainer.questions.q1',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r1',
				'smartPerformance.feedbackContainer.rating.r2',
			]
		},
		{
			likelyValues: [0, 1, 2, 3, 4, 5], 
			name: 'fbQ2',
			question: 'smartPerformance.feedbackContainer.questions.q2',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r3',
				'smartPerformance.feedbackContainer.rating.r4',
			]
		},
		{
			likelyValues: [0, 1, 2, 3, 4, 5],
			name: 'fbQ3',
			question: 'smartPerformance.feedbackContainer.questions.q3',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r5',
				'smartPerformance.feedbackContainer.rating.r6',
			]
		},
		{
			likelyValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			name: 'fbQ4',
			question: 'smartPerformance.feedbackContainer.questions.q4',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r7',
				'smartPerformance.feedbackContainer.rating.r8',
			]
		},
		/* Subscribed Users */
		{
			likelyValues: [0, 1, 2, 3, 4, 5],
			name: 'fbQ5',
			question: 'smartPerformance.feedbackContainer.questions.q5',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r9',
				'smartPerformance.feedbackContainer.rating.r10',
			]
		},
		{
			ynValues: ['Yes','No'],
			name: 'fbQ6',
			question: 'smartPerformance.feedbackContainer.questions.q6',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r11',
				'smartPerformance.feedbackContainer.rating.r12',
			]
		},
		{
			likelyValues: [0, 1, 2, 3, 4, 5],
			name: 'fbQ7',
			question: 'smartPerformance.feedbackContainer.questions.q7',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r13',
				'smartPerformance.feedbackContainer.rating.r14',
			]
		},
		{
			likelyValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			name: 'fbQ8',
			question: 'smartPerformance.feedbackContainer.questions.q8',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r15',
				'smartPerformance.feedbackContainer.rating.r16',
			]
		}

	];

	private metrics: any;
	feedbackForm: FormGroup;
	feedbackSuccess = false;
	leftTime = 3;

	constructor(public activeModal: NgbActiveModal,
		private commonService: CommonService,
		private shellService: VantageShellService
	) { 
		this.metrics = this.shellService.getMetrics();
	}

	ngOnInit(): void {
		this.isSubscribed = this.commonService.getLocalStorageValue(
			LocalStorageKey.IsSmartPerformanceSubscribed
		);

		//generating the form
		this.feedbackForm = new FormGroup({
			fbQ1: new FormControl(null),
			fbQ2: new FormControl(null),
			fbQ3: new FormControl(null),
			fbQ4: new FormControl(null),
			fbQ5: new FormControl(null),
			fbQ6: new FormControl(null),
			fbQ7: new FormControl(null),
			fbQ8: new FormControl(null),
			fbComment: new FormControl(null),
		});	
	}

	setSubmitButtonActive() {
		let formData = this.feedbackForm.value;
		if (
			(isNull(formData.fbQ1) || isUndefined(formData.fbQ1))
			&& (isNull(formData.fbQ2) || isUndefined(formData.fbQ2))
			&& (isNull(formData.fbQ3) || isUndefined(formData.fbQ3))
			&& (isNull(formData.fbQ4) || isUndefined(formData.fbQ4))
			&& (isNull(formData.fbQ5) || isUndefined(formData.fbQ5))
			&& (isNull(formData.fbQ6) || isUndefined(formData.fbQ6))
			&& (isNull(formData.fbQ7) || isUndefined(formData.fbQ7))
			&& (isNull(formData.fbQ8) || isUndefined(formData.fbQ8))
			&& (isNull(formData.fbComment) || isUndefined(formData.fbComment) || formData.fbComment=='')
		) {
			this.isSubmitButtonActive = false;
			return false;
		} 

		this.isSubmitButtonActive = true;
		return true;
	}

	onFeedBackSubmit() {
		const formData = this.feedbackForm.value;
		const data = {
			ItemType: 'UserFeedback',
			ItemName: 'Submit',
			ItemParent: 'Dialog.Feedback',
			Content: formData.fbComment,
			Subscribed: this.isSubscribed,
			QA: {
				fbQ1: formData.fbQ1,
				fbQ2: formData.fbQ2,
				fbQ3: formData.fbQ3,
				fbQ4: formData.fbQ4,
				fbQ5: formData.fbQ5,
				fbQ6: formData.fbQ6,
				fbQ7: formData.fbQ7,
				fbQ8: formData.fbQ8,
				fbComment: formData.fbComment,
			}
		};
		// if (this.metrics) {
		// 	this.metrics.sendAsync(data);
		// }
		this.feedbackForm.reset();
		this.feedbackSuccess = true;
		const leftTimeInterval = setInterval(() => {
			this.leftTime--;
			if (this.leftTime <= 0) {
				this.activeModal.close();
				clearInterval(leftTimeInterval);
			}
		}, 1000);
	}

	closeModal() {
		this.activeModal.close('close');
	}

	/*isSelected(value: number, secondValue: number, thirdValue: number) {
		this.selected = value;
		this.radioSelected = this.questions[thirdValue].question[secondValue];
	}*/
}
