import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatTooltipModule } from '@lenovo/material/tooltip';
import { MatSlideToggleModule } from '@lenovo/material/slide-toggle';
import { MaterialModule } from 'src/app/modules/common/material.module';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { TranslationModule } from 'src/app/modules/translation.module';
import { CommonWidgetModule } from 'src/app/modules/common/common-widget.module';
import { CommonUiModule } from 'src/app/modules/common/common-ui.module';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';

import { AutoCloseComponent } from './auto-close.component';
import { WidgetAutoCloseComponent } from './widget-auto-close/widget-auto-close.component';



@NgModule({
	declarations: [
		AutoCloseComponent,
		WidgetAutoCloseComponent,
	],
	exports: [
		AutoCloseComponent,
		WidgetAutoCloseComponent,
	],
	imports: [
		CommonModule,
		CommonWidgetModule,
		CommonUiModule,
		CommonPipeModule,
		TranslationModule.forChild(),
		MetricsModule,
		RouterModule,
		MatTooltipModule,
		MatSlideToggleModule,
		MaterialModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AutoCloseModule { }
