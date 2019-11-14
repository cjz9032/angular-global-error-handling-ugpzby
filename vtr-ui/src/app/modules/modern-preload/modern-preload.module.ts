import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonPipeModule } from '../common/common-pipe.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { SharedModule } from '../shared.module';

import { ModalModernPreloadComponent } from 'src/app/components/modal/modal-modern-preload/modal-modern-preload.component';
import { ModernPreloadService } from 'src/app/services/modern-preload/modern-preload.service';
import { ModernPreloadRoutingModule } from './modern-preload-routing.module';


@NgModule({
	declarations: [
		ModalModernPreloadComponent,
	],
	imports: [
		CommonModule,
		CommonUiModule,
		CommonPipeModule,
		CommonWidgetModule,
		SharedModule,
		ModernPreloadRoutingModule
	],
	providers: [
		ModernPreloadService,
	],
	entryComponents: [
		ModalModernPreloadComponent,
	]
})
export class ModernPreloadModule { }
