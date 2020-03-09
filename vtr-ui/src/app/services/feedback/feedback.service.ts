import { Injectable } from '@angular/core';
import { FeedbackFormComponent } from 'src/app/components/feedback-form/feedback-form/feedback-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
	providedIn: 'root'
})
export class FeedbackService {

	constructor(
		private modalService: NgbModal,
	) { }

	openFeedbackModal() {
		this.modalService.open(FeedbackFormComponent, {
			backdrop: true,
			size: 'lg',
			centered: true,
			windowClass: 'feedback-modal'
		});
	}

}
