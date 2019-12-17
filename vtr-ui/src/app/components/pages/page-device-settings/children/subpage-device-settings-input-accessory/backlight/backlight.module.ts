import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BacklightComponent } from './backlight.component';
import { CommonUiModule } from '../../../../../../modules/common/common-ui.module';
import { SharedModule } from '../../../../../../modules/shared.module';


@NgModule({
	declarations: [BacklightComponent],
	imports: [
		CommonModule,
		CommonUiModule,
		SharedModule
	],
	exports: [
		BacklightComponent
	]
})
export class BacklightModule {
}
