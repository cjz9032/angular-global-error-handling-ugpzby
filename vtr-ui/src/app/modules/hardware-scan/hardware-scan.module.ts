import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule, NgbDropdownModule, NgbDatepickerModule, NgbCollapseModule, NgbTooltipModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { HardwareScanRoutingModule } from './hardware-scan-routing.module';
import { ModalWaitComponent } from '../../components/modal/modal-wait/modal-wait.component';
import { ModalCancelComponent } from '../../components/modal/modal-cancel/modal-cancel.component';
import { ModalEticketComponent } from '../../components/modal/modal-eticket/modal-eticket.component';
import { ModalScheduleNewScanComponent } from '../../components/modal/modal-schedule-new-scan/modal-schedule-new-scan.component';
import { ModalScheduleScanCollisionComponent } from '../../components/modal/modal-schedule-scan-collision/modal-schedule-scan-collision.component';
import { ModalHardwareScanCustomizeComponent } from '../../components/modal/modal-hardware-scan-customize/modal-hardware-scan-customize.component';
import { ModalRecoverConfirmComponent } from '../../components/modal/modal-recover-confirm/modal-recover-confirm.component';
import { PageHardwareScanComponent } from '../../components/pages/page-hardwarescan/page-hardware-scan.component';
import { HardwareScanHeaderPagesComponent } from '../../components/pages/page-hardwarescan/children/hardware-scan-header-pages/hardware-scan-header-pages.component';
import { UiHardwareListComponent } from '../../components/ui/ui-hardware-list/ui-hardware-list.component';
import { UiListScheduledScanComponent } from '../../components/ui/ui-list-scheduled-scan/ui-list-scheduled-scan.component';
import { WidgetHardwareScanItemComponent } from '../../components/widgets/widget-hardware-scan-item/widget-hardware-scan-item.component';
import { WidgetHardwareScanStatusComponent } from '../../components/widgets/widget-hardware-scan-status/widget-hardware-scan-status.component';
import { WidgetRecoverBadSectorsComponent } from '../../components/widgets/widget-recover-bad-sectors/widget-recover-bad-sectors.component';
import { WidgetScheduleScanComponent } from '../../components/widgets/widget-schedule-scan/widget-schedule-scan.component';
import { WidgetHardwareScanComponent } from '../../components/widgets/widget-hardware-scan/widget-hardware-scan.component';
import { UiHardwareListTestComponent } from '../../components/ui/ui-hardware-list-test/ui-hardware-list-test.component';
import { UiHardwareListCheckboxComponent } from '../../components/ui/ui-hardware-list-checkbox/ui-hardware-list-checkbox.component';
import { UiDropdownHwscanComponent } from '../../components/ui/ui-dropdown-hwscan/ui-dropdown-hwscan.component';
import { HardwareComponentsComponent } from '../../components/pages/page-hardwarescan/children/hardware-components/hardware-components.component';
import { RecoverBadSectorsComponent } from '../../components/pages/page-hardwarescan/children/recover-bad-sectors/recover-bad-sectors.component';
import { HardwareViewResultsComponent } from '../../components/pages/page-hardwarescan/children/hardware-view-results/hardware-view-results.component';
import { SharedModule } from 'src/app/modules/shared.module';
import { HeaderMainModule } from 'src/app/components/header-main/header-main.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faRedo } from '@fortawesome/pro-light-svg-icons/faRedo';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faAngleUp } from '@fortawesome/pro-light-svg-icons/faAngleUp';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { HardwareScanExecutingHeaderComponent } from '../../components/pages/page-hardwarescan/children/hardware-scan-header-pages/hardware-scan-executing-header/hardware-scan-executing-header.component';
import { HardwareScanWaitSelectHeaderComponent } from '../../components/pages/page-hardwarescan/children/hardware-scan-header-pages/hardware-scan-wait-select-header/hardware-scan-wait-select-header.component';

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
		HardwareScanHeaderPagesComponent,
		HardwareScanExecutingHeaderComponent,
		HardwareScanWaitSelectHeaderComponent
	],
	imports: [
		CommonModule,
		HardwareScanRoutingModule,
		NgbDatepickerModule,
		NgbDropdownModule,
		NgbModalModule,
		HeaderMainModule,
		SharedModule,
		NgbCollapseModule,
		NgbTooltipModule,
		NgbProgressbarModule,
		ContainerCardModule,
		MetricsModule,
		PageLayoutModule,
		FontAwesomeModule
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
export class HardwareScanModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faCaretUp);
		library.addIcons(faCaretRight);
		library.addIcons(faCaretDown);
		library.addIcons(faRedo);
		library.addIcons(faExclamationTriangle);
		library.addIcons(faExclamationCircle);
		library.addIcons(faQuestionCircle);
		library.addIcons(faAngleUp);
		library.addIcons(faBan);
	}
 }

