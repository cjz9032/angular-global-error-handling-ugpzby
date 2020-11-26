import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSmartPerformanceHeaderComponent } from './ui-smart-performance-header.component';

describe('UiSmartPerformanceHeaderComponent', () => {
	let component: UiSmartPerformanceHeaderComponent;
	let fixture: ComponentFixture<UiSmartPerformanceHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiSmartPerformanceHeaderComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
