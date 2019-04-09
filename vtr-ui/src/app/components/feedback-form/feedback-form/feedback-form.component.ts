import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
		this.feedbackButtonText = this.buttonText;
		this.createFeedbackForm();
	}

	public onFeedBackSubmit($event): void {
		const formData = this.feedbackForm.value;
		console.log('onFeedBackSubmit: ', JSON.stringify(formData), $event);
		this.feedbackForm.reset();
		// TODO: integrate with API
		this.feedbackClick.emit($event);
		this.feedbackButtonText = 'Thank you for your feedback !';
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
