import { NgModule } from '@angular/core';
import { BacklightComponent } from './backlight.component';
import { CommonUiModule } from '../../../../../../modules/common/common-ui.module';
import { SharedModule } from '../../../../../../modules/shared.module';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
	declarations: [BacklightComponent],
	imports: [
		BrowserModule,
		CommonUiModule,
		SharedModule
	],
	exports: [
		BacklightComponent
	]
})
export class BacklightModule {
}
