import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule, NgbDropdownModule, NgbDatepickerModule, NgbCollapseModule, NgbTooltipModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { HardwareScanRoutingModule } from './hardware-scan-routing.module';
import { ModalWaitComponent } from './modal/modal-wait/modal-wait.component';
import { ModalCancelComponent } from './modal/modal-cancel/modal-cancel.component';
import { ModalEticketComponent } from './modal/modal-eticket/modal-eticket.component';
import { ModalScheduleNewScanComponent } from './modal/modal-schedule-new-scan/modal-schedule-new-scan.component';
import { ModalScheduleScanCollisionComponent } from './modal/modal-schedule-scan-collision/modal-schedule-scan-collision.component';
import { ModalHardwareScanCustomizeComponent } from './modal/modal-hardware-scan-customize/modal-hardware-scan-customize.component';
import { PageHardwareScanComponent } from './page-hardwarescan/page-hardware-scan.component';
import { UiHardwareListComponent } from './ui/ui-hardware-list/ui-hardware-list.component';
import { UiListScheduledScanComponent } from './ui/ui-list-scheduled-scan/ui-list-scheduled-scan.component';
import { WidgetHardwareScanItemComponent } from './widget/widget-hardware-scan-item/widget-hardware-scan-item.component';
import { WidgetHardwareScanStatusComponent } from './widget/widget-hardware-scan-status/widget-hardware-scan-status.component';
import { WidgetRecoverBadSectorsComponent } from './widget/widget-recover-bad-sectors/widget-recover-bad-sectors.component';
import { WidgetScheduleScanComponent } from './widget/widget-schedule-scan/widget-schedule-scan.component';
import { WidgetHardwareScanComponent } from './widget/widget-hardware-scan/widget-hardware-scan.component';
import { UiHardwareListTestComponent } from './ui/ui-hardware-list-test/ui-hardware-list-test.component';
import { UiHardwareListCheckboxComponent } from './ui/ui-hardware-list-checkbox/ui-hardware-list-checkbox.component';
import { UiDropdownHwscanComponent } from './ui/ui-dropdown-hwscan/ui-dropdown-hwscan.component';
import { HardwareComponentsComponent } from './page-hardwarescan/children/hardware-components/hardware-components.component';
import { RecoverBadSectorsComponent } from './page-hardwarescan/children/recover-bad-sectors/recover-bad-sectors.component';
import { HardwareViewResultsComponent } from './page-hardwarescan/children/hardware-view-results/hardware-view-results.component';
import { SharedModule } from 'src/app/modules/shared.module';
import { HeaderMainComponent } from './header-main/header-main.component';
import { HeaderMainModule } from 'src/app/components/header-main/header-main.module';
import { UiButtonModule } from './ui/ui-button/ui-button.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { MetricsModule } from 'src/app/directives/metrics.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faRedo } from '@fortawesome/pro-light-svg-icons/faRedo';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faAngleUp } from '@fortawesome/pro-light-svg-icons/faAngleUp';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { ModalRecoverConfirmComponent } from './modal/modal-recover-confirm/modal-recover-confirm.component';

library.add(faCaretUp);
library.add(faCaretRight);
library.add(faCaretDown);
library.add(faRedo);
library.add(faExclamationTriangle);
library.add(faExclamationCircle);
library.add(faQuestionCircle);
library.add(faAngleUp);
library.add(faBan);


@NgModule({
	declarations: [
		ModalRecoverConfirmComponent,
		ModalWaitComponent,
		ModalCancelComponent,
		ModalEticketComponent,
		ModalHardwareScanCustomizeComponent,
		ModalScheduleNewScanComponent,
		ModalScheduleScanCollisionComponent,
		PageHardwareScanComponent,
		UiDropdownHwscanComponent,
		UiHardwareListComponent,
		UiHardwareListCheckboxComponent,
		UiHardwareListTestComponent,
		UiListScheduledScanComponent,
		WidgetHardwareScanComponent,
		WidgetHardwareScanItemComponent,
		WidgetHardwareScanStatusComponent,
		WidgetRecoverBadSectorsComponent,
		WidgetScheduleScanComponent,
		HardwareComponentsComponent,
		HardwareViewResultsComponent,
		RecoverBadSectorsComponent,
		HeaderMainComponent
	],
	imports: [
		CommonModule,
		HardwareScanRoutingModule,
		NgbDatepickerModule,
		NgbDropdownModule,
		NgbModalModule,
		HeaderMainModule,
		UiButtonModule,
		SharedModule,
		NgbCollapseModule,
		NgbTooltipModule,
		NgbProgressbarModule,
		ContainerCardModule,
		MetricsModule,
		PageLayoutModule
	],
	exports: [
		NgbCollapseModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	entryComponents: [
		ModalWaitComponent,
		ModalRecoverConfirmComponent,
		ModalCancelComponent,
		ModalEticketComponent,
		ModalHardwareScanCustomizeComponent,
		ModalScheduleNewScanComponent,
		ModalScheduleScanCollisionComponent,
	]
})
export class HardwareScanModule { }

