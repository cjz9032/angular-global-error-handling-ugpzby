import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'vtr-feedback-form',
	templateUrl: './feedback-form.component.html',
	styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {
	feedbackForm: FormGroup;
	constructor() { }

	ngOnInit() {
		this.createFeedbackForm();
	}

	public onFeedBackSubmit(): void {
		console.log('onFeedBackSubmit: ', JSON.stringify(this.feedbackForm.value));
		// TODO: integrate with API
	}

	private createFeedbackForm(): void {
		this.feedbackForm = new FormGroup({
			userEmail: new FormControl('', [Validators.email]),
			userComment: new FormControl('', [Validators.required, Validators.minLength(5)])
		});
	}
}
