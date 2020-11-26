import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { ContainerCardComponent } from './container-card.component';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SanitizeModule } from 'src/app/modules/sanitize.module';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { TranslationModule } from 'src/app/modules/translation.module';
import { ContainerCardOfflineComponent } from './container-card-offline/container-card-offline.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [ContainerCardComponent, ContainerCardOfflineComponent],
	imports: [
		CommonModule,
		CommonPipeModule,
		TranslationModule.forChild(),
		MetricsModule,
		FontAwesomeModule,
		SanitizeModule,
		AppSearchModule,
		NgbTooltipModule,
		RouterModule,
	],
	exports: [ContainerCardComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ContainerCardModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faArrowRight);
	}
}
