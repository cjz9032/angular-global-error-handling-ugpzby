import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { FormsModule } from '@angular/forms';
import { UiCustomSwitchComponent } from './ui-custom-switch.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCircleNotch } from '@fortawesome/pro-light-svg-icons/faCircleNotch';
import { SpinnerModule } from '../../common/spinner/spinner.module';
@NgModule({
	declarations: [
		UiCustomSwitchComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		MetricsModule,
		FontAwesomeModule,
		SpinnerModule
	],
	exports: [
		UiCustomSwitchComponent
	]
})
export class UiCustomSwitchModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faCircleNotch);
	}
}
