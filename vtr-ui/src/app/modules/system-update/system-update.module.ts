
import { AutoupdateSettingsComponent } from 'src/app/components/pages/page-device-updates/children/autoupdate-settings/autoupdate-settings.component';
import { AvailableUpdatesComponent } from 'src/app/components/pages/page-device-updates/children/available-updates/available-updates.component';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { SystemUpdateRoutingModule } from './system-update-routing.module';
import { InstallationHistoryComponent } from 'src/app/components/pages/page-device-updates/children/installation-history/installation-history.component';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { NgbDropdownModule, NgbTooltipModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { PageDeviceUpdatesComponent } from 'src/app/components/pages/page-device-updates/page-device-updates.component';
import { RouterModule } from '@angular/router';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { CommonModalModule } from '../common/common-modal.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';

import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatTooltipModule } from '@lenovo/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';

import { UiListSystemUpdateCheckboxComponent } from 'src/app/components/pages/page-device-updates/children/ui-list-system-update-checkbox/ui-list-system-update-checkbox.component';
import { SharedModule } from '../shared.module';
import { MatCheckboxModule } from '@lenovo/material/checkbox';
import { MaterialModule } from '../common/material.module';

@NgModule({
	declarations: [
		AutoupdateSettingsComponent,
		AvailableUpdatesComponent,
		InstallationHistoryComponent,
		PageDeviceUpdatesComponent,
		UiListSystemUpdateCheckboxComponent,
	],
	imports: [
		SharedModule,
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		CommonModalModule,
		SystemUpdateRoutingModule,
		ContainerCardModule,
		MetricsModule,
		NgbTooltipModule,
		WidgetOfflineModule,
		NgbDropdownModule,
		RouterModule,
		NgbCollapseModule,
		PageLayoutModule,
		MatTooltipModule,
		MaterialModule,
		OverlayModule,
		CdkScrollableModule,
		MatCheckboxModule,
	],
	exports: [
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		CommonModalModule,
		PageLayoutModule,
		RouterModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SystemUpdateModule { }
