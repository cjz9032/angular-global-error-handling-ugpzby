import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faWifi } from '@fortawesome/free-solid-svg-icons/faWifi';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faTools } from '@fortawesome/free-solid-svg-icons/faTools';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faLockAlt } from '@fortawesome/pro-light-svg-icons/faLockAlt';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faWifi as falWifi } from '@fortawesome/pro-light-svg-icons/faWifi';
import { faCheck as falCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { faTimes as falTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faDatabase as falDatabase } from '@fortawesome/pro-light-svg-icons/faDatabase';
import { faKey as falKey } from '@fortawesome/pro-light-svg-icons/faKey';
import { faTools as falTools } from '@fortawesome/pro-light-svg-icons/faTools';

import { MatButtonModule } from '@lenovo/material/button';
import { MatCheckboxModule } from '@lenovo/material/checkbox';
import { MatTooltipModule } from '@lenovo/material/tooltip';
import { MatIconModule } from '@lenovo/material/icon';
import { MatSlideToggleModule } from '@lenovo/material/slide-toggle';

import { LocationNoticeModule } from './../location-notice/location-notice.module';
import { SecurityAdvisorRoutingModule } from './security-advisor-routing.module';
import { SharedModule } from '../shared.module';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { WidgetSecurityStatusModule } from 'src/app/components/widgets/widget-security-status/widget-security-status.module';
import { HeaderMainModule } from 'src/app/components/header-main/header-main.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { CommonModalModule } from '../common/common-modal.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { MaterialModule } from '../common/material.module';

import { DialogService } from 'src/app/services/dialog/dialog.service';

import { PipeInstallPipe } from 'src/app/pipe/security-antivirus/pipe-install.pipe';
import { StatusTransformPipe } from 'src/app/pipe/ui-security-statusbar/status-transform.pipe';
import { IconClassPipe } from 'src/app/pipe/ui-security-statusbar/icon-class.pipe';
import { DateClassPipe } from 'src/app/pipe/security-antivirus/date-class.pipe';
import { SubTransformPipe } from 'src/app/pipe/security-antivirus/sub-transform.pipe';
import { IconNamePipe } from 'src/app/pipe/ui-security-statusbar/icon-name.pipe';
import { PercentIconPipe } from 'src/app/pipe/widget-security/percent-icon.pipe';

import { PageSecurityComponent } from 'src/app/components/pages/page-security/page-security.component';
import { WifiSecurityComponent } from 'src/app/components/pages/page-security-wifi/children/wifi-security/wifi-security.component';
import { PageSecurityPasswordComponent } from 'src/app/components/pages/page-security-password/page-security-password.component';
import { PageSecurityInternetComponent } from 'src/app/components/pages/page-security-internet/page-security-internet.component';
import { PageSecurityWifiComponent } from 'src/app/components/pages/page-security-wifi/page-security-wifi.component';
import { ConnectedHomeStatusComponent } from 'src/app/components/pages/page-security-wifi/children/connected-home-status/connected-home-status.component';
import { PageSecurityAntivirusComponent } from 'src/app/components/pages/page-security-antivirus/page-security-antivirus.component';
import { WidgetMcafeeComponent } from 'src/app/components/widgets/widget-mcafee/widget-mcafee.component';
import { WidgetSecurityComponent } from 'src/app/components/pages/page-security/widget/widget-security/widget-security.component';
import { UiSecurityStatusbarComponent } from 'src/app/components/ui/ui-security-statusbar/ui-security-statusbar.component';
import { WidgetAntivirusComponent } from 'src/app/components/pages/page-security-antivirus/widget/widget-antivirus/widget-antivirus.component';
import { WidgetMcafeeStateComponent } from 'src/app/components/pages/page-security-antivirus/widget/widget-mcafee-state/widget-mcafee-state.component';
import { WidgetMcafeeMetricComponent } from 'src/app/components/pages/page-security-antivirus/widget/widget-mcafee-metric/widget-mcafee-metric.component';
import { WidgetCommonAntivirusComponent } from '../../components/pages/page-security-antivirus/widget/widget-common-antivirus/widget-common-antivirus.component';
import { WidgetQaComponent } from 'src/app/components/widgets/widget-qa/widget-qa.component';
import { WidgetLandingSecurityComponent } from '../../components/pages/page-security/widget/widget-landing-security/widget-landing-security.component';
import { WidgetLandingNavComponent } from '../../components/pages/page-security/widget/widget-landing-nav/widget-landing-nav.component';
import { UiFeatureHeadingComponent } from 'src/app/components/ui/ui-feature-heading/ui-feature-heading.component';
import { UiFeatureIntroductionComponent } from 'src/app/components/ui/ui-feature-introduction/ui-feature-introduction.component';
import { UiDescriptionButtonComponent } from 'src/app/components/ui/ui-description-button/ui-description-button.component';
import { WidgetMcafeeFeaturesComponent } from '../../components/pages/page-security-antivirus/widget/widget-mcafee-features/widget-mcafee-features.component';
import { WidgetMcafeeGraphicIntroductionComponent } from '../../components/pages/page-security-antivirus/widget/widget-mcafee-graphic-introduction/widget-mcafee-graphic-introduction.component';
import { WidgetMcafeePeaceOfMindComponent } from '../../components/pages/page-security-antivirus/widget/widget-mcafee-peace-of-mind/widget-mcafee-peace-of-mind.component';
import { WidgetMcafeeContentCardComponent } from '../../components/pages/page-security-antivirus/widget/widget-mcafee-content-card/widget-mcafee-content-card.component';

@NgModule({
	declarations: [
		PageSecurityComponent,
		PageSecurityAntivirusComponent,
		PageSecurityWifiComponent,
		WifiSecurityComponent,
		ConnectedHomeStatusComponent,
		PageSecurityPasswordComponent,
		PageSecurityInternetComponent,
		// Widget
		WidgetSecurityComponent,
		WidgetMcafeeComponent,
		WidgetQaComponent,
		WidgetAntivirusComponent,
		WidgetMcafeeStateComponent,
		WidgetMcafeeMetricComponent,
		WidgetCommonAntivirusComponent,
		WidgetLandingSecurityComponent,
		WidgetLandingNavComponent,
		WidgetMcafeeFeaturesComponent,
		WidgetMcafeeGraphicIntroductionComponent,
		WidgetMcafeePeaceOfMindComponent,
		WidgetMcafeeContentCardComponent,
		// UI
		UiSecurityStatusbarComponent,
		UiFeatureHeadingComponent,
		UiFeatureIntroductionComponent,
		UiDescriptionButtonComponent,
		// Pipe
		SubTransformPipe,
		DateClassPipe,
		IconClassPipe,
		StatusTransformPipe,
		PipeInstallPipe,
		IconNamePipe,
		PercentIconPipe,
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
		CommonModalModule,
		LocationNoticeModule,
		PageLayoutModule,
		MetricsModule,
		MatButtonModule,
		MatCheckboxModule,
		MatTooltipModule,
		MaterialModule,
		MatIconModule,
		MatSlideToggleModule,
	],
	providers: [DialogService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SecurityAdvisorModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(
			faLockAlt,
			faQuestionCircle,
			faKey,
			falKey,
			faDatabase,
			falDatabase,
			faTools,
			falTools,
			faChevronUp,
			faChevronDown,
			falTimes,
			falCheck,
			falWifi,
			faWifi,
			faTimes,
			faCheck,
			faCircle
		);
	}
}
