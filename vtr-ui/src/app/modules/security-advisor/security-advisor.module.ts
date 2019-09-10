import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityAdvisorRoutingModule } from './security-advisor-routing.module';
import { PageSecurityComponent } from 'src/app/components/pages/page-security/page-security.component';
import { PageSecurityAntivirusComponent } from 'src/app/components/pages/page-security-antivirus/page-security-antivirus.component';
import { AdvisorWifiSecurityComponent } from 'src/app/components/pages/page-security/children/advisor-wifi-security/advisor-wifi-security.component';
import { WifiSecurityComponent } from 'src/app/components/pages/page-security-wifi/children/wifi-security/wifi-security.component';
import { HomeSecurityComponent } from 'src/app/components/pages/page-security-wifi/children/home-security/home-security.component';
import { PageSecurityPasswordComponent } from 'src/app/components/pages/page-security-password/page-security-password.component';
import { PageSecurityInternetComponent } from 'src/app/components/pages/page-security-internet/page-security-internet.component';
import { PageSecurityWindowsHelloComponent } from 'src/app/components/pages/page-security-windows-hello/page-security-windows-hello.component';
import { PageSecurityWifiComponent } from 'src/app/components/pages/page-security-wifi/page-security-wifi.component';
import { ConnectedHomeStatusComponent } from 'src/app/components/pages/page-security-wifi/children/connected-home-status/connected-home-status.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WidgetMcafeeComponent } from 'src/app/components/widgets/widget-mcafee/widget-mcafee.component';
import { WidgetSecurityComponent } from 'src/app/components/widgets/widget-security/widget-security.component';
import { UiLandingFeatureComponent } from 'src/app/components/ui/ui-landing-feature/ui-landing-feature.component';
import { UiObjectTitleComponent } from 'src/app/components/ui/ui-object-title/ui-object-title.component';
import { UiSecurityStatusbarComponent } from 'src/app/components/ui/ui-security-statusbar/ui-security-statusbar.component';
import { PipeInstallPipe } from 'src/app/pipe/security-antivirus/pipe-install.pipe';
import { StatusTransformPipe } from 'src/app/pipe/ui-security-statusbar/status-transform.pipe';
import { IconClassPipe } from 'src/app/pipe/ui-security-statusbar/icon-class.pipe';
import { DateClassPipe } from 'src/app/pipe/security-antivirus/date-class.pipe';
import { SubTransformPipe } from 'src/app/pipe/security-antivirus/sub-transform.pipe';
import { IconNamePipe } from 'src/app/pipe/ui-security-statusbar/icon-name.pipe';
import { SharedModule } from '../shared.module';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { WidgetSecurityStatusModule } from 'src/app/components/widgets/widget-security-status/widget-security-status.module';
import { HeaderMainModule } from 'src/app/components/header-main/header-main.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { UiListChevronModule } from 'src/app/components/ui/ui-list-chevron/ui-list-chevron.module';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faWifi } from '@fortawesome/free-solid-svg-icons/faWifi';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faWifi as falWifi } from '@fortawesome/pro-light-svg-icons/faWifi';
import { faCheck as falCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { faTimes as falTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { CommonModalModule } from '../common/common-modal.module';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { WidgetAntivirusComponent } from 'src/app/components/pages/page-security-antivirus/widget/widget-antivirus/widget-antivirus.component';
import { WidgetMcafeeStateComponent } from 'src/app/components/pages/page-security-antivirus/widget/widget-mcafee-state/widget-mcafee-state.component';
import { WidgetMcafeeMetricComponent } from 'src/app/components/pages/page-security-antivirus/widget/widget-mcafee-metric/widget-mcafee-metric.component';

library.add(faCircle);
library.add(faCheck);
library.add(faTimes);
library.add(faWifi);
library.add(falWifi);
library.add(falCheck);
library.add(falTimes);
library.add(faChevronDown);
library.add(faChevronUp);

@NgModule({
	declarations: [
		PageSecurityComponent,
		AdvisorWifiSecurityComponent,
		PageSecurityAntivirusComponent,
		PageSecurityWifiComponent,
		WifiSecurityComponent,
		HomeSecurityComponent,
		ConnectedHomeStatusComponent,
		PageSecurityPasswordComponent,
		PageSecurityInternetComponent,
		PageSecurityWindowsHelloComponent,
		// Widget
		WidgetSecurityComponent,
		WidgetMcafeeComponent,
		// UI
		UiLandingFeatureComponent,
		UiObjectTitleComponent,
		UiSecurityStatusbarComponent,
		// Pipe
		SubTransformPipe,
		DateClassPipe,
		IconClassPipe,
		StatusTransformPipe,
		PipeInstallPipe,
		IconNamePipe,
		WidgetAntivirusComponent,
		WidgetMcafeeStateComponent,
		WidgetMcafeeMetricComponent,
	],
	imports: [
		CommonModule,
		SecurityAdvisorRoutingModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule,
		ContainerCardModule,
		UiButtonModule,
		WidgetSecurityStatusModule,
		HeaderMainModule,
		WidgetOfflineModule,
		UiListChevronModule,
		CommonModalModule
	],
	providers: [
		DialogService
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class SecurityAdvisorModule { }
