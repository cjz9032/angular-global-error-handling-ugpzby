import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubpageScanResultsAccordionComponent } from './subpage-scan-results-accordion.component';

describe('SubpageScanResultsAccordionComponent', () => {
	let component: SubpageScanResultsAccordionComponent;
	let fixture: ComponentFixture<SubpageScanResultsAccordionComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageScanResultsAccordionComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SubpageScanResultsAccordionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
