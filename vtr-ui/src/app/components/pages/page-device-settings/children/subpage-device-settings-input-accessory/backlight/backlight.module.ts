import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BacklightComponent } from './backlight.component';
import { BacklightService } from './backlight.service';
import { CommonUiModule } from '../../../../../../modules/common/common-ui.module';


@NgModule({
	declarations: [BacklightComponent],
	imports: [
		CommonModule,
		CommonUiModule
	],
	exports: [
		BacklightComponent
	]
})
export class BacklightModule {
}
