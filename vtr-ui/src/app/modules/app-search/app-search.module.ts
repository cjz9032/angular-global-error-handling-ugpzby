import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/pro-light-svg-icons/faSearch';
import { faGem } from '@fortawesome/pro-light-svg-icons/faGem';
import { faKeyboard } from '@fortawesome/pro-light-svg-icons/faKeyboard';
import { faCog } from '@fortawesome/pro-light-svg-icons/faCog';
import { faLock } from '@fortawesome/pro-light-svg-icons/faLock';
import { faFan } from '@fortawesome/pro-light-svg-icons/faFan';
import { faWifi } from '@fortawesome/pro-light-svg-icons/faWifi';
import { faBolt } from '@fortawesome/pro-light-svg-icons/faBolt';
import { TranslationModule } from 'src/app/modules/translation.module';
import { SearchDropdownComponent } from 'src/app/components/app-search/dropdown-search/dropdown-search.component';
import { PageSearchComponent } from 'src/app/components/app-search/page-search/page-search.component';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { SharedModule } from '../shared.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';
import { AppSearchRoutingModule } from './app-search-routing.module';
import { MatProgressSpinnerModule } from '@lenovo/material/progress-spinner';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';
import { FeatureInapplicableMessageComponent } from 'src/app/components/app-search/feature-inapplicable-message/feature-inapplicable-message.component';

@NgModule({
	declarations: [SearchDropdownComponent, PageSearchComponent, FeatureInapplicableMessageComponent],
	imports: [
		MetricsModule,
		AppSearchRoutingModule,
		TranslationModule.forChild(),
		CommonModule,
		CommonUiModule,
		CommonPipeModule,
		CommonWidgetModule,
		SharedModule,
		WidgetOfflineModule,
		PageLayoutModule,
		FontAwesomeModule,
		MatProgressSpinnerModule,
	],
	exports: [SearchDropdownComponent, PageSearchComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppSearchModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faSearch);
		library.addIcons(faGem);
		library.addIcons(faExclamationCircle);
		// Version 3.7 app search for gaming
		library.addIcons(faKeyboard);
		library.addIcons(faCog);
		library.addIcons(faFan);
		library.addIcons(faLock);
		library.addIcons(faWifi);
		library.addIcons(faBolt);
	}
}
