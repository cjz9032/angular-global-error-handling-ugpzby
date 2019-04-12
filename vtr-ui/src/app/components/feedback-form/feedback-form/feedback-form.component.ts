import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {VantageShellService} from "../../../services/vantage-shell/vantage-shell.service";

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
	constructor(public activeModal: NgbActiveModal, private shellService: VantageShellService) {
		this.metrics = shellService.getMetrics();
	}
	private metrics: any;
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
