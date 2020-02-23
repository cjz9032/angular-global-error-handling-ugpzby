import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FeedbackFormComponent } from 'src/app/components/feedback-form/feedback-form/feedback-form.component';
import { TranslationModule } from '../translation.module';
import { MockService } from 'src/app/services/mock/mock.service';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { HeaderMainModule } from 'src/app/components/header-main/header-main.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { AndroidDashboardRoutingModule } from './android-dashboard-routing.module';
import { WidgetCarouselModule } from 'src/app/components/widgets/widget-carousel/widget-carousel.module';
import { PageDashboardAndroidComponent } from 'src/app/components/pages/page-dashboard-android/page-dashboard-android.component';

@NgModule({
	declarations: [
		PageDashboardAndroidComponent
	],
	imports: [
		CommonModule,
		AndroidDashboardRoutingModule,
		TranslationModule.forChild(),
		MetricsModule,
		ContainerCardModule,
		WidgetCarouselModule,
		WidgetOfflineModule,
		HeaderMainModule,
	],
	exports: [
		MetricsModule,
		ContainerCardModule,
		WidgetCarouselModule,
		WidgetOfflineModule,
		HeaderMainModule,
		PageDashboardAndroidComponent
	],
	providers: [MockService],
	entryComponents: [FeedbackFormComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AndroidDashboardModule { }
