import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDashboardAndroidComponent } from './page-dashboard-android.component';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { MockService } from 'src/app/services/mock/mock.service';
import { QaService } from 'src/app/services/qa/qa.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { UserService } from 'src/app/services/user/user.service';
import { of } from 'rxjs';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { AndroidService } from 'src/app/services/android/android.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { DevService } from 'src/app/services/dev/dev.service';
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
describe('PageDashboardAndroidComponent', () => {
	let component: PageDashboardAndroidComponent;
	let fixture: ComponentFixture<PageDashboardAndroidComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageDashboardAndroidComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [
				DashboardService,
				MockService,
				QaService,
				NgbModal,
				NgbModalConfig,
				CommonService,
				ConfigService,
				DeviceService,
				CMSService,
				SystemUpdateService,
				UserService,
				{ provide: TranslateService, useClass: TranslateServiceStub },
				VantageShellService,
				AndroidService,
				DomSanitizer,
				LoggerService,
				DevService,
				CommsService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageDashboardAndroidComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
