import { CommonModule } from '@angular/common/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FeedbackFormComponent } from 'src/app/components/feedback-form/feedback-form/feedback-form.component';
import { HardwareDashboardRoutingModule } from './hardware-dashboard-routing.module';
import { TranslationModule } from '../translation.module';
import { MockService } from 'src/app/services/mock/mock.service';
import { PageDashboardComponent } from 'src/app/components/pages/page-dashboard/page-dashboard.component';
import { MetricsModule } from 'src/app/directives/metrics.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { WidgetFeedbackComponent } from 'src/app/components/widgets/widget-feedback/widget-feedback.component';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { WidgetQuicksettingsComponent } from 'src/app/components/widgets/widget-quicksettings/widget-quicksettings.component';
import { WidgetSwitchIconComponent } from 'src/app/components/widgets/widget-switch-icon/widget-switch-icon.component';
import { WidgetSecurityStatusModule } from 'src/app/components/widgets/widget-security-status/widget-security-status.module';
import { NgbCarouselModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderMainModule } from 'src/app/components/header-main/header-main.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { WidgetCarouselModule } from 'src/app/components/widgets/widget-carousel/widget-carousel.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

library.add(faTimes);


@NgModule({
	declarations: [
		FeedbackFormComponent,
		PageDashboardComponent,
		WidgetFeedbackComponent,
		WidgetSwitchIconComponent,
		WidgetQuicksettingsComponent,
	],
	imports: [
		CommonModule,
		HardwareDashboardRoutingModule,
		TranslationModule.forChild(),
		MetricsModule,
		ContainerCardModule,
		UiButtonModule,
		WidgetSecurityStatusModule,
		NgbCarouselModule,
		HeaderMainModule,
		NgbDropdownModule,
		WidgetOfflineModule,
		WidgetCarouselModule,
		FontAwesomeModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
	],
	exports: [
		MetricsModule,
		ContainerCardModule,
		NgbCarouselModule,
		NgbDropdownModule,
		WidgetCarouselModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
	],
	providers: [MockService],
	entryComponents: [FeedbackFormComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class HardwareDashboardModule { }
