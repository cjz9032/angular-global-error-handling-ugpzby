import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsForYouRoutingModule } from './apps-for-you-routing.module';
import { PageAppsForYouComponent } from 'src/app/components/pages/page-apps-for-you/page-apps-for-you.component';

import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { SharedModule } from '../shared.module';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';

import { CommonPipeModule } from '../common/common-pipe.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons/faChevronRight';
import { ModalAppsForYouScreenshotComponent } from 'src/app/components/modal/modal-apps-for-you-screenshot/modal-apps-for-you-screenshot.component';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';
library.add(faChevronLeft);
library.add(faChevronRight);

@NgModule({
	declarations: [
		PageAppsForYouComponent,
		ModalAppsForYouScreenshotComponent,
	],
	imports: [
		CommonModule,
		AppsForYouRoutingModule,
		CommonUiModule,
		CommonPipeModule,
		CommonWidgetModule,
		SharedModule,
		WidgetOfflineModule,
		PageLayoutModule,
		NgbModalModule
	],
	providers: [
		SystemUpdateService,
	],
	entryComponents: [
		ModalAppsForYouScreenshotComponent,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppsForYouModule { }
