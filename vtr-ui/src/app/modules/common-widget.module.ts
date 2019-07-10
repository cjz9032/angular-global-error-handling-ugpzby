import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WidgetOfflineInfoComponent } from '../components/widgets/widget-offline-info/widget-offline-info.component';
import { WidgetQuestionsComponent } from '../components/widgets/widget-questions/widget-questions.component';
import { WidgetRebootComponent } from '../components/widgets/widget-reboot/widget-reboot.component';
import { WidgetSecurityStatusComponent } from '../components/widgets/widget-security-status/widget-security-status.component';
import { WidgetStatusComponent } from '../components/widgets/widget-status/widget-status.component';
import { WidgetCarouselComponent } from '../components/widgets/widget-carousel/widget-carousel.component';
import { WidgetFeedbackComponent } from '../components/widgets/widget-feedback/widget-feedback.component';
import { WidgetQuicksettingsComponent } from '../components/widgets/widget-quicksettings/widget-quicksettings.component';
import { WidgetSwitchIconComponent } from '../components/widgets/widget-switch-icon/widget-switch-icon.component';
import { WidgetDeviceComponent } from '../components/widgets/widget-device/widget-device.component';
import { WidgetPermissionNoteComponent } from '../components/widgets/widget-permission-note/widget-permission-note.component';
import { WidgetSupportComponent } from '../components/widgets/widget-support/widget-support.component';
import { WidgetWarrantyComponent } from '../components/widgets/widget-warranty/widget-warranty.component';
import { WidgetDeviceUpdateComponent } from '../components/widgets/widget-device-update/widget-device-update.component';
import { WidgetDeviceUpdateSettingsComponent } from '../components/widgets/widget-device-update-settings/widget-device-update-settings.component';
import { SharedModule } from './shared.module';
import { RouterModule } from '@angular/router';
import { CommonUiModule } from './common-ui.module';

@NgModule({
	declarations: [
		WidgetCarouselComponent,
		WidgetDeviceComponent,
		WidgetDeviceUpdateComponent,
		WidgetDeviceUpdateSettingsComponent,
		WidgetFeedbackComponent,
		WidgetOfflineInfoComponent,
		WidgetPermissionNoteComponent,
		WidgetQuestionsComponent,
		WidgetQuicksettingsComponent,
		WidgetRebootComponent,
		WidgetSecurityStatusComponent,
		WidgetStatusComponent,
		WidgetSupportComponent,
		WidgetSwitchIconComponent,
		WidgetWarrantyComponent,
	],
	exports: [
		WidgetCarouselComponent,
		WidgetDeviceComponent,
		WidgetDeviceUpdateComponent,
		WidgetDeviceUpdateSettingsComponent,
		WidgetFeedbackComponent,
		WidgetOfflineInfoComponent,
		WidgetPermissionNoteComponent,
		WidgetQuestionsComponent,
		WidgetQuicksettingsComponent,
		WidgetRebootComponent,
		WidgetSecurityStatusComponent,
		WidgetStatusComponent,
		WidgetSupportComponent,
		WidgetSwitchIconComponent,
		WidgetWarrantyComponent,
	],
	imports: [
		CommonModule,
		CommonUiModule,
		SharedModule,
		RouterModule,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class CommonWidgetModule { }
