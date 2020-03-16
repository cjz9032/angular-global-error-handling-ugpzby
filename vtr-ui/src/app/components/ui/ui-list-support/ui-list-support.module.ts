import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faChevronCircleRight } from '@fortawesome/pro-light-svg-icons/faChevronCircleRight';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons/faChevronRight';
import { RouterModule } from '@angular/router';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
import { UiListSupportComponent } from './ui-list-support.component';


@NgModule({
	declarations: [
		UiListSupportComponent
	],
	exports: [
		UiListSupportComponent
	],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
		CommonPipeModule,
		FontAwesomeModule,
		RouterModule,
		MetricsModule,
		AppSearchModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class UiListSupportModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faQuestionCircle);
		library.addIcons(faChevronCircleRight);
		library.addIcons(faCheck);
		library.addIcons(faTimes);
		library.addIcons(faCircle);
		library.addIcons(faMinus);
		library.addIcons(faChevronRight);
	}
}
