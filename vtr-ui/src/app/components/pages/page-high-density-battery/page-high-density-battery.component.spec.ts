import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHighDensityBatteryComponent } from './page-high-density-battery.component';

describe('PageHighDensityBatteryComponent', () => {
	let component: PageHighDensityBatteryComponent;
	let fixture: ComponentFixture<PageHighDensityBatteryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageHighDensityBatteryComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageHighDensityBatteryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
