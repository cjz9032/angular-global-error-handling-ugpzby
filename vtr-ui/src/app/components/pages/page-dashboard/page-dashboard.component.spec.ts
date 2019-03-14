import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDashboardComponent } from './page-dashboard.component';
import { HeaderMainComponent } from '../../header-main/header-main.component';
import { WidgetCarouselComponent } from '../../widgets/widget-carousel/widget-carousel.component';
import { ContainerCardComponent } from '../../container-card/container-card.component';
import { WidgetFeedbackComponent } from '../../widgets/widget-feedback/widget-feedback.component';
import { WidgetQuicksettingsComponent } from '../../widgets/widget-quicksettings/widget-quicksettings.component';
import { WidgetStatusComponent } from '../../widgets/widget-status/widget-status.component';
import { WidgetQuestionsComponent } from '../../widgets/widget-questions/widget-questions.component';
import { FeedbackFormComponent } from '../../feedback-form/feedback-form/feedback-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuHeaderComponent } from '../../menu-header/menu-header.component';

describe('PageDashboardComponent', () => {
	let component: PageDashboardComponent;
	let fixture: ComponentFixture<PageDashboardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				FontAwesomeModule
			],
			declarations: [
				PageDashboardComponent,
				HeaderMainComponent,
				WidgetCarouselComponent,
				ContainerCardComponent,
				WidgetFeedbackComponent,
				WidgetQuicksettingsComponent,
				WidgetStatusComponent,
				WidgetQuestionsComponent,
				FeedbackFormComponent,
				MenuHeaderComponent
			 ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
