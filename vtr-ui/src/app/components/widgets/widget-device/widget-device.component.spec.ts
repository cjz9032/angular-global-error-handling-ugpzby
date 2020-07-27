import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { WarrantyService } from 'src/app/services/warranty/warranty.service';
import { DevService } from '../../../services/dev/dev.service';
import { DeviceService } from '../../../services/device/device.service';
import { WidgetDeviceComponent } from './widget-device.component';


describe('WidgetDeviceComponent', () => {
	let component: WidgetDeviceComponent;
	let fixture: ComponentFixture<WidgetDeviceComponent>;
	let commonService: CommonService;
	let translate: TranslateService;
	// let warrantyService: WarrantyService;
	let metricService: MetricService;
	let deviceService: DeviceService;
	/* let adPolicyService: AdPolicyService;
	let dashboardService: DashboardService;
	let timerService: TimerService; */
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
		commonService = TestBed.inject(CommonService);
		translate = TestBed.inject(TranslateService);
		deviceService = TestBed.inject(DeviceService);
		devService = TestBed.inject(DevService);
		metricService = TestBed.inject(MetricService);
		formatLocaleDatePipe = TestBed.inject(FormatLocaleDatePipe);
	});
	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeDefined();
	});
});
