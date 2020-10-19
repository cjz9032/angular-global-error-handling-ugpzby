import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSmartPerformanceRatingComponent } from './ui-smart-performance-rating.component';

describe('UiSmartPerformanceRatingComponent', () => {
	let component: UiSmartPerformanceRatingComponent;
	let fixture: ComponentFixture<UiSmartPerformanceRatingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiSmartPerformanceRatingComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceRatingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
