import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiLandingFeatureComponent } from './ui-landing-feature.component';

xdescribe('UiLandingFeatureComponent', () => {
	let component: UiLandingFeatureComponent;
	let fixture: ComponentFixture<UiLandingFeatureComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiLandingFeatureComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiLandingFeatureComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
