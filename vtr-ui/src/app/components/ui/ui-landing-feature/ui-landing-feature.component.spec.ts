import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLandingFeatureComponent } from './ui-landing-feature.component';

xdescribe('UiLandingFeatureComponent', () => {
	let component: UiLandingFeatureComponent;
	let fixture: ComponentFixture<UiLandingFeatureComponent>;

	beforeEach(async(() => {
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
