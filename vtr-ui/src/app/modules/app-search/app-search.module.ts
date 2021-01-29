import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/pro-light-svg-icons/faSearch';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faColumns } from '@fortawesome/pro-light-svg-icons/faColumns';
import { faMicrophone } from '@fortawesome/pro-light-svg-icons/faMicrophone';
import { faCamera } from '@fortawesome/pro-light-svg-icons/faCamera';
import { faEye } from '@fortawesome/pro-light-svg-icons/faEye';
import { faUserShield } from '@fortawesome/pro-light-svg-icons/faUserShield';
import { faLock } from '@fortawesome/pro-light-svg-icons/faLock';
import { faLaptop } from '@fortawesome/pro-light-svg-icons/faLaptop';
import { faPlane } from '@fortawesome/pro-light-svg-icons/faPlane';
import { faBatteryHalf } from '@fortawesome/pro-light-svg-icons/faBatteryHalf';
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons/faQuestionCircle';
import { faThumbtack } from '@fortawesome/pro-light-svg-icons/faThumbtack';
import { faVolumeDown } from '@fortawesome/pro-light-svg-icons/faVolumeDown';
import { faThermometerFull } from '@fortawesome/pro-light-svg-icons/faThermometerFull';
import { faKeyboard } from '@fortawesome/pro-light-svg-icons/faKeyboard';
import { faSync } from '@fortawesome/pro-light-svg-icons/faSync';
import { faWifi } from '@fortawesome/pro-light-svg-icons/faWifi';
import { faNetworkWired } from '@fortawesome/pro-light-svg-icons/faNetworkWired';
import { faWrench } from '@fortawesome/pro-light-svg-icons/faWrench';
import { faGem } from '@fortawesome/pro-light-svg-icons/faGem';
import { faUsb } from '@fortawesome/free-brands-svg-icons/faUsb';
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

@NgModule({
	declarations: [SearchDropdownComponent, PageSearchComponent],
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
		library.addIcons(faTimes);
		library.addIcons(faColumns);
		library.addIcons(faMicrophone);
		library.addIcons(faCamera);
		library.addIcons(faEye);
		library.addIcons(faUserShield);
		library.addIcons(faLock);
		library.addIcons(faLaptop);
		library.addIcons(faPlane);
		library.addIcons(faBatteryHalf);
		library.addIcons(faQuestionCircle);
		library.addIcons(faThumbtack);
		library.addIcons(faVolumeDown);
		library.addIcons(faThermometerFull);
		library.addIcons(faKeyboard);
		library.addIcons(faSync);
		library.addIcons(faWifi);
		library.addIcons(faNetworkWired);
		library.addIcons(faWrench);
		library.addIcons(faGem);
		library.addIcons(faUsb);
	}
}
