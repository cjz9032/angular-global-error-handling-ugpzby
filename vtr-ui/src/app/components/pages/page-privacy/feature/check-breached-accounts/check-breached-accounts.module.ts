import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailScannerComponent } from './email-scanner/email-scanner.component';
import { CheckBreachesFormComponent } from './check-breaches/check-breaches-form.component';
import { ScanStepsComponent } from './scan-steps/scan-steps.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { EmailScannerService } from './services/email-scanner.service';
import { VtrCommonModule } from '../../common/vtr-common.module';
import { BreachedAccountComponent } from './breached-account/breached-account.component';
import { BreachedDescriptionComponent } from './breached-description/breached-description.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';


@NgModule({
	declarations: [
		EmailScannerComponent,
		CheckBreachesFormComponent,
		ScanStepsComponent,
		ConfirmationPopupComponent,
		BreachedAccountComponent,
		BreachedDescriptionComponent,
		ConfirmationComponent,
	],
	exports: [
		EmailScannerComponent,
		CheckBreachesFormComponent,
		ScanStepsComponent,
		BreachedAccountComponent,
		BreachedDescriptionComponent,
		ConfirmationComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		VtrCommonModule
	],
	providers: [
		EmailScannerService
	]
})
export class CheckBreachedAccountsModule {
}
