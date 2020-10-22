import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule, NgbDropdownModule, NgbDatepickerModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonUiModule } from '../common/common-ui.module';
import { HardwareScanRoutingModule } from './hardware-scan-routing.module';
import { ModalWaitComponent } from './components/modal/modal-wait/modal-wait.component';
import { ModalCancelComponent } from './components/modal/modal-cancel/modal-cancel.component';
import { ModalScanFailureComponent } from './components/modal/modal-scan-failure/modal-scan-failure.component';
import { ModalScheduleNewScanComponent } from './components/modal/modal-schedule-new-scan/modal-schedule-new-scan.component';
import { ModalPreScanInfoComponent } from './components/modal/modal-pre-scan-info/modal-pre-scan-info.component';
import { ModalHardwareScanCustomizeComponent } from './components/modal/modal-hardware-scan-customize/modal-hardware-scan-customize.component';
import { ModalRecoverConfirmComponent } from './components/modal/modal-recover-confirm/modal-recover-confirm.component';
import { ModalHardwareScanRbsComponent } from './components/modal/modal-hardware-scan-rbs/modal-hardware-scan-rbs.component';
import { PageHardwareScanComponent } from './pages/page-hardware-scan.component';
import { HardwareScanHeaderPagesComponent } from './components/header/hardware-scan-header-pages.component';
import { UiHardwareListComponent } from './components/dashboard/ui-hardware-list/ui-hardware-list.component';
import { UiListScheduledScanComponent } from './components/dashboard/ui-list-scheduled-scan/ui-list-scheduled-scan.component';
import { WidgetHardwareScanItemComponent } from './components/right-column-widgets/widget-hardware-scan-item/widget-hardware-scan-item.component';
import { WidgetHardwareScanStatusComponent } from './components/right-column-widgets/widget-hardware-scan-status/widget-hardware-scan-status.component';
import { WidgetRecoverBadSectorsComponent } from './components/right-column-widgets/widget-recover-bad-sectors/widget-recover-bad-sectors.component';
import { WidgetScheduleScanComponent } from './components/right-column-widgets/widget-schedule-scan/widget-schedule-scan.component';
import { UiHardwareListTestComponent } from './components/dashboard/ui-hardware-list-test/ui-hardware-list-test.component';
import { UiHardwareListCheckboxComponent } from './components/dashboard/ui-hardware-list-checkbox/ui-hardware-list-checkbox.component';
import { UiDropdownHwscanComponent } from './components/dashboard/ui-dropdown-hwscan/ui-dropdown-hwscan.component';
import { HardwareComponentsComponent } from './pages/children/hardware-components/hardware-components.component';
import { HardwareViewResultsComponent } from './pages/children/hardware-view-results/hardware-view-results.component';
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
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons/faQuestionCircle';
import { faAngleUp } from '@fortawesome/pro-light-svg-icons/faAngleUp';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { HardwareScanExecutingHeaderComponent } from './components/header/hardware-scan-executing-header/hardware-scan-executing-header.component';
import { HardwareScanWaitSelectHeaderComponent } from './components/header/hardware-scan-wait-select-header/hardware-scan-wait-select-header.component';
import { HardwareScanFinishedHeaderComponent } from './components/header/hardware-scan-finished-header/hardware-scan-finished-header.component';
import { UiHardwareScanTestResultComponent } from './components/dashboard/ui-hardware-scan-test-result/ui-hardware-scan-test-result.component';
import { UiTestResultIconComponent } from './components/dashboard/ui-test-result-icon/ui-test-result-icon.component';
import { UiHyperlinkButtonComponent } from '../../components/ui/ui-hyperlink-button/ui-hyperlink-button.component';
import { ModalExportLogComponent } from './components/modal/modal-export-log/modal-export-log.component';

@NgModule({
	declarations: [
		ModalRecoverConfirmComponent,
		ModalWaitComponent,
		ModalCancelComponent,
		ModalScanFailureComponent,
		ModalHardwareScanCustomizeComponent,
		ModalScheduleNewScanComponent,
		ModalPreScanInfoComponent,
		ModalHardwareScanRbsComponent,
		PageHardwareScanComponent,
		UiDropdownHwscanComponent,
		UiHardwareListComponent,
		UiHardwareListCheckboxComponent,
		UiHardwareListTestComponent,
		UiListScheduledScanComponent,
		WidgetHardwareScanItemComponent,
		WidgetHardwareScanStatusComponent,
		WidgetRecoverBadSectorsComponent,
		WidgetScheduleScanComponent,
		HardwareComponentsComponent,
		HardwareViewResultsComponent,
		HardwareScanHeaderPagesComponent,
		HardwareScanExecutingHeaderComponent,
		HardwareScanWaitSelectHeaderComponent,
		HardwareScanFinishedHeaderComponent,
		UiHardwareScanTestResultComponent,
		UiTestResultIconComponent,
		UiHyperlinkButtonComponent,
		ModalExportLogComponent
	],
	imports: [
		CommonModule,
		CommonUiModule,
		HardwareScanRoutingModule,
		NgbDatepickerModule,
		NgbDropdownModule,
		NgbModalModule,
		HeaderMainModule,
		SharedModule,
		NgbCollapseModule,
		NgbTooltipModule,
		ContainerCardModule,
		MetricsModule,
		PageLayoutModule,
		FontAwesomeModule
	],
	exports: [
		NgbCollapseModule,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	entryComponents: [
		ModalWaitComponent,
		ModalRecoverConfirmComponent,
		ModalCancelComponent,
		ModalScanFailureComponent,
		ModalHardwareScanCustomizeComponent,
		ModalScheduleNewScanComponent,
		ModalPreScanInfoComponent,
		ModalHardwareScanRbsComponent,
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
		library.addIcons(faCheckCircle);
		library.addIcons(faTimesCircle);
	}
 }

