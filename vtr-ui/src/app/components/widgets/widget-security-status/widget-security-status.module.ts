import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { WidgetSecurityStatusComponent } from './widget-security-status.component';
import { WidgetStatusComponent } from '../widget-status/widget-status.component';
import { MaterialChevronModule } from 'src/app/material/material-chevron/material-chevron.module';

@NgModule({
	declarations: [WidgetStatusComponent, WidgetSecurityStatusComponent],
	exports: [WidgetStatusComponent, WidgetSecurityStatusComponent],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
		MaterialChevronModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class WidgetSecurityStatusModule { }
