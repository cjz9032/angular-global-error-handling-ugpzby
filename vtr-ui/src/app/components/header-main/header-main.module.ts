import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MetricsModule } from 'src/app/directives/metrics.module';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HeaderMainComponent } from './header-main.component';
import { UiHeaderSubpageComponent } from '../ui/ui-header-subpage/ui-header-subpage.component';
import { MenuHeaderComponent } from '../menu-header/menu-header.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSquare } from '@fortawesome/free-solid-svg-icons/faSquare';
import { RouterModule } from '@angular/router/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


library.add(faSquare);

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
		FontAwesomeModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class HeaderMainModule { }
