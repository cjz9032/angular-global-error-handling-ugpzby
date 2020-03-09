import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HeaderMainComponent } from './header-main.component';
import { UiHeaderSubpageComponent } from '../ui/ui-header-subpage/ui-header-subpage.component';
import { MenuHeaderComponent } from '../menu-header/menu-header.component';
import { faSquare } from '@fortawesome/free-solid-svg-icons/faSquare';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';


@NgModule({
	declarations: [
		HeaderMainComponent,
		UiHeaderSubpageComponent,
		MenuHeaderComponent
	],
	exports: [
		MetricsModule,
		HeaderMainComponent,
		UiHeaderSubpageComponent,
		MenuHeaderComponent
	],
	imports: [
		CommonModule,
		MetricsModule,
		TranslationModule.forChild(),
		RouterModule,
		FontAwesomeModule,
		AppSearchModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class HeaderMainModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faSquare);
	}
}
