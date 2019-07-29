import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { UiListChevronComponent } from './ui-list-chevron.component';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faChevronCircleRight } from '@fortawesome/pro-light-svg-icons/faChevronCircleRight';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons/faChevronRight';
import { RouterModule } from '@angular/router';

library.add(faQuestionCircle);
library.add(faChevronCircleRight);
library.add(faCheck);
library.add(faTimes);
library.add(faCircle);
library.add(faMinus);
library.add(faChevronRight);

@NgModule({
	declarations: [
		UiListChevronComponent
	],
	exports: [
		UiListChevronComponent
	],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
		CommonPipeModule,
		FontAwesomeModule,
		RouterModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class UiListChevronModule { }
