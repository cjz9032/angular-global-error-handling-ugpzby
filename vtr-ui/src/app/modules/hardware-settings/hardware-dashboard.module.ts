import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HardwareDashboardRoutingModule } from './hardware-dashboard-routing.module';
import { TranslationModule } from '../translation.module';
import { MockService } from 'src/app/services/mock/mock.service';
import { PageDashboardComponent } from 'src/app/components/pages/page-dashboard/page-dashboard.component';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { WidgetQuicksettingsComponent } from 'src/app/components/widgets/widget-quicksettings/widget-quicksettings.component';
import { WidgetSwitchIconComponent } from 'src/app/components/widgets/widget-switch-icon/widget-switch-icon.component';
import { WidgetSecurityStatusModule } from 'src/app/components/widgets/widget-security-status/widget-security-status.module';
import { NgbCarouselModule, NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { WidgetCarouselModule } from 'src/app/components/widgets/widget-carousel/widget-carousel.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';
import { CommonPipeModule } from '../common/common-pipe.module';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
import { WidgetDashboardWarrantyComponent } from 'src/app/components/widgets/widget-dashboard-warranty/widget-dashboard-warranty.component';
import { FeedbackModule } from '../feedback/feedback.module';

@NgModule({
	declarations: [
		PageDashboardComponent,
		WidgetSwitchIconComponent,
		WidgetQuicksettingsComponent,
		WidgetDashboardWarrantyComponent
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
		NgbDropdownModule,
		WidgetOfflineModule,
		WidgetCarouselModule,
		FontAwesomeModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModalModule,
		CommonPipeModule,
		PageLayoutModule,
		AppSearchModule,
		FeedbackModule,
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
		PageLayoutModule,
		AppSearchModule,
		WidgetDashboardWarrantyComponent
	],
	providers: [MockService],
	entryComponents: [],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class HardwareDashboardModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faTimes);
		library.addIcons(faExclamationCircle);
		library.addIcons(faCheckCircle);
	}
}
