import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailScannerComponent } from './email-scanner/email-scanner.component';
import { CheckBreachesFormComponent } from './check-breaches/check-breaches-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VtrCoreModule } from '../../core/vtr-core.module';
import { BreachedAccountComponent } from './breached-account/breached-account.component';
import { BreachedDescriptionComponent } from './breached-description/breached-description.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { BreachedOtherDescriptionComponent } from './breached-other-description/breached-other-description.component';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ScanLimitPitchComponent } from './email-scanner/scan-limit-pitch/scan-limit-pitch.component';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [
		EmailScannerComponent,
		CheckBreachesFormComponent,
		ConfirmationComponent,
		BreachedAccountComponent,
		BreachedDescriptionComponent,
		ConfirmationComponent,
		BreachedOtherDescriptionComponent,
		VerifyEmailComponent,
		ScanLimitPitchComponent,
	],
	exports: [
		EmailScannerComponent,
		CheckBreachesFormComponent,
		BreachedAccountComponent,
		BreachedDescriptionComponent,
		ConfirmationComponent,
		BreachedOtherDescriptionComponent,
		VerifyEmailComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		VtrCoreModule,
		AppSearchModule,
		RouterModule
	],
})
export class CheckBreachedAccountsModule {
}
