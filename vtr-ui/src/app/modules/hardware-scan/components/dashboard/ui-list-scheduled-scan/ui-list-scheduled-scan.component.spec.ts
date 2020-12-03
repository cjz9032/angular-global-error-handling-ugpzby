import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiListScheduledScanComponent } from './ui-list-scheduled-scan.component';

xdescribe('UiListScheduledScanComponent', () => {
	let component: UiListScheduledScanComponent;
	let fixture: ComponentFixture<UiListScheduledScanComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiListScheduledScanComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiListScheduledScanComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
