import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@lenovo/material/dialog';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { PageHighDensityBatteryComponent } from './page-high-density-battery.component';

describe('PageHighDensityBatteryComponent', () => {
	let component: PageHighDensityBatteryComponent;
	let fixture: ComponentFixture<PageHighDensityBatteryComponent>;

	let batteryService: BatteryDetailService;
	const mockRouter = {
		navigate: jasmine.createSpy('navigate'),
	};

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				schemas: [NO_ERRORS_SCHEMA],
				imports: [
					TranslateModule.forRoot({
						loader: {
							provide: TranslateLoader,
							useFactory: HttpLoaderFactory,
							deps: [HttpClient],
						},
					}),
					HttpClientTestingModule,
					RouterTestingModule,
				],
				providers: [
					MatDialog,
					BatteryDetailService,
					{ provide: Router, useValue: mockRouter },
				],
				declarations: [PageHighDensityBatteryComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(PageHighDensityBatteryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		batteryService = TestBed.inject(BatteryDetailService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should navigate to power page and open battery-details', () => {
		batteryService.currentOpenModal = 'battery-details';
		component.gotoBatteryDetails();
		expect(mockRouter.navigate).toHaveBeenCalledWith(['device/device-settings'], {
			queryParams: { batterydetail: true },
		});
	});

	it('should navigate to power page and open battery-charge-threshold popup', () => {
		batteryService.currentOpenModal = 'threshold';
		component.gotoBatteryDetails();
		expect(mockRouter.navigate).toHaveBeenCalledWith(['device/device-settings'], {
			queryParams: { threshold: true },
		});
	});
});
