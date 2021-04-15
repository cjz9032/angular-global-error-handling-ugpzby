import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { MatButtonModule } from '@lenovo/material/button';
import { MatIconModule } from '@lenovo/material/icon';
import { MatTooltipModule } from '@lenovo/material/tooltip';
import { MatDialogModule } from '@lenovo/material/dialog';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';

import { HardwareDashboardRoutingModule } from './hardware-dashboard-routing.module';
import { TranslationModule } from '../translation.module';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { CommonPipeModule } from '../common/common-pipe.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { WidgetCarouselModule } from 'src/app/components/widgets/widget-carousel/widget-carousel.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';
import { WidgetSecurityStatusModule } from 'src/app/components/widgets/widget-security-status/widget-security-status.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { WidgetSupportModule } from 'src/app/components/widgets/widget-support/widget-support.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { AppSearchModule } from '../app-search/app-search.module';
import { MaterialModule } from '../common/material.module';

import { MockService } from 'src/app/services/mock/mock.service';

import { PageDashboardComponent } from 'src/app/components/pages/page-dashboard/page-dashboard.component';
import { WidgetQuicksettingsComponent } from 'src/app/components/widgets/widget-quicksettings/widget-quicksettings.component';
import { WidgetSwitchIconComponent } from 'src/app/components/widgets/widget-switch-icon/widget-switch-icon.component';
import { WidgetDashboardWarrantyComponent } from 'src/app/components/widgets/widget-dashboard-warranty/widget-dashboard-warranty.component';
import { WidgetSystemUpdateComponent } from 'src/app/components/widgets/widget-system-update/widget-system-update.component';
import { WidgetEnergyStarComponent } from 'src/app/components/widgets/widget-energy-star/widget-energy-star.component';
import { WidgetQuicksettingsNoteComponent } from 'src/app/components/widgets/widget-quicksettings/widget-quicksettings-note/widget-quicksettings-note.component';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons/faChevronRight';
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons/faChevronLeft';
import { WidgetWarrantyDetailModule } from 'src/app/components/widgets/widget-warranty-detail/widget-warranty-detail.module';
import { MaterialChevronModule } from 'src/app/material/material-chevron/material-chevron.module';
import { WidgetQuestionsModule } from 'src/app/components/widgets/widget-questions/widget-questions.module';

@NgModule({
	declarations: [
		PageDashboardComponent,
		WidgetSwitchIconComponent,
		WidgetQuicksettingsComponent,
		WidgetQuicksettingsNoteComponent,
		WidgetSystemUpdateComponent,
		WidgetEnergyStarComponent,
		WidgetDashboardWarrantyComponent,
	],
	imports: [
		CommonModule,
		CommonWidgetModule,
		HardwareDashboardRoutingModule,
		TranslationModule.forChild(),
		MetricsModule,
		ContainerCardModule,
		UiButtonModule,
		WidgetSecurityStatusModule,
		WidgetQuestionsModule,
		WidgetSupportModule,
		NgbCarouselModule,
		NgbDropdownModule,
		WidgetOfflineModule,
		WidgetCarouselModule,
		FontAwesomeModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		CommonPipeModule,
		PageLayoutModule,
		WidgetWarrantyDetailModule,
		AppSearchModule,
		FeedbackModule,
		MatButtonModule,
		MatIconModule,
		NgbTooltipModule,
		MatTooltipModule,
		MaterialModule,
		MatDialogModule,
		MaterialChevronModule,
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
		WidgetQuestionsModule,
		WidgetWarrantyDetailModule,
		WidgetDashboardWarrantyComponent,
		NgbTooltipModule,
		MatTooltipModule,
		MaterialModule,
		MaterialChevronModule,
	],
	providers: [MockService],
	entryComponents: [],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class HardwareDashboardModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faTimes);
		library.addIcons(faExclamationCircle);
		library.addIcons(faCheckCircle);
		library.addIcons(faChevronRight);
		library.addIcons(faChevronLeft);
		library.addIcons(faArrowRight);
	}
}
