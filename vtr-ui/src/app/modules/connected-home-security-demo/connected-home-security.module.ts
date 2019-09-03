import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeSecurityAccountStatusDemoComponent } from '../../components/pages/page-connected-home-security-demo/component/home-security-account-status/home-security-account-status.component';
import { HomeSecurityMyDeviceDemoComponent } from '../../components/pages/page-connected-home-security-demo/component/home-security-my-device/home-security-my-device.component';
import { HomeSecurityAllDevicesDemoComponent } from '../../components/pages/page-connected-home-security-demo/component/home-security-all-devices/home-security-all-devices.component';
import { HomeSecurityDeviceDemoComponent } from '../../components/pages/page-connected-home-security-demo/component/home-security-device/home-security-device.component';
import { PageConnectedHomeSecurityDemoComponent } from '../../components/pages/page-connected-home-security-demo/page-connected-home-security.component';
import { ConnectedHomeSecurityRoutingDemoModule } from './connected-home-security-routing.module';
import { DaysIntervalDemoPipe } from 'src/app/pipe/connected-home-security/account-status/days-interval-demo.pipe';
import { UiChsStatusbarDemoComponent } from 'src/app/components/ui/ui-chs-statusbar-demo/ui-chs-statusbar.component';
import { SharedModule } from '../shared.module';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { CommonModalModule } from '../common/common-modal.module';
import { DialogService } from '../../services/dialog-demo/dialog.service';
import { WidgetSecurityStatusModule } from 'src/app/components/widgets/widget-security-status/widget-security-status.module';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWifi } from '@fortawesome/pro-light-svg-icons/faWifi';
import { faWifiSlash } from '@fortawesome/pro-light-svg-icons/faWifiSlash';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons/faQuestionCircle';
import { faLaptop } from '@fortawesome/pro-light-svg-icons/faLaptop';

library.add(faWifi);
library.add(faWifiSlash);
library.add(faExclamationCircle);
library.add(faQuestionCircle);
library.add(faLaptop);

@NgModule({
	declarations: [
		HomeSecurityAccountStatusDemoComponent,
		HomeSecurityMyDeviceDemoComponent,
		HomeSecurityAllDevicesDemoComponent,
		HomeSecurityDeviceDemoComponent,
		PageConnectedHomeSecurityDemoComponent,
		UiChsStatusbarDemoComponent,
		DaysIntervalDemoPipe,
	],
	imports: [
		CommonModule,
		ConnectedHomeSecurityRoutingDemoModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule,
		CommonModalModule,
		WidgetSecurityStatusModule
	],
	providers: [
		DialogService
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class ConnectedHomeSecurityDemoModule { }
