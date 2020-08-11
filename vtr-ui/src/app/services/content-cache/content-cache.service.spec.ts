import {TestBed} from '@angular/core/testing';

import {ContentCacheService} from './content-cache.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {DevService} from '../dev/dev.service';
import {VantageShellService} from '../vantage-shell/vantage-shell.service';
import {CommonService} from '../common/common.service';
import {LoggerService} from '../logger/logger.service';
import {CommsService} from '../comms/comms.service';
import {LocalInfoService} from '../local-info/local-info.service';
import {CMSService} from '../cms/cms.service';
import {UPEService} from '../upe/upe.service';
import {BuildInContentService} from '../build-in-content/build-in-content.service';
import {MockContentLocalCacheTest} from '../../services/content-cache/content-cache.mock.data';
import {SelfSelectService} from '../self-select/self-select.service';
import {HypothesisService} from '../hypothesis/hypothesis.service';
import {DashboardService} from '../dashboard/dashboard.service';


describe('ContentCacheService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		schemas: [NO_ERRORS_SCHEMA],
		imports: [HttpClientModule],
		providers: [ContentCacheService, CommsService, VantageShellService,
			LocalInfoService, CommonService, DevService, CMSService, UPEService,
			BuildInContentService, LoggerService, HttpClient, SelfSelectService, HypothesisService,DashboardService]
	}));

	let service: ContentCacheService;
	let commsService: CommsService;
	let vantageShellService: { getContentLocalCache: jasmine.Spy };
	let localInfoService: LocalInfoService;
	let commonService: CommonService;
	let devService: DevService;
	let cmsService: { generateContentQueryParams: jasmine.Spy };
	let upeService: UPEService;
	let buildInContentService: BuildInContentService;
	let logger: LoggerService;
	let selfselectService: SelfSelectService;
	let hypService: HypothesisService;
	let dashboardService: DashboardService;
	let http: HttpClient;
	let mockTestObject: MockContentLocalCacheTest;

	beforeEach(() => {
		commonService = jasmine.createSpyObj('CommonService',
			['']);
		logger = jasmine.createSpyObj('LoggerService',
			['']);
		devService = jasmine.createSpyObj('DevService',
			['']);
		commsService = jasmine.createSpyObj('CommsService',
			['']);
		localInfoService = jasmine.createSpyObj('LocalInfoService',
			['']);
		cmsService = jasmine.createSpyObj('CMSService',
			['generateContentQueryParams', 'getLocalinfo', 'fetchCMSArticle']);
		upeService = jasmine.createSpyObj('UPEService',
			['']);
		buildInContentService = jasmine.createSpyObj('BuildInContentService',
			['getArticle', 'getContents']);
		vantageShellService = jasmine.createSpyObj('VantageShellService',
			['getContentLocalCache']);

		hypService = jasmine.createSpyObj('HypothesisService',
			['']);
		selfselectService = jasmine.createSpyObj('SelfSelectService',
			['']);
		dashboardService = jasmine.createSpyObj('DashboardService',
			['']);

		mockTestObject = new MockContentLocalCacheTest();
		vantageShellService.getContentLocalCache.and.returnValue(mockTestObject);

		service = new ContentCacheService(commsService,
			<any> vantageShellService,
			localInfoService,
			commonService,
			devService,
			http,
			<any> cmsService,
			upeService,
			buildInContentService,
			logger,
			selfselectService,
			hypService,
			dashboardService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return normal cache data.', async () => {
		cmsService.generateContentQueryParams.and.returnValue({PAGE: 'normalContents'});
		const ret = await service.getCachedContents('normalContents', null);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(3);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('welcome-text')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
	});

	it('should not return expired cache data.', async () => {
		cmsService.generateContentQueryParams.and.returnValue({PAGE: 'expiredDateWithPoistionB'});
		const ret = await service.getCachedContents('expiredDateWithPoistionB', null);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(2);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
		expect(ret['positionA'].length).toEqual(2);
		expect(ret['positionB']).toEqual(undefined);
	});

	it('should not return item that cannot be displayed.', async () => {
		cmsService.generateContentQueryParams.and.returnValue({PAGE: 'NotReachDisplayDateWithPoistionB'});
		const ret = await service.getCachedContents('NotReachDisplayDateWithPoistionB', null);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(2);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
		expect(ret['positionA'].length).toEqual(2);
		expect(ret['positionB']).toEqual(undefined);
	});

	it('should return one item if PositionB has lots of valid items.', async () => {
		cmsService.generateContentQueryParams.and.returnValue({PAGE: 'multi-ItemsInPoistionB'});
		const ret = await service.getCachedContents('multi-ItemsInPoistionB', null);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(2);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
		expect(ret['positionA'].length).toEqual(2);
		expect(ret['positionB'].Title).toEqual('Build-in article B');
	});
});
