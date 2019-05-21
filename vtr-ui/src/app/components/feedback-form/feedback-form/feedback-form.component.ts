import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from "../../../services/vantage-shell/vantage-shell.service";
import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'vtr-feedback-form',
	templateUrl: './feedback-form.component.html',
	styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {
	@Output() feedbackClick = new EventEmitter<any>();
	@Input() buttonText = 'Submit';
	feedbackForm: FormGroup;
	feedbackButtonText: string;

	constructor(public activeModal: NgbActiveModal, private shellService: VantageShellService,
		private translate: TranslateService) {
		this.metrics = shellService.getMetrics();
	}
	private metrics: any;

	ngOnInit() {
		this.buttonText=this.translate.instant('dashboard.feedback.form.button');
		this.feedbackButtonText = this.buttonText;
		this.createFeedbackForm();
	}



	public onFeedBackSubmit($event): void {
		const formData = this.feedbackForm.value;
		var data = {
			"ItemType": "UserFeedback",
			"ItemName": "Submit",
			"ItemParent": "Dialog.Feedback",
			"UserEmail": formData.userEmail,
			"Content": formData.userComment
		}
		this.metrics.sendAsync(data);
		console.log('onFeedBackSubmit: ', JSON.stringify(data), $event);
		this.feedbackForm.reset();
		// TODO: integrate with API
		this.feedbackClick.emit($event);
		this.feedbackButtonText = this.translate.instant('dashboard.feedback.form.messages.feedbackSuccess');  //'Thank you for your feedback !';
		setTimeout(() => {
			this.activeModal.close();
			this.feedbackButtonText = this.buttonText;
		}, 3000);
	}

	private createFeedbackForm(): void {
		this.feedbackForm = new FormGroup({
			userEmail: new FormControl('', [Validators.email]),
			userComment: new FormControl('', [Validators.required, Validators.minLength(1)])
		});
	}
}
