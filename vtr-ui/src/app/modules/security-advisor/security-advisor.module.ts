import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityAdvisorRoutingModule } from './security-advisor-routing.module';
import { PageSecurityComponent } from 'src/app/components/pages/page-security/page-security.component';
import { PageSecurityAntivirusComponent } from 'src/app/components/pages/page-security-antivirus/page-security-antivirus.component';
import { AdvisorWifiSecurityComponent } from 'src/app/components/pages/page-security/children/advisor-wifi-security/advisor-wifi-security.component';
import { WifiSecurityComponent } from 'src/app/components/pages/page-security-wifi/children/wifi-security/wifi-security.component';
import { PageSecurityPasswordComponent } from 'src/app/components/pages/page-security-password/page-security-password.component';
import { PageSecurityInternetComponent } from 'src/app/components/pages/page-security-internet/page-security-internet.component';
import { PageSecurityWindowsHelloComponent } from 'src/app/components/pages/page-security-windows-hello/page-security-windows-hello.component';
import { PageSecurityWifiComponent } from 'src/app/components/pages/page-security-wifi/page-security-wifi.component';
import { ConnectedHomeMyHomeComponent } from 'src/app/components/pages/page-security-wifi/children/connected-home-my-home/connected-home-my-home.component';
import { ConnectedHomeComponent } from 'src/app/components/pages/page-security-wifi/children/connected-home/connected-home.component';
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
import { LinkStatusDirective } from 'src/app/directives/link-status.directive';
import { IconNamePipe } from 'src/app/pipe/ui-security-statusbar/icon-name.pipe';
import { SharedModule } from '../shared.module';
import { CommonUiModule } from '../common-ui.module';
import { CommonWidgetModule } from '../common-widget.module';

@NgModule({
	declarations: [
		PageSecurityComponent,
		AdvisorWifiSecurityComponent,
		PageSecurityAntivirusComponent,
		PageSecurityWifiComponent,
		WifiSecurityComponent,
		ConnectedHomeComponent,
		ConnectedHomeMyHomeComponent,
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
	],
	imports: [
		CommonModule,
		SecurityAdvisorRoutingModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule
	]
})
export class SecurityAdvisorModule { }
