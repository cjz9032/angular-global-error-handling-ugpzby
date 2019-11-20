import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneClickScanComponent } from './one-click-scan.component';
import { EnterEmailComponent } from './enter-email/enter-email.component';
import { ComponentsModule } from '../../core/components/components.module';
import { CheckBreachedAccountsModule } from '../check-breached-accounts/check-breached-accounts.module';
import { ScanningComponent } from './scanning/scanning.component';
import { VtrCoreModule } from '../../core/vtr-core.module';
import { RouterModule } from '@angular/router';
import { PermitTrackersAndPasswordsComponent } from './permit-trackers-and-passwords/permit-trackers-and-passwords.component';
import { ProgressBarComponent } from './scanning/progress-bar/progress-bar.component';
import { StepsViewComponent } from './steps-view/steps-view.component';

@NgModule({
	declarations: [
		OneClickScanComponent,
		EnterEmailComponent,
		ScanningComponent,
		PermitTrackersAndPasswordsComponent,
		ProgressBarComponent,
		StepsViewComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		ComponentsModule,
		CheckBreachedAccountsModule,
		VtrCoreModule
	],
	exports: [OneClickScanComponent],
})
export class OneClickScanModule {
}
