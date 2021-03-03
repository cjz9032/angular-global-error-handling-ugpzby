import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTooltipModule } from '@lenovo/material/tooltip';
import { MatDialogModule } from '@lenovo/material/dialog';
import { MatIconModule } from '@lenovo/material/icon';
import { MatButtonModule } from '@lenovo/material/button';

import { SupportRoutingModule } from './support-routing.module';
import { PageSupportComponent } from 'src/app/components/pages/page-support/page-support.component';

import { UIArticleItemComponent } from 'src/app/components/ui/ui-article-item/ui-article-item.component';
import { ContainerArticleComponent } from 'src/app/components/container-article/container-article.component';

import { SupportService } from 'src/app/services/support/support.service';
import { SharedModule } from '../shared.module';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBook } from '@fortawesome/pro-light-svg-icons/faBook';
import { faCommentAlt } from '@fortawesome/pro-light-svg-icons/faCommentAlt';
import { faShareAlt } from '@fortawesome/pro-light-svg-icons/faShareAlt';
import { faTicketAlt } from '@fortawesome/pro-light-svg-icons/faTicketAlt';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { faRobot } from '@fortawesome/pro-light-svg-icons/faRobot';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';
import { faHeart as falHeart } from '@fortawesome/pro-light-svg-icons/faHeart';
import { CommonPipeModule } from '../common/common-pipe.module';
import { ModalLicenseComponent } from 'src/app/components/modal/modal-license/modal-license.component';
import { ModalAboutComponent } from 'src/app/components/modal/modal-about/modal-about.component';
import { ModalFindUsComponent } from 'src/app/components/modal/modal-find-us/modal-find-us.component';
import { FeedbackModule } from '../feedback/feedback.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';
import { LicensesService } from 'src/app/services/licenses/licenses.service';
import { UiCloseButtonModule } from 'src/app/components/ui/ui-close-button/ui-close-button.module';
import { PageContentLibraryComponent } from 'src/app/components/pages/page-content-library/page-content-library.component';
import { WidgetWarrantyDetailModule } from 'src/app/components/widgets/widget-warranty-detail/widget-warranty-detail.module';
import { ModalWarrantyCartComponent } from 'src/app/components/modal/modal-warranty-cart/modal-warranty-cart.component';


@NgModule({
	declarations: [
		PageSupportComponent,
		PageContentLibraryComponent,
		UIArticleItemComponent,
		ContainerArticleComponent,
		ModalLicenseComponent,
		ModalAboutComponent,
		ModalFindUsComponent,
		ModalWarrantyCartComponent,
	],
	imports: [
		CommonModule,
		SupportRoutingModule,
		FontAwesomeModule,
		CommonUiModule,
		UiCloseButtonModule,
		CommonPipeModule,
		CommonWidgetModule,
		SharedModule,
		WidgetOfflineModule,
		WidgetWarrantyDetailModule,
		FeedbackModule,
		PageLayoutModule,
		MatTooltipModule,
		MatDialogModule,
		MatIconModule,
		MatButtonModule,
	],
	providers: [SupportService, LicensesService],
	exports: [
		UIArticleItemComponent,
		ContainerArticleComponent,
	],
	entryComponents: [
		ModalLicenseComponent,
		ModalAboutComponent,
		ModalFindUsComponent,
		ModalWarrantyCartComponent,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SupportModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(
			faBook,
			faCommentAlt,
			faShareAlt,
			faTicketAlt,
			faBriefcase,
			falHeart,
			faRobot,
			faCheckCircle,
		);
	}
}
