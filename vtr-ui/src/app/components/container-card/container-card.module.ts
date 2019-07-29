import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { ContainerCardComponent } from './container-card.component';
import { MetricsModule } from 'src/app/directives/metrics.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SanitizeModule } from 'src/app/modules/sanitize.module';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faArrowRight);

@NgModule({
	declarations: [
		ContainerCardComponent,

	],
	imports: [
		CommonModule,
		CommonPipeModule,
		MetricsModule,
		FontAwesomeModule,
		SanitizeModule
	],
	exports: [
		ContainerCardComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class ContainerCardModule { }
