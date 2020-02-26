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
	countryCode = '';

	private metrics: any;

	questions = [
		{
			likelyValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			name: 'remommendVantageToFriend',
			question: 'dashboard.feedback.form.question6'
		},
		{
			idYes: 'feedback-su-awareness-yes',
			idNo: 'feedback-su-awareness-no',
			name: 'systemUpdateAwareness',
			question: 'dashboard.feedback.form.question7'
		},
		{
			idYes: 'feedback-qa-new-style-yes',
			idNo: 'feedback-qa-new-style-no',
			name: 'qaNewStyle',
			question: 'dashboard.feedback.form.question8'
		}
	];
	showEmailField = true;

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
		this.getCurrentRegion();
	}

	 getCurrentRegion() {
		 this.deviceService.getMachineInfo().then(machineInfo => {
			 this.countryCode = machineInfo.country.toUpperCase();
			 if (this.countryCode === 'CN' ||
				 this.countryCode === 'VN' ||
				 this.countryCode === 'RU') {
				 this.showEmailField = false;
			 }
		 });
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
				SystemUpdateAwareness: formData.systemUpdateAwareness,
				RemommendVantageToFriend: formData.remommendVantageToFriend
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
			userEmail: new FormControl('', [Validators.email]),
			userComment: new FormControl('', [
				Validators.required,
				Validators.minLength(1)
			]),
			qaNewStyle: new FormControl(null),
			systemUpdateAwareness: new FormControl(null),
			remommendVantageToFriend: new FormControl(null)
		});
	}

	public goToMailUtility() {
		const email = 'vantageteam@lenovo.com';
		const subject = 'vantage%203%20program%20feedback';
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

	setLikelyStatus(name: string, status: number) {
		this.feedbackForm.patchValue({ [name]: status });
	}
}
