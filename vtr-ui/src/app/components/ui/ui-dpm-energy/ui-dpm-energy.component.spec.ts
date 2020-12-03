import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiDpmEnergyComponent } from './ui-dpm-energy.component';

describe('UiDpmEnergyComponent', () => {
	let component: UiDpmEnergyComponent;
	let fixture: ComponentFixture<UiDpmEnergyComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiDpmEnergyComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDpmEnergyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
