import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeSecurityAccountStatusComponent } from '../../components/pages/page-connected-home-security/component/home-security-account-status/home-security-account-status.component';
import { HomeSecurityMyDeviceComponent } from '../../components/pages/page-connected-home-security/component/home-security-my-device/home-security-my-device.component';
import { HomeSecurityAllDevicesComponent } from '../../components/pages/page-connected-home-security/component/home-security-all-devices/home-security-all-devices.component';
import { HomeSecurityDeviceComponent } from '../../components/pages/page-connected-home-security/component/home-security-device/home-security-device.component';
import { PageConnectedHomeSecurityComponent } from '../../components/pages/page-connected-home-security/page-connected-home-security.component';
import { ConnectedHomeSecurityRoutingModule } from './connected-home-security-routing.module';
import { DaysIntervalPipe } from 'src/app/pipe/connected-home-security/account-status/days-interval.pipe';
import { UiChsStatusbarComponent } from 'src/app/components/ui/ui-chs-statusbar/ui-chs-statusbar.component';
import { SharedModule } from '../shared.module';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { CommonModalModule } from '../common/common-modal.module';

@NgModule({
	declarations: [
		HomeSecurityAccountStatusComponent,
		HomeSecurityMyDeviceComponent,
		HomeSecurityAllDevicesComponent,
		HomeSecurityDeviceComponent,
		PageConnectedHomeSecurityComponent,
		UiChsStatusbarComponent,
		DaysIntervalPipe,
	],
	imports: [
		CommonModule,
		ConnectedHomeSecurityRoutingModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule,
		CommonModalModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class ConnectedHomeSecurityModule { }
