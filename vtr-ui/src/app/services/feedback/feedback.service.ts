import { Injectable } from '@angular/core';
import { FeedbackFormComponent } from 'src/app/components/feedback-form/feedback-form/feedback-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SurveyFormComponent } from 'src/app/components/feedback-form/survey-form/survey-form.component';

@Injectable({
	providedIn: 'root'
})
export class FeedbackService {

	constructor(
		private modalService: NgbModal,
	) { }

	openFeedbackModal() {
		if (this.modalService.hasOpenModals()) { return; }
		this.modalService.open(FeedbackFormComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			ariaLabelledBy: 'feedback-dialog-basic-title',
			windowClass: 'feedback-modal'
		});
	}

	openSurveyModal(surveyId: string) {
		if (this.modalService.hasOpenModals()) {
			return;
		}

		const modalRef = this.modalService.open(SurveyFormComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			ariaLabelledBy: 'survey-dialog-basic-title',
			windowClass: 'survey-modal'
		});
		modalRef.componentInstance.surveyId = surveyId;
	}
}
