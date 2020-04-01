import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { UiCustomSliderComponent } from './ui-custom-slider.component';
@NgModule({
	declarations: [
		UiCustomSliderComponent
	],
	imports: [
		CommonModule,
		MetricsModule,
	],
	exports:[
		UiCustomSliderComponent
	]
})
export class UiCustomSliderModule { }
