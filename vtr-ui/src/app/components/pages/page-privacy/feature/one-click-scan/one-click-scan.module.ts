import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneClickScanComponent } from './one-click-scan.component';
import { EnterEmailComponent } from './enter-email/enter-email.component';
import { ComponentsModule } from '../../common/components/components.module';
import { CheckBreachedAccountsModule } from '../check-breached-accounts/check-breached-accounts.module';
import { ScanningComponent } from './scanning/scanning.component';

@NgModule({
	declarations: [OneClickScanComponent, EnterEmailComponent, ScanningComponent],
	imports: [
		CommonModule,
		ComponentsModule,
		CheckBreachedAccountsModule,
	],
	exports: [OneClickScanComponent],
})
export class OneClickScanModule {
}
