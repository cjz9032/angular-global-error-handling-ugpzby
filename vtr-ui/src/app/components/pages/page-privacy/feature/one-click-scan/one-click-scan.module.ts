import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneClickScanComponent } from './one-click-scan.component';
import { PermitTrackersAndPasswordsComponent } from './permit/permit-trackers-and-passwords.component';
import { EnterEmailComponent } from './enter-email/enter-email.component';

@NgModule({
	declarations: [OneClickScanComponent, PermitTrackersAndPasswordsComponent, EnterEmailComponent],
	imports: [
		CommonModule
	],
	exports: [OneClickScanComponent],
})
export class OneClickScanModule {
}
