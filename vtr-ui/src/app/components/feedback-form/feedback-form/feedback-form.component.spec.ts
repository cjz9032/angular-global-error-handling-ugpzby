import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeedbackFormComponent } from './feedback-form.component';

xdescribe('FeedbackFormComponent', () => {
	let component: FeedbackFormComponent;
	let fixture: ComponentFixture<FeedbackFormComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [FeedbackFormComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FeedbackFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
