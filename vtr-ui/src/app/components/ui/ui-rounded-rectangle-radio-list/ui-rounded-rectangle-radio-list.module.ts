import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { FormsModule } from '@angular/forms';
import { UiRoundedRectangleRadioListComponent } from './ui-rounded-rectangle-radio-list.component';
@NgModule({
	declarations: [
		UiRoundedRectangleRadioListComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		MetricsModule,
	],
	exports:[
		UiRoundedRectangleRadioListComponent
	]
})
export class UiRoundedRectangleRadioListModule { }
