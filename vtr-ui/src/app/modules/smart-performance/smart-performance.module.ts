import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartPerformanceRoutingModule } from './smart-performance-routing.module';
import { PageSmartPerformanceComponent } from '../../components/pages/page-smart-performance/page-smart-performance.component';
import { UiSmartPerformanceComponent } from 'src/app/components/ui/ui-smart-performance/ui-smart-performance.component';
import { HeaderMainModule } from 'src/app/components/header-main/header-main.module';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
import {faCircle} from '@fortawesome/free-solid-svg-icons/faCircle';

import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { UiSmartTunePcComponent } from '../../components/ui/ui-smart-tune-pc/ui-smart-tune-pc.component';
import { UiSmartPerformanceScanningComponent } from '../../components/ui/ui-smart-performance-scanning/ui-smart-performance-scanning.component';
import { ModalSmartPerformanceCancelComponent } from '../../components/modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';
import { ModalSmartPerformanceSubscribeComponent } from '../../components/modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { WidgetSpeedometerComponent } from '../../components/widgets/widget-speedometer/widget-speedometer.component';
import { UiSmartPerformanceScanSummaryComponent } from '../../components/ui/ui-smart-performance-scan-summary/ui-smart-performance-scan-summary.component';
import { FormsModule } from '@angular/forms';
import { CommonUiModule } from '../common/common-ui.module';
import { TranslationModule } from '../translation.module';
import { WidgetSubscriptiondetailsComponent } from 'src/app/components/widgets/widget-subscriptiondetails/widget-subscriptiondetails.component';
import { WidgetScansettingsComponent } from '../../components/widgets/widget-scansettings/widget-scansettings.component';
library.add(faLaptop);
library.add(faTrashAlt);
library.add(faExclamationTriangle);
library.add(faCalendarAlt);
library.add(faTachometerAltFast);
library.add(faWifi);
library.add(faShield);
library.add(faBug);
library.add(faCheck);
library.add(faTimes);
library.add(faChevronDown);
library.add(faCircle);
@NgModule({
  declarations: [
	  PageSmartPerformanceComponent,
	  UiSmartPerformanceComponent,
    UiSmartTunePcComponent,
    UiSmartPerformanceScanningComponent,
    ModalSmartPerformanceCancelComponent,
    ModalSmartPerformanceSubscribeComponent,
    WidgetSpeedometerComponent,
    UiSmartPerformanceScanSummaryComponent,
    WidgetSubscriptiondetailsComponent,
    WidgetScansettingsComponent

	],
  imports: [ CommonModule,
	  NgbModule,
  SmartPerformanceRoutingModule,
    FormsModule ,
  NgbDatepickerModule ,
  HeaderMainModule,
  FontAwesomeModule,
  CommonUiModule,
  TranslationModule.forChild()
  ],
  exports: [UiSmartPerformanceComponent,UiSmartPerformanceScanningComponent,ModalSmartPerformanceCancelComponent, ModalSmartPerformanceSubscribeComponent, WidgetSpeedometerComponent,UiSmartPerformanceScanSummaryComponent,CommonUiModule],
  bootstrap: [UiSmartPerformanceComponent,UiSmartPerformanceScanningComponent,ModalSmartPerformanceCancelComponent, ModalSmartPerformanceSubscribeComponent, WidgetSpeedometerComponent,UiSmartPerformanceScanSummaryComponent]
})
export class SmartPerformanceModule { }
