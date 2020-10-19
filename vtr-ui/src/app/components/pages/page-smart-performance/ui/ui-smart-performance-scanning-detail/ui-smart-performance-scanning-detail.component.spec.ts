import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSmartPerformanceScanningDetailComponent } from './ui-smart-performance-scanning-detail.component';

describe('UiSmartPerformanceScanningDetailComponent', () => {
	let component: UiSmartPerformanceScanningDetailComponent;
	let fixture: ComponentFixture<UiSmartPerformanceScanningDetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiSmartPerformanceScanningDetailComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
