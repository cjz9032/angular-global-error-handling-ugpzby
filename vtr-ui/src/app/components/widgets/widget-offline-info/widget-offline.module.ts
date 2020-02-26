import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { WidgetOfflineInfoComponent } from './widget-offline-info.component';
import { faWifiSlash } from '@fortawesome/pro-light-svg-icons/faWifiSlash';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';


@NgModule({
	declarations: [
		WidgetOfflineInfoComponent
	],
	exports: [
		WidgetOfflineInfoComponent
	],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
		FontAwesomeModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class WidgetOfflineModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faWifiSlash);
	}
}
