import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BatteryCapacityComponent } from './battery-capacity.component';
import { BatteryHealthService } from '../battery-health.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { PowerService } from '../../../../../../../services/power/power.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

describe('BatteryCapacityComponent', () => {
	let component: BatteryCapacityComponent;
	let fixture: ComponentFixture<BatteryCapacityComponent>;
	let powerService: PowerService;
	let batteryHealthService: BatteryHealthService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [BatteryCapacityComponent],
			imports: [
				RouterTestingModule,
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: HttpLoaderFactory,
						deps: [HttpClient],
					},
				}),
				HttpClientTestingModule,
				NgbTooltipModule,
			],
			providers: [PowerService, BatteryHealthService, VantageShellService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryCapacityComponent);
		component = fixture.componentInstance;
		powerService = TestBed.inject(PowerService);
		batteryHealthService = TestBed.inject(BatteryHealthService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call setCircleInformation 30', () => {
		component.capacityError = false;
		component.capacity = 30;
		component.setCircleInformation();
	});
	it('should call setCircleInformation 50', () => {
		component.capacityError = false;
		component.capacity = 50;
		component.setCircleInformation();
	});
	it('should call setCircleInformation 65', () => {
		component.capacityError = false;
		component.capacity = 65;
		component.setCircleInformation();
	});
	it('should call setCircleInformation 80', () => {
		component.capacityError = false;
		component.capacity = 80;
		component.setCircleInformation();
	});
	it('should call setCircleInformation', () => {
		component.capacityError = true;
		component.setCircleInformation();
	});
	it('should call onRightIconClick', () => {
		const tooltip = '';
		component.onRightIconClick(tooltip, true);
	});
	it('should call toggleToolTip', () => {
		const tooltip = {
			isOpen: () => true,
			close: () => true,
			open: () => true,
		};
		component.toggleToolTip(tooltip, true);
	});
	it('should call isCapacityError', () => {
		const batteryInfo = {
			lifePercent: 100,
			fullChargeCapacity: -1,
			designCapacity: -1,
		};
		component.isCapacityError(batteryInfo);
	});
});
