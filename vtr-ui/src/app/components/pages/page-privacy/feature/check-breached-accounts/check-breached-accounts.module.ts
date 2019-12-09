import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailScannerComponent } from './email-scanner/email-scanner.component';
import { CheckBreachesFormComponent } from './check-breaches/check-breaches-form.component';
import { ScanStepsComponent } from './scan-steps/scan-steps.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VtrCommonModule } from '../../common/vtr-common.module';
import { BreachedAccountComponent } from './breached-account/breached-account.component';
import { BreachedDescriptionComponent } from './breached-description/breached-description.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { BreachedOtherDescriptionComponent } from './breached-other-description/breached-other-description.component';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ScanLimitPitchComponent } from './email-scanner/scan-limit-pitch/scan-limit-pitch.component';
import { RouterModule } from '@angular/router';
import { FakeBreachesComponent } from './fake-breaches/fake-breaches.component';
import { ExitPitchComponent } from './exit-pitch/exit-pitch.component';

@NgModule({
	declarations: [
		EmailScannerComponent,
		CheckBreachesFormComponent,
		ScanStepsComponent,
		ConfirmationComponent,
		BreachedAccountComponent,
		BreachedDescriptionComponent,
		ConfirmationComponent,
		BreachedOtherDescriptionComponent,
		VerifyEmailComponent,
		ScanLimitPitchComponent,
		FakeBreachesComponent,
		ExitPitchComponent,
	],
	exports: [
		EmailScannerComponent,
		CheckBreachesFormComponent,
		ScanStepsComponent,
		BreachedAccountComponent,
		BreachedDescriptionComponent,
		ConfirmationComponent,
		BreachedOtherDescriptionComponent,
		VerifyEmailComponent,
		ExitPitchComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		VtrCommonModule,
		AppSearchModule,
		RouterModule
	],
})
export class CheckBreachedAccountsModule {
}
