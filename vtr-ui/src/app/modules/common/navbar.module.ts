import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { MenuMainComponent } from 'src/app/components/menu-main/menu-main.component';
import { MenuMainLegacyComponent } from 'src/app/components/menu-main-legacy/menu-main-legacy.component';
import { UiHeaderWarrantyComponent } from 'src/app/components/ui/ui-header-warranty/ui-header-warranty.component';
import { TranslationModule } from '../translation.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@lenovo/material/button';
import { MatMenuModule } from '@lenovo/material/menu';

//#region FONT AWESOME
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
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
import { faHouseSignal } from '@fortawesome/pro-light-svg-icons/faHouseSignal';
import { faUserShield } from '@fortawesome/pro-light-svg-icons/faUserShield';
import { faLock } from '@fortawesome/pro-light-svg-icons/faLock';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faAngleDown } from '@fortawesome/pro-light-svg-icons/faAngleDown';
import { faSearch } from '@fortawesome/pro-light-svg-icons/faSearch';
//#endregion
import { AppSearchModule } from '../app-search/app-search.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { CommonPipeModule } from './common-pipe.module';
import { MaterialMenuComponent } from 'src/app/material/menu/material-menu.component';
import { MaterialMenuDropdownComponent } from 'src/app/material/menu/material-menu-dropdown/material-menu-dropdown.component';
import { MaterialHamburgerMenuComponent } from 'src/app/material/menu/material-hamburger-menu/material-hamburger-menu.component';
import { MenuHoverDirective } from 'src/app/directives/menu-hover.directive';

@NgModule({
	declarations: [
		MenuMainComponent,
		MenuMainLegacyComponent,
		MaterialMenuComponent,
		MaterialMenuDropdownComponent,
		MaterialHamburgerMenuComponent,
		UiHeaderWarrantyComponent,
		MenuHoverDirective
	],
	exports: [
		MenuMainComponent,
		MenuMainLegacyComponent,
		MaterialMenuComponent,
		MaterialMenuDropdownComponent,
		MaterialHamburgerMenuComponent,
		UiHeaderWarrantyComponent,
		CommonPipeModule,
		MetricsModule,
		NgbDropdownModule
	],
	imports: [
		CommonModule,
		MetricsModule,
		TranslationModule.forChild(),
		NgbDropdownModule,
		FontAwesomeModule,
		CommonPipeModule,
		RouterModule,
		UiButtonModule,
		MatButtonModule,
		AppSearchModule,
		MatMenuModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class NavbarModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faDesktop);
		library.addIcons(faWrench);
		library.addIcons(faLaptop);
		library.addIcons(faColumns);
		library.addIcons(faHouseSignal);
		library.addIcons(faUserShield);
		library.addIcons(faLock);
		library.addIcons(faSquare);
		library.addIcons(faBars);
		library.addIcons(faArrowRight);
		library.addIcons(faArrowLeft);
		library.addIcons(faCheck);
		library.addIcons(faTimes);
		library.addIcons(faAngleDown);
		library.addIcons(faSearch);
	}
}
