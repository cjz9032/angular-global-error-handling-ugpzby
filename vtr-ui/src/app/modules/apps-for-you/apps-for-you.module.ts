import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsForYouRoutingModule } from './apps-for-you-routing.module';
import { PageAppsForYouComponent } from 'src/app/components/pages/page-apps-for-you/page-apps-for-you.component';

import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { SharedModule } from '../shared.module';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBook } from '@fortawesome/pro-light-svg-icons/faBook';
import { faCommentAlt } from '@fortawesome/pro-light-svg-icons/faCommentAlt';
import { faShareAlt } from '@fortawesome/pro-light-svg-icons/faShareAlt';
import { faTicketAlt } from '@fortawesome/pro-light-svg-icons/faTicketAlt';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { faHeart as falHeart } from '@fortawesome/pro-light-svg-icons/faHeart';
import { CommonPipeModule } from '../common/common-pipe.module';
import { ModalLicenseComponent } from 'src/app/components/modal/modal-license/modal-license.component';
import { ModalAboutComponent } from 'src/app/components/modal/modal-about/modal-about.component';
import { ModalFindUsComponent } from 'src/app/components/modal/modal-find-us/modal-find-us.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


library.add(faBook);
library.add(faCommentAlt);
library.add(faShareAlt);
library.add(faTicketAlt);
library.add(faBriefcase);
library.add(falHeart);


@NgModule({
	declarations: [
		PageAppsForYouComponent
	],
	imports: [
		CommonModule,
		AppsForYouRoutingModule,
		CommonUiModule,
		CommonPipeModule,
		CommonWidgetModule,
		SharedModule,
		WidgetOfflineModule,
		NgbModalModule
	],
	providers: [
		SystemUpdateService,
	],
	entryComponents: [
	]
})
export class AppsForYouModule { }
