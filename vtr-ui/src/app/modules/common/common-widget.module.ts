import { CommonModule } from '@angular/common';
import { CommonUiModule } from './common-ui.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { WidgetDeviceComponent } from 'src/app/components/widgets/widget-device/widget-device.component';
import { WidgetDeviceUpdateComponent } from 'src/app/components/widgets/widget-device-update/widget-device-update.component';
import { WidgetDeviceUpdateSettingsComponent } from 'src/app/components/widgets/widget-device-update-settings/widget-device-update-settings.component';
import { WidgetPermissionNoteComponent } from 'src/app/components/widgets/widget-permission-note/widget-permission-note.component';
// import { WidgetQuestionsComponent } from 'src/app/components/widgets/widget-questions/widget-questions.component';
import { WidgetRebootComponent } from 'src/app/components/widgets/widget-reboot/widget-reboot.component';
import { WidgetSupportComponent } from 'src/app/components/widgets/widget-support/widget-support.component';
import { WidgetWarrantyComponent } from 'src/app/components/widgets/widget-warranty/widget-warranty.component';
import { WidgetSecurityStatusModule } from 'src/app/components/widgets/widget-security-status/widget-security-status.module';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [
		WidgetDeviceComponent,
		WidgetDeviceUpdateComponent,
		WidgetDeviceUpdateSettingsComponent,
		WidgetPermissionNoteComponent,
		// WidgetQuestionsComponent,
		WidgetRebootComponent,
		WidgetSupportComponent,
		WidgetWarrantyComponent,
	],
	exports: [
		WidgetDeviceComponent,
		WidgetDeviceUpdateComponent,
		WidgetDeviceUpdateSettingsComponent,
		WidgetPermissionNoteComponent,
		// WidgetQuestionsComponent,
		WidgetRebootComponent,
		WidgetSupportComponent,
		WidgetWarrantyComponent,
		NgbProgressbarModule,

	],
	imports: [
		CommonModule,
		CommonUiModule,
		SharedModule,
		RouterModule,
		WidgetSecurityStatusModule,
		NgbProgressbarModule,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class CommonWidgetModule { }
