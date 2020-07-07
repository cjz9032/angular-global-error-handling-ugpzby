import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDeviceComponent } from './widget-device.component';
import { DeviceService } from '../../../services/device/device.service';
import { CommonService } from 'src/app/services/common/common.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { WarrantyService } from 'src/app/services/warranty/warranty.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DevService } from '../../../services/dev/dev.service';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';

describe('WidgetDeviceComponent', () => {
	let component: WidgetDeviceComponent;
	let fixture: ComponentFixture<WidgetDeviceComponent>;
	let commonService: CommonService;
	let translate: TranslateService
	let warrantyService: WarrantyService;
	let metricService: MetricService;
	let deviceService: DeviceService;
	let adPolicyService: AdPolicyService;
	let dashboardService: DashboardService;
	let timerService: TimerService;
	let devService: DevService;
	let formatLocaleDatePipe: FormatLocaleDatePipe;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [WidgetDeviceComponent, SvgInlinePipe],
			imports: [RouterTestingModule, TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				}
			}), HttpClientTestingModule],
			providers: [TimerService, DashboardService, CommonService, TranslateService, WarrantyService, MetricService, DeviceService, DevService, FormatLocaleDatePipe]
		})
			.compileComponents();
	}));
	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetDeviceComponent);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		translate = TestBed.get(TranslateService)
		deviceService = TestBed.get(DeviceService)
		devService = TestBed.get(DevService);
		metricService = TestBed.get(MetricService)
		formatLocaleDatePipe = TestBed.get(FormatLocaleDatePipe);
	});
	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeDefined();
	});
});
