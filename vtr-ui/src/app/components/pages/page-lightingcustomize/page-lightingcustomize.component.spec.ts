import { NetworkStatus } from './../../../enums/network-status.enum';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { DeviceService } from './../../../services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService } from './../../../services/dashboard/dashboard.service';
import { VantageShellService } from './../../../services/vantage-shell/vantage-shell-mock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CMSService } from './../../../services/cms/cms.service';
import { CommonService } from './../../../services/common/common.service';
import { Title } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Pipe } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PageLightingcustomizeComponent } from './page-lightingcustomize.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Gaming } from './../../../enums/gaming.enum';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GAMING_DATA } from 'src/testing/gaming-data';

describe('PageLightingcustomizeComponent', () => {
	let component: PageLightingcustomizeComponent;
	let fixture: ComponentFixture<PageLightingcustomizeComponent>;
	let commonService: any;
	const routerMock = { params: of({ id: 1 }) };
	const titleServiceMock = { setTitle: (title) => title };
	const deviceServiceMock = {
		getMachineInfo: () => Promise.resolve({ serialnumber: 1234 }),
		getMachineInfoSync: () => {},
	};
	const translateServiceMock = { onLangChange: of('en') };
	const cmsServiceMock = {
		fetchCMSContent: (params) => of(GAMING_DATA.cmsMock),
		getOneCMSContent: (res, template, position) => (res = GAMING_DATA.cmsMock.Results),
	};
	const shellServiceMock = { getMetrics: () => ({ sendAsync: (data) => {} }) };
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				PageLightingcustomizeComponent,
				GAMING_DATA.mockPipe({ name: 'translate' }),
				GAMING_DATA.mockPipe({ name: 'sanitize' }),
				GAMING_DATA.mockPipe({ name: 'htmlText' })
			],
			providers: [
				NgbModal,
				NgbActiveModal,
				{ provide: Title, useValue: titleServiceMock },
				{ provide: CMSService, useValue: cmsServiceMock },
				{ provide: ActivatedRoute, useValue: routerMock },
				{ provide: VantageShellService, useValue: shellServiceMock },
				{ provide: DashboardService, useValue: {} },
				{ provide: TranslateService, useValue: translateServiceMock },
				{ provide: DeviceService, useValue: deviceServiceMock },
				{
					provide: Router,
					useClass: class {
						navigate = jasmine.createSpy('navigate');
					},
				},
				RouterTestingModule,
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
			imports: [HttpClientModule],
		}).compileComponents();
		commonService = TestBed.inject(CommonService);
		commonService.isOnline = false;
		spyOn(commonService, 'getCapabalitiesNotification').and.returnValue(
			of({ type: '[Gaming] GamingCapabilities' })
		);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageLightingcustomizeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('Should send the metrics event', () => {
		const res = component.sendMetricsAsync({});
		expect(res).toBe(undefined);
	});

	it('should go to offline mode', () => {
		const notification: any = { type: NetworkStatus.Offline, payload: { isOnline: false } };
		commonService.isOnline = undefined;
		const res = component.onNotification(notification);
		expect(res).toBe(undefined);
	});
});
