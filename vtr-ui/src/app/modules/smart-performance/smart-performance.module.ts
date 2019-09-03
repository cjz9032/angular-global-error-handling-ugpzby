import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartPerformanceRoutingModule } from './smart-performance-routing.module';
import { PageSmartPerformanceComponent } from '../../components/pages/page-smart-performance/page-smart-performance.component';
import { UiSmartPerformanceComponent } from 'src/app/components/ui/ui-smart-performance/ui-smart-performance.component';

@NgModule({
  declarations: [
	  PageSmartPerformanceComponent,
	  UiSmartPerformanceComponent
	],
  imports: [
  SmartPerformanceRoutingModule
  ]
})
export class SmartPerformanceModule { }
