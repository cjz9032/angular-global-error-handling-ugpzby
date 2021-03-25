import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTooltipModule } from '@lenovo/material/tooltip';
import { MatIconModule } from '@lenovo/material/icon';

import { SmartPerformanceRoutingModule } from './smart-performance-routing.module';
import { PageSmartPerformanceComponent } from '../../components/pages/page-smart-performance/page-smart-performance.component';
import { HeaderMainModule } from 'src/app/components/header-main/header-main.module';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faLaptop } from '@fortawesome/free-solid-svg-icons/faLaptop';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faCalendarAlt } from '@fortawesome/pro-light-svg-icons/faCalendarAlt';
import { faTachometerAltFast } from '@fortawesome/pro-light-svg-icons/faTachometerAltFast';
import { faWifi } from '@fortawesome/pro-light-svg-icons/faWifi';
import { faShield } from '@fortawesome/pro-light-svg-icons/faShield';
import { faBug } from '@fortawesome/free-solid-svg-icons/faBug';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';

import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceCancelComponent } from '../../components/modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';
import { ModalSmartPerformanceSubscribeComponent } from '../../components/modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonUiModule } from '../common/common-ui.module';
import { TranslationModule } from '../translation.module';
import { PageLayoutComponent } from 'src/app/components/page-layout/page-layout.component';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';
import { SanitizeModule } from '../sanitize.module';
import { SubpageScanResultsAccordionComponent } from 'src/app/components/pages/page-smart-performance/children/subpage-scan-results-accordion/subpage-scan-results-accordion.component';
import { SubpageScanningComponent } from 'src/app/components/pages/page-smart-performance/children/subpage-scanning/subpage-scanning.component';
import { SubpageScheduleScanComponent } from 'src/app/components/pages/page-smart-performance/children/subpage-schedule-scan/subpage-schedule-scan.component';
import { SubpageSmartPerformanceDashboardComponent } from 'src/app/components/pages/page-smart-performance/children/subpage-smart-performance-dashboard/subpage-smart-performance-dashboard.component';
import { SubpageSmartPerformanceScanSummaryComponent } from 'src/app/components/pages/page-smart-performance/children/subpage-smart-performance-scan-summary/subpage-smart-performance-scan-summary.component';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { WidgetSubscriptionDetailsComponent } from 'src/app/components/pages/page-smart-performance/widgets/widget-subscriptiondetails/widget-subscriptiondetails.component';
import { UiSmartPerformanceHeaderComponent } from 'src/app/components/pages/page-smart-performance/ui/ui-smart-performance-header/ui-smart-performance-header.component';
import { UiSmartPerformanceRatingComponent } from 'src/app/components/pages/page-smart-performance/ui/ui-smart-performance-rating/ui-smart-performance-rating.component';
import { UiSmartPerformanceScanningDetailComponent } from 'src/app/components/pages/page-smart-performance/ui/ui-smart-performance-scanning-detail/ui-smart-performance-scanning-detail.component';
import { WidgetRecommendActionComponent } from 'src/app/components/pages/page-smart-performance/widgets/widget-recommend-action/widget-recommend-action.component';
import { UiDotAnimateComponent } from 'src/app/components/ui/ui-dot-animate/ui-dot-animate.component';

@NgModule({
	declarations: [
		PageSmartPerformanceComponent,
		ModalSmartPerformanceCancelComponent,
		ModalSmartPerformanceSubscribeComponent,
		WidgetSubscriptionDetailsComponent,
		WidgetRecommendActionComponent,
		UiSmartPerformanceHeaderComponent,
		UiSmartPerformanceRatingComponent,
		UiSmartPerformanceScanningDetailComponent,
		UiDotAnimateComponent,
		SubpageScanResultsAccordionComponent,
		SubpageScanningComponent,
		SubpageScheduleScanComponent,
		SubpageSmartPerformanceDashboardComponent,
		SubpageSmartPerformanceScanSummaryComponent,
	],
	imports: [
		CommonModule,
		NgbModule,
		SmartPerformanceRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		NgbDatepickerModule,
		PageLayoutModule,
		HeaderMainModule,
		FontAwesomeModule,
		CommonUiModule,
		WidgetOfflineModule,
		SanitizeModule,
		TranslationModule.forChild(),
		UiButtonModule,
		SharedModule,
		MatTooltipModule,
		MatIconModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	exports: [
		SubpageSmartPerformanceDashboardComponent,
		SubpageSmartPerformanceScanSummaryComponent,
		SubpageScanningComponent,
		ModalSmartPerformanceCancelComponent,
		ModalSmartPerformanceSubscribeComponent,
		CommonUiModule,
	],
	bootstrap: [
		SubpageSmartPerformanceDashboardComponent,
		SubpageSmartPerformanceScanSummaryComponent,
		SubpageScanningComponent,
		ModalSmartPerformanceCancelComponent,
		ModalSmartPerformanceSubscribeComponent,
	],
})
export class SmartPerformanceModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faLaptop);
		library.addIcons(faTrashAlt);
		library.addIcons(faExclamationTriangle);
		library.addIcons(faCalendarAlt);
		library.addIcons(faTachometerAltFast);
		library.addIcons(faWifi);
		library.addIcons(faShield);
		library.addIcons(faBug);
		library.addIcons(faCheck);
		library.addIcons(faTimes);
		library.addIcons(faChevronDown);
		library.addIcons(faCircle);
	}
}
