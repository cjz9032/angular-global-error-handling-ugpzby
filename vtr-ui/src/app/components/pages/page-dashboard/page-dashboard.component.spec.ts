import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDashboardComponent } from './page-dashboard.component';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { QaService } from 'src/app/services/qa/qa.service';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { UPEService } from 'src/app/services/upe/upe.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { UserService } from 'src/app/services/user/user.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { AndroidService } from 'src/app/services/android/android.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { WarrantyService } from 'src/app/services/warranty/warranty.service';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { SelfSelectService } from 'src/app/services/self-select/self-select.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { of } from 'rxjs';
import { DevService } from 'src/app/services/dev/dev.service';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { CommsService } from 'src/app/services/comms/comms.service';

class TranslateServiceStub {
	public onTranslationChange: EventEmitter<any> = new EventEmitter();
	public onDefaultLangChange: EventEmitter<any> = new EventEmitter();
	instant(data: string) { }
	stream(data: string) {
		return of(data);
	}
	get(key: string) {
		return of(key);
	}
	setDefaultLang(lang: string) { }
	use(lang: string) { }
	get onLangChange() {
		return of({ lang: 'en' });
	}
}
/* const fakeActivatedRoute = {
	snapshot: { data: { ... } }
} as ActivatedRoute; */


describe('PageDashboardComponent', () => {
	let component: PageDashboardComponent;
	let fixture: ComponentFixture<PageDashboardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageDashboardComponent, FormatLocaleDatePipe],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [
				DashboardService,
				QaService,
				NgbModalConfig,
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
				/* { provide: ActivatedRoute, useValue: fakeActivatedRoute }, */
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
				CommsService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
