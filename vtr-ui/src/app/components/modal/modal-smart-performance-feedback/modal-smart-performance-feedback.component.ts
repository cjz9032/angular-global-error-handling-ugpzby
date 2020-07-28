import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
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
	@ViewChild('cross') cross: ElementRef;
	isSubscribed: any;
	isSubmitButtonActive = false;

	questions = [
		/* UnSubscribed Users */
		{
			likelyValues: [1, 2, 3, 4, 5],
			name: 'fbQ1',
			question: 'smartPerformance.feedbackContainer.questions.q1',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r1',
				'smartPerformance.feedbackContainer.rating.r2',
			]
		},
		{
			likelyValues: [1, 2, 3, 4, 5], 
			name: 'fbQ2',
			question: 'smartPerformance.feedbackContainer.questions.q2',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r3',
				'smartPerformance.feedbackContainer.rating.r4',
			]
		},
		{
			likelyValues: [1, 2, 3, 4, 5],
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
			likelyValues: [1, 2, 3, 4, 5],
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
			likelyValues: [1, 2, 3, 4, 5],
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
			LocalStorageKey.IsFreeFullFeatureEnabled
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

		setTimeout(() => {
			this.cross.nativeElement.focus();
		}, 500);
	}

	onFeedBackSubmit() {
		const formData = this.feedbackForm.value;
		let qa = {};
		if(!this.isSubscribed){
			qa = {
				easeOfScanFeature: formData.fbQ1,
				easeOfScanResult: formData.fbQ2,
				likeToPaySubscription: formData.fbQ3,
				overallExperience: formData.fbQ4
			};
		} else {
			qa = {
				easeToUnderstandFixes: formData.fbQ5,
				caughtAnyMalware: formData.fbQ6,
				likedToContinueSubscription: formData.fbQ7,
				overallExperience: formData.fbQ8
			};
		}

		const data = {
			ItemType: 'UserFeedback',
			ItemName: 'btn.sp.submitfeedback',
			ItemParent: 'SmartPerformance.Dialog.Feedback',
			Content: formData.fbComment,
			Subscribed: this.isSubscribed,
			QA: qa
		};
		if (this.metrics) {
			this.metrics.sendAsync(data);
		}
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
