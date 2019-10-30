import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-feedback-form',
	templateUrl: './feedback-form.component.html',
	styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {
	feedbackForm: FormGroup;
	feedbackSuccess = false;
	leftTime = 3;

	private metrics: any;

	questions = [
		{
			idYes: 'feedback-qa-new-style-yes',
			idNo: 'feedback-qa-new-style-no',
			name: 'qaNewStyle',
			question: 'dashboard.feedback.form.question1'
		},
		{
			idYes: 'feedback-qa-performance-yes',
			idNo: 'feedback-performance-no',
			name: 'qaPerformance',
			question: 'dashboard.feedback.form.question2'
		},
		{
			idYes: 'feedback-qa-use-frequency-yes',
			idNo: 'feedback-qa-use-frequency-no',
			name: 'qaUseFrequency',
			question: 'dashboard.feedback.form.question3'
		}
	];

	constructor(
		public activeModal: NgbActiveModal,
		private shellService: VantageShellService,
		private deviceService: DeviceService
	) {
		this.metrics = this.shellService.getMetrics();
	}

	ngOnInit() {
		this.createFeedbackForm();
		setTimeout(() => { document.getElementById('feedback-form-dialog').parentElement.parentElement.parentElement.parentElement.focus(); }, 0);
	}

	public onFeedBackSubmit(): void {
		const formData = this.feedbackForm.value;
		const data = {
			ItemType: 'UserFeedback',
			ItemName: 'Submit',
			ItemParent: 'Dialog.Feedback',
			Content: formData.userComment,
			QA: {
				QaNewStyle: formData.qaNewStyle,
				QaPerformance: formData.qaPerformance,
				QaUseFrequency: formData.qaUseFrequency
			}
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

	private createFeedbackForm(): void {
		this.feedbackForm = new FormGroup({
			// userEmail: new FormControl('', [Validators.email]),
			userComment: new FormControl('', [
				Validators.required,
				Validators.minLength(1)
			]),
			qaNewStyle: new FormControl(null),
			qaPerformance: new FormControl(null),
			qaUseFrequency: new FormControl(null)
		});
	}

	public goToMailUtility() {
		const email = 'vantageteam@lenovo.com';
		const subject = 'vantage%203.0%20program%20feedback';
		const uriPath = 'mailto:' + email + '?subject=' + subject;
		this.deviceService.launchUri(uriPath);
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.feedback-modal') as HTMLElement;
		modal.focus();
	}

	setRadioStatus(name: string, status: boolean) {
		this.feedbackForm.patchValue({ [name]: status });
	}
}
