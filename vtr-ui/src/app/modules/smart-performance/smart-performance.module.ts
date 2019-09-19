import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartPerformanceRoutingModule } from './smart-performance-routing.module';
import { PageSmartPerformanceComponent } from '../../components/pages/page-smart-performance/page-smart-performance.component';
import { UiSmartPerformanceComponent } from 'src/app/components/ui/ui-smart-performance/ui-smart-performance.component';
import { HeaderMainModule } from 'src/app/components/header-main/header-main.module';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLaptop } from '@fortawesome/free-solid-svg-icons/faLaptop';


library.add(faLaptop);

@NgModule({
  declarations: [
	  PageSmartPerformanceComponent,
	  UiSmartPerformanceComponent
	],
  imports: [
  SmartPerformanceRoutingModule,
  HeaderMainModule,
  FontAwesomeModule
  ]
})
export class SmartPerformanceModule { }
