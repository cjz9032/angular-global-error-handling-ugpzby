import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'vtr-feedback-form',
	templateUrl: './feedback-form.component.html',
	styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {
	@Output() feedbackClick = new EventEmitter<any>();
	@Input() buttonText = 'Submit';
	feedbackForm: FormGroup;
	constructor() { }

	ngOnInit() {
		this.createFeedbackForm();
	}

	public onFeedBackSubmit($event): void {
		const formData = this.feedbackForm.value;
		console.log('onFeedBackSubmit: ', JSON.stringify(formData), $event);
		this.feedbackForm.reset();
		// TODO: integrate with API

		this.feedbackClick.emit($event);
	}

	private createFeedbackForm(): void {
		this.feedbackForm = new FormGroup({
			userEmail: new FormControl('', [Validators.email]),
			userComment: new FormControl('', [Validators.required, Validators.minLength(5)])
		});
	}
}
