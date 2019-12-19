import { NgModule } from '@angular/core';
import { BacklightComponent } from './backlight.component';
import { CommonUiModule } from '../../../../../../modules/common/common-ui.module';
import { SharedModule } from '../../../../../../modules/shared.module';
import { CommonModule } from '@angular/common';


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
