import { NetworkStatus } from './../../../enums/network-status.enum';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DeviceService } from './../../../services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService } from './../../../services/dashboard/dashboard.service';
import { VantageShellService } from './../../../services/vantage-shell/vantage-shell-mock.service';
import { ActivatedRoute } from '@angular/router';
import { CMSService } from './../../../services/cms/cms.service';
import { CommonService } from './../../../services/common/common.service';
import { Title } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Pipe } from '@angular/core';
import { UiLightingProfileComponent } from './../../ui/ui-lighting-profile/ui-lighting-profile.component';
import { ContainerCardComponent } from './../../container-card/container-card.component';
import { PageLayoutComponent } from './../../page-layout/page-layout.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLightingcustomizeComponent } from './page-lightingcustomize.component';
import { WidgetOfflineInfoComponent } from '../../widgets/widget-offline-info/widget-offline-info.component';
const cmsMock = {
	Results: [{
		Id: 'e64d43892d8448d088f3e6037e385122', Title: 'Header Image DCC',
		ShortTitle: '', Description: '',
		FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/DCC_top_image.jpg?v=5cf8a0151ea84c4ca43e906339c3c3b2',
		Action: '', ActionType: null, ActionLink: null, BrandName: '', BrandImage: '',
		Priority: 'P1', Page: null, Template: 'header', Position: null, ExpirationDate: null,
		Filters: { 'DeviceTag.Value': { key: 'System.DccGroup', operator: '==', value: 'true' } }
	},
	{
		Id: '8516ba14dba5412ca954c3ccfdcbff90', Title: 'Default Header Image', ShortTitle: '', Description: '',
		FeatureImage: 'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/Header-Image-Default.jpg?v=5d0bf7fd0065478c977ed284fecac45d', Action: '',
		ActionType: null, ActionLink: null, BrandName: '', BrandImage: '', Priority: 'P2', Page: null,
		Template: 'header', Position: null, ExpirationDate: null, Filters: null
	}], Metadata: { Count: 2 }
};
describe('PageLightingcustomizeComponent', () => {
	let component: PageLightingcustomizeComponent;
	let fixture: ComponentFixture<PageLightingcustomizeComponent>;
	const routerMock = { params: of({ id: 1 }) };
	const titleServiceMock = { setTitle: (title) => title };
	const deviceServiceMock = { getMachineInfo: () => Promise.resolve({ serialnumber: 1234 }), getMachineInfoSync: () => { } };
	const translateServiceMock = { onLangChange: of('en') };
	// tslint:disable-next-line: align
	const commonServiceMock = {
		sendReplayNotification: (action, payload?) => { },
		sendNotification: (...params) => { }, getLocalStorageValue: (key, defaultVal = {}) => JSON.parse(localStorage.getItem(key)),
		notification: of({}), setLocalStorageValue: (key, val) => localStorage.setItem(key, JSON.stringify(val))
	};
	const cmsServiceMock = {
		fetchCMSContent: (params) => of(cmsMock),
		getOneCMSContent: (res, template, position) => {
			return [];
		}
	};
	const shellServiceMock = { getMetrics: () => ({sendAsync: (data) => {}}) };
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				PageLightingcustomizeComponent,
				PageLayoutComponent,
				ContainerCardComponent,
				UiLightingProfileComponent,
				WidgetOfflineInfoComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' }),
				mockPipe({ name: 'htmlText' })],
			providers: [
				{ provide: Title, useValue: titleServiceMock },
				{ provide: CommonService, useValue: commonServiceMock },
				{ provide: CMSService, useValue: cmsServiceMock },
				{ provide: ActivatedRoute, useValue: routerMock },
				{ provide: VantageShellService, useValue: shellServiceMock },
				{ provide: DashboardService, useValue: {} },
				{ provide: TranslateService, useValue: translateServiceMock },
				{ provide: DeviceService, useValue: deviceServiceMock },
				{ provide: HttpClient, useValue: {} }],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageLightingcustomizeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Should send the metrics event', () => {
		const res = component.sendMetricsAsync({});
		expect(res).toBe(undefined);
	});

	it ('should go to ofline mode', () => {
		const notification: any = {type: NetworkStatus.Offline, payload: {isOnline: false}};
		const res = component.onNotification(notification);
		expect(res).toBe(undefined);
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