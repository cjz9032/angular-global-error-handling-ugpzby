import { CommonModule } from '@angular/common';
import { CommonUiModule } from './common-ui.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { WidgetCarouselComponent } from 'src/app/components/widgets/widget-carousel/widget-carousel.component';
import { WidgetDeviceComponent } from 'src/app/components/widgets/widget-device/widget-device.component';
import { WidgetDeviceUpdateComponent } from 'src/app/components/widgets/widget-device-update/widget-device-update.component';
import { WidgetDeviceUpdateSettingsComponent } from 'src/app/components/widgets/widget-device-update-settings/widget-device-update-settings.component';
import { WidgetFeedbackComponent } from 'src/app/components/widgets/widget-feedback/widget-feedback.component';
import { WidgetOfflineInfoComponent } from 'src/app/components/widgets/widget-offline-info/widget-offline-info.component';
import { WidgetPermissionNoteComponent } from 'src/app/components/widgets/widget-permission-note/widget-permission-note.component';
import { WidgetQuestionsComponent } from 'src/app/components/widgets/widget-questions/widget-questions.component';
import { WidgetQuicksettingsComponent } from 'src/app/components/widgets/widget-quicksettings/widget-quicksettings.component';
import { WidgetRebootComponent } from 'src/app/components/widgets/widget-reboot/widget-reboot.component';
import { WidgetSecurityStatusComponent } from 'src/app/components/widgets/widget-security-status/widget-security-status.component';
import { WidgetStatusComponent } from 'src/app/components/widgets/widget-status/widget-status.component';
import { WidgetSupportComponent } from 'src/app/components/widgets/widget-support/widget-support.component';
import { WidgetSwitchIconComponent } from 'src/app/components/widgets/widget-switch-icon/widget-switch-icon.component';
import { WidgetWarrantyComponent } from 'src/app/components/widgets/widget-warranty/widget-warranty.component';

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
