import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryDetailComponent } from './battery-detail.component';
import { BatteryIndicatorComponent } from '../battery-indicator/battery-indicator.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('BatteryDetailComponent', () => {
	let component: BatteryDetailComponent;
	let fixture: ComponentFixture<BatteryDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FontAwesomeModule],
			declarations: [
				BatteryDetailComponent,
				BatteryIndicatorComponent],
				providers: [
					HttpClient,
					HttpHandler
				]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
