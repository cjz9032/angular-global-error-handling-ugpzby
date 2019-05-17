import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneClickScanComponent } from './one-click-scan.component';
import { PermitComponent } from './permit/permit.component';
import { PermitDirective } from './permit.directive';

@NgModule({
	declarations: [OneClickScanComponent, PermitComponent, PermitDirective],
	imports: [
		CommonModule
	],
	exports: [OneClickScanComponent],
	entryComponents: [PermitComponent]
})
export class OneClickScanModule {
}
