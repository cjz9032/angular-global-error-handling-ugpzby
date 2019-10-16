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


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UiSmartTunePcComponent } from '../../components/ui/ui-smart-tune-pc/ui-smart-tune-pc.component';
import { UiSmartPerformanceScanningComponent } from '../../components/ui/ui-smart-performance-scanning/ui-smart-performance-scanning.component';
import { ModalSmartPerformanceCancelComponent } from '../../components/modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalSmartPerformanceSubscribeComponent } from '../../components/modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
library.add(faLaptop);
library.add(faTrashAlt);
library.add(faExclamationTriangle);

@NgModule({
  declarations: [
	  PageSmartPerformanceComponent,
	  UiSmartPerformanceComponent,
    UiSmartTunePcComponent,
    UiSmartPerformanceScanningComponent,
    ModalSmartPerformanceCancelComponent,
    ModalSmartPerformanceSubscribeComponent,


	],
  imports: [ CommonModule,
	  NgbModule,
  SmartPerformanceRoutingModule,
  AccordionModule.forRoot(),
  HeaderMainModule,
  FontAwesomeModule
  ],
  exports: [UiSmartPerformanceComponent,UiSmartPerformanceScanningComponent,ModalSmartPerformanceCancelComponent, ModalSmartPerformanceSubscribeComponent],
  bootstrap: [UiSmartPerformanceComponent,UiSmartPerformanceScanningComponent,ModalSmartPerformanceCancelComponent, ModalSmartPerformanceSubscribeComponent]
})
export class SmartPerformanceModule { }
