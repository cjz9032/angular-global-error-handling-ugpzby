import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneClickScanComponent } from './one-click-scan.component';
import { PermitComponent } from './permit/permit.component';
import { EnterEmailComponent } from './enter-email/enter-email.component';

@NgModule({
	declarations: [OneClickScanComponent, PermitComponent, EnterEmailComponent],
	imports: [
		CommonModule
	],
	exports: [OneClickScanComponent],
})
export class OneClickScanModule {
}
