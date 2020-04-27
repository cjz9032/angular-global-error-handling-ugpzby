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
		if (this.modalService.hasOpenModals()) return;
		this.modalService.open(FeedbackFormComponent, {
			backdrop: true,
			size: 'lg',
			centered: true,
			ariaLabelledBy: 'feedback-dialog-basic-title',
			windowClass: 'feedback-modal'
		});
	}

}
