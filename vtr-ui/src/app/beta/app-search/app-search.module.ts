import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchDropdownComponent } from './search-dropdown/search-dropdown.component';
import { AppSearchScrollerDirective } from 'src/app/beta/app-search/app-search-scroller.directive';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { AppSearchRoutingModule } from 'src/app/beta/app-search/app-search-routing.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
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
import { SearchTipsComponent } from './search-tips/search-tips.component';

library.add(faSearch);
library.add(faTimes);
library.add(faColumns);
library.add(faMicrophone);
library.add(faCamera);
library.add(faEye);
library.add(faUserShield);
library.add(faLock);
library.add(faLaptop);
library.add(faPlane);
library.add(faBatteryHalf);
library.add(faQuestionCircle);
library.add(faThumbtack);
library.add(faVolumeDown);
library.add(faThermometerFull);
library.add(faKeyboard);
library.add(faSync);
library.add(faWifi);
library.add(faNetworkWired);
library.add(faWrench);
library.add(faGem);
library.add(faUsb);


@NgModule({
	declarations: [
		SearchDropdownComponent,
		AppSearchScrollerDirective,
		SearchTipsComponent
	],
	imports: [
		FontAwesomeModule,
		CommonPipeModule,
		CommonModule,
		MetricsModule,
		AppSearchRoutingModule,
		FormsModule
	],
	exports: [
		SearchDropdownComponent,
		AppSearchScrollerDirective,
		SearchTipsComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA]
})
export class AppSearchModule { }
