import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneClickScanComponent } from './one-click-scan.component';
import { EnterEmailComponent } from './enter-email/enter-email.component';
import { ComponentsModule } from '../../common/components/components.module';
import { CheckBreachedAccountsModule } from '../check-breached-accounts/check-breached-accounts.module';
import { ScanningComponent } from './scanning/scanning.component';
import { VtrCommonModule } from '../../common/vtr-common.module';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [OneClickScanComponent, EnterEmailComponent, ScanningComponent],
	imports: [
		CommonModule,
		RouterModule,
		ComponentsModule,
		CheckBreachedAccountsModule,
		VtrCommonModule
	],
	exports: [OneClickScanComponent],
})
export class OneClickScanModule {
}
