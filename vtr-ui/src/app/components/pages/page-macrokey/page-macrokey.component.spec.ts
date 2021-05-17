import { Title } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@lenovo/material/dialog';

import { DeviceService } from './../../../services/device/device.service';
import { DashboardService } from './../../../services/dashboard/dashboard.service';
import { VantageShellService } from './../../../services/vantage-shell/vantage-shell-mock.service';
import { CMSService } from './../../../services/cms/cms.service';
import { CommonService } from './../../../services/common/common.service';

import { PageMacrokeyComponent } from './page-macrokey.component';
import { NetworkStatus } from './../../../enums/network-status.enum';
import { GAMING_DATA } from './../../../../testing/gaming-data';

describe('PageMacrokeyComponent', () => {
	let component: PageMacrokeyComponent;
	let fixture: ComponentFixture<PageMacrokeyComponent>;
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
	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					PageMacrokeyComponent,
					GAMING_DATA.mockPipe({ name: 'translate' }),
					GAMING_DATA.mockPipe({ name: 'sanitize' }),
					GAMING_DATA.mockPipe({ name: 'htmlText' }),
				],
				providers: [
					MatDialog,
					MatDialogRef,
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
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(PageMacrokeyComponent);
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
