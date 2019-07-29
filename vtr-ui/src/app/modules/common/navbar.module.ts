import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MetricsModule } from 'src/app/directives/metrics.module';
import { MenuMainComponent } from 'src/app/components/menu-main/menu-main.component';
import { UiHeaderWarrantyComponent } from 'src/app/components/ui/ui-header-warranty/ui-header-warranty.component';
import { TranslationModule } from '../translation.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

//#region FONT AWESOME
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { RouterModule } from '@angular/router';
import { faDesktop } from '@fortawesome/free-solid-svg-icons/faDesktop';
import { faSquare } from '@fortawesome/free-solid-svg-icons/faSquare';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faWrench } from '@fortawesome/pro-light-svg-icons/faWrench';
import { faLaptop } from '@fortawesome/pro-light-svg-icons/faLaptop';
import { faColumns } from '@fortawesome/pro-light-svg-icons/faColumns';
import { faUserShield } from '@fortawesome/pro-light-svg-icons/faUserShield';
import { faLock } from '@fortawesome/pro-light-svg-icons/faLock';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faAngleDown } from '@fortawesome/pro-light-svg-icons/faAngleDown';
//#endregion


//#region font-awesome icons needed for menu-items

library.add(faDesktop);
library.add(faWrench);
library.add(faLaptop);
library.add(faColumns);
library.add(faUserShield);
library.add(faLock);
library.add(faSquare);
library.add(faBars);
library.add(faArrowRight);
library.add(faArrowLeft);
library.add(faCheck);
library.add(faTimes);
library.add(faAngleDown);

//#endregion

@NgModule({
	declarations: [
		MenuMainComponent,
		UiHeaderWarrantyComponent,
	],
	exports: [
		MenuMainComponent,
		UiHeaderWarrantyComponent,
		MetricsModule,
		NgbDropdownModule,
	],
	imports: [
		CommonModule,
		MetricsModule,
		TranslationModule.forChild(),
		NgbDropdownModule,
		FontAwesomeModule,
		RouterModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class NavbarModule { }
