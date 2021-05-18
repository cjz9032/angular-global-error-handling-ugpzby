import { Injectable } from '@angular/core';
import { MatDialog } from '@lenovo/material/dialog';

import { SurveyFormComponent } from 'src/app/components/feedback-form/survey-form/survey-form.component';

@Injectable({
	providedIn: 'root',
})
export class FeedbackService {
	constructor(private dialog: MatDialog) { }

	openSurveyModal(surveyId: string) {
		if (this.dialog.openDialogs.length) {
			return;
		}

		const modalRef = this.dialog.open(SurveyFormComponent, {
			maxWidth: '50rem',
			autoFocus: false,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'survey-modal',
			ariaLabelledBy: 'survey-dialog-basic-title',
		});
		modalRef.componentInstance.surveyId = surveyId;
	}
}
