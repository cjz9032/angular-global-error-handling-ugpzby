import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartPrivacyRoutingModule } from './smart-privacy-routing.module';
import { PageSmartPrivacyComponent } from '../../components/pages/page-smart-privacy/page-smart-privacy.component';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLaptop } from '@fortawesome/free-solid-svg-icons/faLaptop';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faCalendarAlt } from '@fortawesome/pro-light-svg-icons/faCalendarAlt';
import { faTachometerAltFast } from '@fortawesome/pro-light-svg-icons/faTachometerAltFast';
import { faWifi } from '@fortawesome/pro-light-svg-icons/faWifi';
import { faShield } from '@fortawesome/pro-light-svg-icons/faShield';
import { faBug } from '@fortawesome/free-solid-svg-icons/faBug';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonUiModule } from '../common/common-ui.module';
import { PageLayoutModule } from '../../components/page-layout/page-layout.module';
import { TranslationModule } from '../translation.module';
import { ModalSmartPrivacySubscribeComponent } from '../../components/modal/modal-smart-privacy-subscribe/modal-smart-privacy-subscribe.component';
import { SanitizeModule } from '../sanitize.module';

@NgModule({
	declarations: [
		PageSmartPrivacyComponent,
		ModalSmartPrivacySubscribeComponent
	],
	imports: [
		CommonModule,
		NgbModule,
		SmartPrivacyRoutingModule,
		PageLayoutModule,
		TranslationModule.forChild(),
		FontAwesomeModule,
		SanitizeModule
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	exports: [
		CommonUiModule,
	],
	bootstrap: [],
})
export class SmartPrivacyModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faLaptop);
		library.addIcons(faTrashAlt);
		library.addIcons(faExclamationTriangle);
		library.addIcons(faCalendarAlt);
		library.addIcons(faTachometerAltFast);
		library.addIcons(faWifi);
		library.addIcons(faShield);
		library.addIcons(faBug);
		library.addIcons(faCheck);
		library.addIcons(faTimes);
		library.addIcons(faChevronDown);
		library.addIcons(faCircle);
	}
}
