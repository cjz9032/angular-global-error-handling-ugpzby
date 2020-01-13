import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { HtmlTextPipe } from 'src/app/pipe/html-text/html-text.pipe';
import { PageLayoutComponent } from './../../page-layout/page-layout.component';
import { ContainerCardComponent } from './../../container-card/container-card.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable, Subject, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { DeviceService } from './../../../services/device/device.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HypothesisService } from './../../../services/hypothesis/hypothesis.service';
import { LoggerService } from './../../../services/logger/logger.service';
import { UPEService } from './../../../services/upe/upe.service';
import { MacrokeyService } from './../../../services/gaming/macrokey/macrokey.service';
import { VantageShellService } from './../../../services/vantage-shell/vantage-shell.service';
import { DashboardService } from './../../../services/dashboard/dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';

import { PageMacrokeyComponent } from './page-macrokey.component';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';

describe('PageMacrokeyComponent', () => {
	let component: PageMacrokeyComponent;
	let fixture: ComponentFixture<PageMacrokeyComponent>;
	const mockShellService = { getMetrics: () => 0, getSelfSelect: () => 0, getVantageStub: () => 0, getSystemUpdate: () => 0, calcDeviceFilter: () => 0 };
	const mockTitleService = { setTitle: function setTitle() { return 'hii'; } };
	const onLangChange: Observable<any> = new Subject();
	const cmsContent = {
		Results: [{
			Id: 'e64d43892d8448d088f3e6037e385122',
			Title: 'Header Image DCC', ShortTitle: '', Description: '',
			FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/DCC_top_image.jpg?v=5cf8a0151ea84c4ca43e906339c3c3b2',
			Action: '', ActionType: null, ActionLink: null, BrandName: '', BrandImage: '',
			Priority: 'P1', Page: null, Template: 'header', Position: null, ExpirationDate: null,
			Filters: { 'DeviceTag.Value': { key: 'System.DccGroup', operator: '==', value: 'true' } }
		},
		{
			Id: '8516ba14dba5412ca954c3ccfdcbff90', Title: 'Default Header Image', ShortTitle: '',
			Description: '', FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/Header-Image-Default.jpg?v=5d0bf7fd0065478c977ed284fecac45d',
			Action: '', ActionType: null, ActionLink: null, BrandName: '', BrandImage: '',
			Priority: 'P2', Page: null, Template: 'header', Position: null, ExpirationDate: null,
			Filters: null
		}], Metadata: { Count: 2 }
	};
	const mockTranslateService = { onLangChange };
	const notif = new AppNotification(NetworkStatus.Offline, 'true');
	const commonServiceMock = { getLocalStorageValue: (key) => localStorage.getItem(key), setLocalStorageValue: () => 0, sendNotification: () => of(notif), sendReplayNotification: () => 0, notification: new Observable<AppNotification>() };
	const cmsMockService = {
		fetchCMSContent: (test: any) => of(cmsContent),
		getOneCMSContent: () => 0
	};
	beforeEach(fakeAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PageMacrokeyComponent,
				ContainerCardComponent,
				PageLayoutComponent,
				HtmlTextPipe,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [HttpClientModule],
			providers: [
				{ provide: DashboardService, useValue: {} },
				{ provide: VantageShellService, useValue: mockShellService },
				{ provide: MacrokeyService, useValue: {} },
				{ provide: CommonService, useValue: commonServiceMock },
				{ provide: UPEService, useValue: {} },
				{ provide: LoggerService, useValue: {} },
				{ provide: HypothesisService, useValue: {} },
				{ provide: TranslateService, useValue: mockTranslateService },
				{ provide: DeviceService, useValue: { isGaming: true, getMachineInfoSync: () => { }, getMachineInfo: () => Promise.resolve() } },
				{ provide: Title, useValue: mockTitleService },
				{ provide: CMSService, useValue: cmsMockService }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(PageMacrokeyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.cardContentPositionF = { Id: 1, FeatureImage: 'TEST' };
		component.cardContentPositionC = { Id: 1, FeatureImage: 'TEST' };
		tick(10);
		fixture.detectChanges();
	}
	));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}
