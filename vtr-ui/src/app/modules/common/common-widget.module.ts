import { CommonModule } from '@angular/common';
import { CommonUiModule } from './common-ui.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatTooltipModule } from '@lenovo/material/tooltip';

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
import { WidgetPoweredByInfoComponent } from 'src/app/components/widgets/widget-powered-by-info/widget-powered-by-info.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetHomeSecurityComponent } from 'src/app/components/widgets/widget-home-security/widget-home-security.component';
import { WidgetSupportModule } from 'src/app/components/widgets/widget-support/widget-support.module';
import { MaterialSvgCircleComponent } from 'src/app/material/material-svg-circle/material-svg-circle.component';
import { MaterialStatusCircleComponent } from 'src/app/material/material-status-circle/material-status-circle.component';
import { WidgetRoundStatusComponent } from 'src/app/components/widgets/widget-round-status/widget-round-status.component';


@NgModule({
	declarations: [
		WidgetDeviceComponent,
		WidgetDeviceUpdateComponent,
		WidgetDeviceUpdateSettingsComponent,
		WidgetPermissionNoteComponent,
		WidgetRebootComponent,
		WidgetWarrantyComponent,
		WidgetPoweredByInfoComponent,
		WidgetHomeSecurityComponent,
		MaterialSvgCircleComponent,
		MaterialStatusCircleComponent,
		WidgetRoundStatusComponent,
	],
	exports: [
		WidgetDeviceComponent,
		WidgetDeviceUpdateComponent,
		WidgetDeviceUpdateSettingsComponent,
		WidgetPermissionNoteComponent,
		WidgetRebootComponent,
		WidgetSupportComponent,
		WidgetWarrantyComponent,
		WidgetPoweredByInfoComponent,
		WidgetHomeSecurityComponent,
		MaterialSvgCircleComponent,
		MaterialStatusCircleComponent,
		WidgetRoundStatusComponent,
	],
	imports: [
		CommonModule,
		CommonUiModule,
		SharedModule,
		RouterModule,
		WidgetSecurityStatusModule,
		WidgetSupportModule,
		NgbTooltipModule,
		MatTooltipModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommonWidgetModule { }
