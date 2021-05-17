import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { AndroidService } from 'src/app/services/android/android.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from 'src/app/services/common/common.service';
import { CommsService } from 'src/app/services/comms/comms.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { QaService } from 'src/app/services/qa/qa.service';
import { SelfSelectService } from 'src/app/services/self-select/self-select.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { UPEService } from 'src/app/services/upe/upe.service';
import { UserService } from 'src/app/services/user/user.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { WarrantyService } from 'src/app/services/warranty/warranty.service';
import { PageDashboardComponent } from './page-dashboard.component';

class TranslateServiceStub {
	public onTranslationChange: EventEmitter<any> = new EventEmitter();
	public onDefaultLangChange: EventEmitter<any> = new EventEmitter();
	instant(data: string) {}
	stream(data: string) {
		return of(data);
	}
	get(key: string) {
		return of(key);
	}
	setDefaultLang(lang: string) {}
	use(lang: string) {}
	get onLangChange() {
		return of({ lang: 'en' });
	}
}

describe('PageDashboardComponent', () => {
	let component: PageDashboardComponent;
	let fixture: ComponentFixture<PageDashboardComponent>;
	let commonService: CommonService;

	let translate: TranslateService;
	let originalTimeout;
	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [PageDashboardComponent, FormatLocaleDatePipe],
				schemas: [NO_ERRORS_SCHEMA],
				imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
				providers: [
					DashboardService,
					QaService,
					CommonService,
					FormatLocaleDatePipe,
					DeviceService,
					CMSService,
					UPEService,
					SystemUpdateService,
					UserService,
					{ provide: TranslateService, useClass: TranslateServiceStub },
					VantageShellService,
					AndroidService,
					DialogService,
					LoggerService,
					HypothesisService,
					WarrantyService,
					AdPolicyService,
					DccService,
					SelfSelectService,
					FeedbackService,
					LocalInfoService,
					MetricService,
					DevService,
					CommsService,
				],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(PageDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
	});

	it('should create', () => {
		fixture = TestBed.createComponent(PageDashboardComponent);
		component = fixture.componentInstance;
		translate = TestBed.inject(TranslateService);
		commonService = TestBed.inject(CommonService);
		spyOn(component, 'ngOnInit');
		spyOnProperty(translate, 'onLangChange', 'get').and.returnValue(of({ lang: 'fr' }));
		expect(component).toBeTruthy();
	});

	it('should call ngOnDestroy', () => {
		fixture = TestBed.createComponent(PageDashboardComponent);
		component = fixture.componentInstance;
		translate = TestBed.inject(TranslateService);
		commonService = TestBed.inject(CommonService);
		const spy = spyOn(component, 'ngOnDestroy');

		component.ngOnDestroy();
		expect(spy).toHaveBeenCalled();
	});

	afterEach(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});
});
