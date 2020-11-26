import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryLayoutComponent } from './battery-layout.component';

describe('BatteryLayoutComponent', () => {
	let component: BatteryLayoutComponent;
	let fixture: ComponentFixture<BatteryLayoutComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BatteryLayoutComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
