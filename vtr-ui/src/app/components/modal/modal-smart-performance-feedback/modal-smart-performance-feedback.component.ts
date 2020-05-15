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
		{
			likelyValues: [1, 2, 3, 4, 5],
			name: 'fbProductLF',
			question: 'smartPerformance.feedbackContainer.questions.q1',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r1',
				'smartPerformance.feedbackContainer.rating.r2',
			]
		},
		{
			likelyValues: [1, 2, 3, 4, 5],
			name: 'fbFeature',
			question: 'smartPerformance.feedbackContainer.questions.q2',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r3',
				'smartPerformance.feedbackContainer.rating.r4',
			]
		},
		{
			likelyValues: [1, 2, 3, 4, 5],
			name: 'fbScan',
			question: 'smartPerformance.feedbackContainer.questions.q3',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r5',
				'smartPerformance.feedbackContainer.rating.r6',
			]
		},
		{
			likelyValues: [1, 2, 3, 4, 5],
			name: 'fbFixes',
			question: 'smartPerformance.feedbackContainer.questions.q4',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r7',
				'smartPerformance.feedbackContainer.rating.r8',
			]
		},
		{
			likelyValues: [1, 2, 3, 4, 5],
			name: 'fbValueMoney',
			question: 'smartPerformance.feedbackContainer.questions.q5',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r9',
				'smartPerformance.feedbackContainer.rating.r10',
			]
		},
		{
			likelyValues: [1, 2, 3, 4, 5],
			name: 'fbRefer',
			question: 'smartPerformance.feedbackContainer.questions.q6',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r11',
				'smartPerformance.feedbackContainer.rating.r12',
			]
		},

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
			fbProductLF: new FormControl(null),
			fbFeature: new FormControl(null),
			fbScan: new FormControl(null),
			fbFixes: new FormControl(null),
			fbValueMoney: new FormControl(null),
			fbRefer: new FormControl(null),
			fbComment: new FormControl(null),
		});	
	}

	setSubmitButtonActive() {
		let formData = this.feedbackForm.value;
		if (
			(isNull(formData.fbProductLF) || isUndefined(formData.fbProductLF))
			&& (isNull(formData.fbFeature) || isUndefined(formData.fbFeature))
			&& (isNull(formData.fbScan) || isUndefined(formData.fbScan))
			&& (isNull(formData.fbFixes) || isUndefined(formData.fbFixes))
			&& (isNull(formData.fbValueMoney) || isUndefined(formData.fbValueMoney))
			&& (isNull(formData.fbRefer) || isUndefined(formData.fbRefer))
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
				fbProductLF: formData.fbProductLF,
				fbFeature: formData.fbFeature,
				fbScan: formData.fbScan,
				fbFixes: formData.fbFixes,
				fbValueMoney: formData.fbValueMoney,
				fbRefer: formData.fbRefer,
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
