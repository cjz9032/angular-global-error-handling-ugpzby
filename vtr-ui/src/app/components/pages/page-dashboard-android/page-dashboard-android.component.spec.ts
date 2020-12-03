import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AndroidService } from 'src/app/services/android/android.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from 'src/app/services/common/common.service';
import { CommsService } from 'src/app/services/comms/comms.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MockService } from 'src/app/services/mock/mock.service';
import { QaService } from 'src/app/services/qa/qa.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { UserService } from 'src/app/services/user/user.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { PageDashboardAndroidComponent } from './page-dashboard-android.component';

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

describe('PageDashboardAndroidComponent', () => {
	let component: PageDashboardAndroidComponent;
	let fixture: ComponentFixture<PageDashboardAndroidComponent>;
	let deviceService: DeviceService;
	let cmsService: CMSService;
	let configService: ConfigService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PageDashboardAndroidComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
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
				CommsService,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageDashboardAndroidComponent);
		deviceService = TestBed.inject(DeviceService);
		cmsService = TestBed.inject(CMSService);
		configService = TestBed.inject(ConfigService);
		component = fixture.componentInstance;
		(deviceService as any).isGaming = false;
		(configService as any).isGaming = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	/* it('should call fetchCmsContents', () => {

		const comp = (component as any);
		// const spy = spyOn(comp, 'fetchCmsContents').and.callThrough();
		const spyGetOneCMSContent = spyOn(cmsService, 'fetchCMSContent');
		comp.fetchCmsContents();
		// expect(spy).toHaveBeenCalled();

		expect(spyGetOneCMSContent).toHaveBeenCalled();
	}); */
});
