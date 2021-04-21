import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@lenovo/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';

import { TranslationModule } from 'src/app/modules/translation.module';
import { MetricsModule } from 'src/app/services/metric/metrics.module';

import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { MaterialPickerComponent } from './material-picker/material-picker.component';

@NgModule({
	declarations: [DateTimePickerComponent, MaterialPickerComponent],
	exports: [DateTimePickerComponent, MaterialPickerComponent],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
		MetricsModule,
		MatIconModule,
		OverlayModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialDateTimePickerModule {}
