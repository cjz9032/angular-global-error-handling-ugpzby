import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeSecurityAllDevicesComponent } from '../../components/pages/page-connected-home-security/component/home-security-all-devices/home-security-all-devices.component';
import { HomeSecurityContentComponent } from 'src/app/components/pages/page-connected-home-security/component/home-security-content/home-security-content.component';
import { HomeSecurityCardComponent } from 'src/app/components/pages/page-connected-home-security/component/home-security-card/home-security-card.component';
import { PageConnectedHomeSecurityComponent } from '../../components/pages/page-connected-home-security/page-connected-home-security.component';
import { ConnectedHomeSecurityRoutingModule } from './connected-home-security-routing.module';
import { DaysIntervalPipe } from 'src/app/pipe/connected-home-security/account-status/days-interval.pipe';
import { SharedModule } from '../shared.module';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { CommonModalModule } from '../common/common-modal.module';
import { DialogService } from '../../services/dialog/dialog.service';
import { WidgetSecurityStatusModule } from 'src/app/components/widgets/widget-security-status/widget-security-status.module';
import { faWifi } from '@fortawesome/pro-light-svg-icons/faWifi';
import { faWifiSlash } from '@fortawesome/pro-light-svg-icons/faWifiSlash';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons/faQuestionCircle';
import { faLaptop } from '@fortawesome/pro-light-svg-icons/faLaptop';
import { faUserFriends } from '@fortawesome/pro-light-svg-icons/faUserFriends';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';
import { faTv } from '@fortawesome/pro-light-svg-icons/faTv';
import { faMapMarkerAlt } from '@fortawesome/pro-light-svg-icons/faMapMarkerAlt';
import { HomeSecurityAfterSignupComponent } from '../../components/pages/page-connected-home-security/component/home-security-after-signup/home-security-after-signup.component';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faMapMarkerAltSlash } from '@fortawesome/pro-light-svg-icons/faMapMarkerAltSlash';
import { WidgetLocationStatusComponent } from '../../components/widgets/widget-location-status/widget-location-status.component';

import { MaterialModule } from '../common/material.module';
import { MatTooltipModule } from '@lenovo/material/tooltip';
import { MatButtonModule } from '@lenovo/material/button';
import { MaterialChevronModule } from 'src/app/material/material-chevron/material-chevron.module';
import { WidgetQuestionsModule } from 'src/app/components/widgets/widget-questions/widget-questions.module';

@NgModule({
	declarations: [
		HomeSecurityAllDevicesComponent,
		HomeSecurityContentComponent,
		HomeSecurityCardComponent,
		PageConnectedHomeSecurityComponent,
		DaysIntervalPipe,
		HomeSecurityAfterSignupComponent,
		WidgetLocationStatusComponent,
	],
	imports: [
		CommonModule,
		ConnectedHomeSecurityRoutingModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule,
		CommonModalModule,
		WidgetSecurityStatusModule,
		WidgetQuestionsModule,
		PageLayoutModule,
		FontAwesomeModule,
		MatTooltipModule,
		MaterialModule,
		MatButtonModule,
		MaterialChevronModule,
	],
	exports: [MaterialModule],
	providers: [DialogService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConnectedHomeSecurityModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(
			faWifi,
			faWifiSlash,
			faExclamationCircle,
			faQuestionCircle,
			faLaptop,
			faUserFriends,
			faHome,
			faTv,
			faMapMarkerAlt,
			faMapMarkerAltSlash
		);
	}
}
