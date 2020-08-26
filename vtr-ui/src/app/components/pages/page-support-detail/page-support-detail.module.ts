import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { PageSupportDetailComponent } from './page-support-detail.component';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { RouterModule } from '@angular/router';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from 'src/app/modules/translation.module';
import { WidgetSecurityStatusModule } from 'src/app/components/widgets/widget-security-status/widget-security-status.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { faThumbsUp } from '@fortawesome/pro-light-svg-icons/faThumbsUp';
import { faThumbsDown } from '@fortawesome/pro-light-svg-icons/faThumbsDown';
import { SupportDetailArticleAComponent } from './children/support-detail-article-a/support-detail-article-a.component';
import { SupportDetailArticleBComponent } from './children/support-detail-article-b/support-detail-article-b.component';
import { SupportDetailArticleCComponent } from './children/support-detail-article-c/support-detail-article-c.component';
import { SupportDetailArticleDComponent } from './children/support-detail-article-d/support-detail-article-d.component';
import { SupportDetailArticleEComponent } from './children/support-detail-article-e/support-detail-article-e.component';
@NgModule({
	declarations: [
		PageSupportDetailComponent,
		SupportDetailArticleAComponent,
		SupportDetailArticleBComponent,
		SupportDetailArticleCComponent,
		SupportDetailArticleDComponent,
		SupportDetailArticleEComponent
	],
	exports: [
		PageSupportDetailComponent,
		SupportDetailArticleAComponent,
		SupportDetailArticleBComponent,
		SupportDetailArticleCComponent,
		SupportDetailArticleDComponent,
		SupportDetailArticleEComponent
	],
	imports: [
		CommonModule,
		MetricsModule,
		RouterModule,
		AppSearchModule,
		NgbTooltipModule,
		TranslationModule,
		WidgetSecurityStatusModule,
		PageLayoutModule,
		UiButtonModule,
		FontAwesomeModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class PageSupportDetailModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faBriefcase);
		library.addIcons(faThumbsUp);
		library.addIcons(faThumbsDown);
	}
}
