import { Injectable } from '@angular/core';
import { MatDialog } from '@lenovo/material/dialog';

import { FeedbackFormComponent } from 'src/app/components/feedback-form/feedback-form/feedback-form.component';
import { SurveyFormComponent } from 'src/app/components/feedback-form/survey-form/survey-form.component';


@Injectable({
	providedIn: 'root',
})
export class FeedbackService {
	constructor(
		private dialog: MatDialog,
	) { }

	openFeedbackModal() {
		if (this.dialog.openDialogs.length) {
			return;
		}
		this.dialog.open(FeedbackFormComponent, {
			maxWidth: '50rem',
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'feedback-modal',
			ariaLabelledBy: 'feedback-dialog-basic-title',
		});
	}

	openSurveyModal(surveyId: string) {
		if (this.dialog.openDialogs.length) {
			return;
		}

		const modalRef = this.dialog.open(SurveyFormComponent, {
			maxWidth: '50rem',
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'survey-modal',
			ariaLabelledBy: 'survey-dialog-basic-title',
		});
		modalRef.componentInstance.surveyId = surveyId;
	}
}
