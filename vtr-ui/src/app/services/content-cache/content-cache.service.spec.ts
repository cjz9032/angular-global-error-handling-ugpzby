import { TestBed } from '@angular/core/testing';

import { ContentCacheService } from './content-cache.service';
import { MockContentLocalCacheTest } from '../../services/content-cache/content-cache.mock.data';

import { asyncData, asyncError } from 'src/testing/async-observable-helpers'
import { NORMAL_CONTENTS, EXPIRED_DATE_INPOISTIONB, DISPALY_DATE_INPOISTIONB, MULITI_ITEM_INPOISTIONB } from 'src/testing/content-data';

describe('ContentCacheService', () => {
	let service: ContentCacheService;
	let vantageShellService: { getContentLocalCache: jasmine.Spy };
	let localInfoService: { getLocalInfo: jasmine.Spy };
	let cmsService: { generateContentQueryParams: jasmine.Spy };
	let upeService: { fetchUPEContent: jasmine.Spy };
	let buildInContentService: { getArticle: jasmine.Spy, getContents: jasmine.Spy };
	let logger: { error: jasmine.Spy };
	let mockTestObject: MockContentLocalCacheTest;

	beforeEach(() => {
		logger = jasmine.createSpyObj('LoggerService',
			['error']);

		localInfoService = jasmine.createSpyObj('LocalInfoService',
			['getLocalInfo']);

		cmsService = jasmine.createSpyObj('CMSService',
			['generateContentQueryParams', 'getLocalinfo', 'fetchCMSArticle']);

		upeService = jasmine.createSpyObj('UPEService',
			['fetchUPEContent']);

		buildInContentService = jasmine.createSpyObj('BuildInContentService',
			['getArticle', 'getContents']);

		vantageShellService = jasmine.createSpyObj('VantageShellService',
			['getContentLocalCache']);

		TestBed.configureTestingModule({
		});

		mockTestObject = new MockContentLocalCacheTest();
		vantageShellService.getContentLocalCache.and.returnValue(mockTestObject);

		service = new ContentCacheService(<any>vantageShellService,
			<any>localInfoService,
			<any>cmsService,
			<any>upeService,
			<any>buildInContentService,
			<any>logger);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return build-in content when get cached contents', async () => {
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'noOnlineContent', Lang: 'en' });
		let contents = JSON.parse(JSON.stringify(NORMAL_CONTENTS));
		buildInContentService.getContents.and.returnValue(contents);
		const ret = await service.getCachedContents('noOnlineContent', null);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(3);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('welcome-text')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();

		
		const ret2 = await service.getCachedContents('noOnlineContent', null);
		expect(ret2).toBeTruthy();
		expect(ret2).toEqual(ret);
	});

	it('should return normal cache data.', async () => {
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'normalContents' });
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
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'expiredDateWithPoistionB' });
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
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'NotReachDisplayDateWithPoistionB' });
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
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'multi-ItemsInPoistionB' });
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
