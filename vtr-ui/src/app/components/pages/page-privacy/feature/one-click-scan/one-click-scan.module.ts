import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneClickScanComponent } from './one-click-scan.component';
import { PermitTrackersAndPasswordsComponent } from './permit-trackers-and-passwords/permit-trackers-and-passwords.component';
import { EnterEmailComponent } from './enter-email/enter-email.component';
import { ComponentsModule } from '../../common/components/components.module';

@NgModule({
	declarations: [OneClickScanComponent, PermitTrackersAndPasswordsComponent, EnterEmailComponent],
	imports: [
		CommonModule,
		ComponentsModule,
	],
	exports: [OneClickScanComponent],
})
export class OneClickScanModule {
}
