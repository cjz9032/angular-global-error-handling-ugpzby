import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { FormsModule } from '@angular/forms';
import { UiCustomSwitchComponent } from './ui-custom-switch.component';
@NgModule({
	declarations: [
		UiCustomSwitchComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		MetricsModule,
	],
	exports:[
		UiCustomSwitchComponent
	]
})
export class UiCustomSwitchModule { }
