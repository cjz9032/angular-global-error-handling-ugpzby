import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { FormsModule } from '@angular/forms';
import { UiRoundedRectangleCustomRadioComponent } from '../ui-rounded-rectangle-custom-radio/ui-rounded-rectangle-custom-radio.component';
import { UiRoundedRectangleCustomRadioListComponent } from './ui-rounded-rectangle-custom-radio-list.component';

@NgModule({
	declarations: [
		UiRoundedRectangleCustomRadioListComponent,
		UiRoundedRectangleCustomRadioComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		MetricsModule
	],
	exports: [
		UiRoundedRectangleCustomRadioListComponent,
		UiRoundedRectangleCustomRadioComponent
	]
})
export class UiRoundedRectangleCustomRadioListModule { }
