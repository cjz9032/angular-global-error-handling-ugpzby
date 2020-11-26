import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetFeedbackComponent } from './widget-feedback.component';

xdescribe('WidgetFeedbackComponent', () => {
	let component: WidgetFeedbackComponent;
	let fixture: ComponentFixture<WidgetFeedbackComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetFeedbackComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetFeedbackComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
