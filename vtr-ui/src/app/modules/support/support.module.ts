import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { PageSupportComponent } from 'src/app/components/pages/page-support/page-support.component';

import { UIArticleItemComponent } from 'src/app/components/ui/ui-article-item/ui-article-item.component';
import { ContainerArticleComponent } from 'src/app/components/container-article/container-article.component';

import { SupportService } from 'src/app/services/support/support.service';
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
import { WidgetWarrantyModule } from 'src/app/components/widgets/widget-warranty/widget-warranty.module';

library.add(faBook);
library.add(faCommentAlt);
library.add(faShareAlt);
library.add(faTicketAlt);
library.add(faBriefcase);
library.add(falHeart);


@NgModule({
	declarations: [
		PageSupportComponent,
		UIArticleItemComponent,
		ContainerArticleComponent,
		ModalLicenseComponent,
		ModalAboutComponent,
		ModalFindUsComponent,
	],
	imports: [
		CommonModule,
		SupportRoutingModule,
		CommonUiModule,
		CommonPipeModule,
		CommonWidgetModule,
		SharedModule,
		WidgetOfflineModule,
		NgbModalModule,
		WidgetWarrantyModule
	],
	providers: [
		SupportService,
	],
	entryComponents: [
		ModalLicenseComponent,
		ModalAboutComponent,
		ModalFindUsComponent,
	]
})
export class SupportModule { }
