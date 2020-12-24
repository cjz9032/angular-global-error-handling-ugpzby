import { TestBed, waitForAsync } from '@angular/core/testing';

import { ContentActionType } from 'src/app/enums/content.enum';
import { ContentCacheService } from './content-cache.service';
import { MockContentLocalCacheTest } from '../../services/content-cache/mock/content-cache.mock.data';

import { asyncData, asyncError } from 'src/testing/async-observable-helpers';
import {
	CMS_CONTENTS,
	UPE_CONTENTS,
	NORMAL_CONTENTS,
	EXPIRED_DATE_INPOISTIONB,
	DISPALY_DATE_INPOISTIONB,
	MULITI_ITEM_INPOISTIONB,
	WELCOME_TEXT_CONTENTS,
	ARTICLE,
	DYNAMIC_OVERLAY_THEME,
} from 'src/testing/content-data';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';

describe('ContentCacheService', () => {
	let service: ContentCacheService;
	let vantageShellService: { getContentLocalCache: jasmine.Spy };
	let localInfoService: { getLocalInfo: jasmine.Spy };
	let cmsService: {
		generateContentQueryParams: jasmine.Spy;
		getLocalinfo: jasmine.Spy;
		fetchCMSArticle: jasmine.Spy;
		fetchContents: jasmine.Spy;
		getOneCMSContent: jasmine.Spy;
	};
	let upeService: { fetchUPEContent: jasmine.Spy };
	let buildInContentService: { getArticle: jasmine.Spy; getContents: jasmine.Spy };
	let logger: { error: jasmine.Spy };
	let metrics: { sendMetrics: jasmine.Spy };

	let mockTestObject: MockContentLocalCacheTest;
	const localInfo = {
		Brand: 'think',
		GEO: 'en',
		Lang: 'en',
		OEM: 'LENOVO',
		OS: 'Windows',
		Segment: 'Consumer',
	};

	beforeEach(() => {
		logger = jasmine.createSpyObj('LoggerService', ['error']);

		localInfoService = jasmine.createSpyObj('LocalInfoService', ['getLocalInfo']);

		cmsService = jasmine.createSpyObj('CMSService', [
			'generateContentQueryParams',
			'getLocalinfo',
			'fetchCMSArticle',
			'fetchContents',
			'getOneCMSContent',
		]);

		upeService = jasmine.createSpyObj('UPEService', ['fetchUPEContent']);

		buildInContentService = jasmine.createSpyObj('BuildInContentService', [
			'getArticle',
			'getContents',
		]);

		vantageShellService = jasmine.createSpyObj('VantageShellService', ['getContentLocalCache']);

		metrics = jasmine.createSpyObj('MetricService', ['sendMetrics']);

		TestBed.configureTestingModule({});

		mockTestObject = new MockContentLocalCacheTest();
		vantageShellService.getContentLocalCache.and.returnValue(mockTestObject);

		service = new ContentCacheService(
			vantageShellService as any,
			localInfoService as any,
			cmsService as any,
			upeService as any,
			buildInContentService as any,
			logger as any,
			metrics as any
		);
	});

	it('when none contents in cache enviroment should return build-in, then download and cache the contents by fetch', async () => {
		const contentCards = {
			positionA: {
				displayContent: [],
				template: 'home-page-hero-banner',
				cardId: 'positionA',
				positionParam: 'position-A',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionB: {
				displayContent: new FeatureContent(),
				template: 'half-width-title-description-link-image',
				cardId: 'positionB',
				positionParam: 'position-B',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionC: {
				displayContent: new FeatureContent(),
				template: 'half-width-title-description-link-image',
				cardId: 'positionC',
				positionParam: 'position-C',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionD: {
				displayContent: new FeatureContent(),
				template: 'full-width-title-image-background',
				cardId: 'positionD',
				positionParam: 'position-D',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionE: {
				displayContent: new FeatureContent(),
				template: 'half-width-top-image-title-link',
				cardId: 'positionE',
				positionParam: 'position-E',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionF: {
				displayContent: new FeatureContent(),
				template: 'half-width-top-image-title-link',
				cardId: 'positionF',
				positionParam: 'position-F',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
		};
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'noResponse' });
		cmsService.fetchContents.and.returnValue(CMS_CONTENTS);
		cmsService.getOneCMSContent.and.returnValue(CMS_CONTENTS);
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		localInfoService.getLocalInfo.and.returnValue(localInfo);
		const contents = JSON.parse(JSON.stringify(NORMAL_CONTENTS));
		buildInContentService.getContents.and.returnValue(contents);
		const ret = await service.getCachedContents('noResponse', contentCards, true);
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(3);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('welcome-text')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return build-in content when get cached contents', async () => {
		cmsService.generateContentQueryParams.and.returnValue({
			Page: 'noOnlineContent',
			Lang: 'en',
		});
		const contents = JSON.parse(JSON.stringify(NORMAL_CONTENTS));
		buildInContentService.getContents.and.returnValue(contents);
		const ret = await service.getCachedContents('noOnlineContent', null, true);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(3);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('welcome-text')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();

		const ret2 = await service.getCachedContents('noOnlineContent', null, true);
		expect(ret2).toBeTruthy();
		expect(ret2).toEqual(ret);
	});

	it('should return normal cache data.', async () => {
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'normalContents' });
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		const ret = await service.getCachedContents('normalContents', null, true);

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
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		const ret = await service.getCachedContents('expiredDateWithPoistionB', null, true);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(2);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
		const positionA = 'positionA';
		expect(ret[positionA].length).toEqual(2);
		const positionB = 'positionB';
		expect(ret[positionB]).toEqual(undefined);
	});

	it('should not return item that cannot be displayed.', async () => {
		cmsService.generateContentQueryParams.and.returnValue({
			Page: 'NotReachDisplayDateWithPoistionB',
		});
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		const ret = await service.getCachedContents('NotReachDisplayDateWithPoistionB', null, true);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(2);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
		const positionA = 'positionA';
		expect(ret[positionA].length).toEqual(2);
		const positionB = 'positionB';
		expect(ret[positionB]).toEqual(undefined);
	});

	it('should return one item if PositionB has lots of valid items.', async () => {
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'multi-ItemsInPoistionB' });
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		const ret = await service.getCachedContents('multi-ItemsInPoistionB', null, true);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(2);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
		const positionA = 'positionA';
		expect(ret[positionA].length).toEqual(2);
		const positionB = 'positionB';
		expect(ret[positionB].Title).toEqual('Build-in article B');
	});

	it('should not change the field DataSource.', async () => {
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'testDataResource' });
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		const ret = await service.getCachedContents('testDataResource', null, true);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys.length).toEqual(2);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
		const positionA = 'positionA';
		ret[positionA].forEach((content) => {
			if (content.Title === 'Build-in article A1') {
				expect(content.DataSource).toEqual('cms');
			}
			if (content.Title === 'Build-in article A2') {
				expect(content.DataSource).toEqual('upe');
			}
		});
		const positionB = 'positionB';
		expect(ret[positionB].DataSource).toEqual('upe');
	});

	it('save contentList only from cms', async () => {
		const contentCards = {
			positionA: {
				displayContent: [],
				template: 'home-page-hero-banner',
				cardId: 'positionA',
				positionParam: 'position-A',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionB: {
				displayContent: new FeatureContent(),
				template: 'half-width-title-description-link-image',
				cardId: 'positionB',
				positionParam: 'position-B',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionC: {
				displayContent: new FeatureContent(),
				template: 'half-width-title-description-link-image',
				cardId: 'positionC',
				positionParam: 'position-C',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionD: {
				displayContent: new FeatureContent(),
				template: 'full-width-title-image-background',
				cardId: 'positionD',
				positionParam: 'position-D',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionE: {
				displayContent: new FeatureContent(),
				template: 'half-width-top-image-title-link',
				cardId: 'positionE',
				positionParam: 'position-E',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionF: {
				displayContent: new FeatureContent(),
				template: 'half-width-top-image-title-link',
				cardId: 'positionF',
				positionParam: 'position-F',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
		};
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'dashboard_only_cms' });
		cmsService.fetchContents.and.returnValue(CMS_CONTENTS);
		cmsService.getOneCMSContent.and.returnValue(CMS_CONTENTS);
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		localInfoService.getLocalInfo.and.returnValue(localInfo);
		const ret = await service.getCachedContents('dashboard_only_cms', contentCards, true);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(3);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
		expect(keys.includes('positionC')).toBeTruthy();
		const positionA = 'positionA';
		expect(ret[positionA].length).toEqual(2);
		const positionB = 'positionB';
		expect(ret[positionB].Title).toEqual('CMS Content');
		const positionC = 'positionC';
		expect(ret[positionC].Title).toEqual(
			'Smarter Data Helps Farmers Rapidly Adapt to Climate Change'
		);
	});

	it('save contentList only from upe', async () => {
		const contentCards = {
			positionA: {
				displayContent: [],
				template: 'home-page-hero-banner',
				cardId: 'positionA',
				positionParam: 'position-A',
				tileSource: 'UPE',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionB: {
				displayContent: new FeatureContent(),
				template: 'half-width-title-description-link-image',
				cardId: 'positionB',
				positionParam: 'position-B',
				tileSource: 'UPE',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionC: {
				displayContent: new FeatureContent(),
				template: 'half-width-title-description-link-image',
				cardId: 'positionC',
				positionParam: 'position-C',
				tileSource: 'UPE',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionD: {
				displayContent: new FeatureContent(),
				template: 'full-width-title-image-background',
				cardId: 'positionD',
				positionParam: 'position-D',
				tileSource: 'UPE',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionE: {
				displayContent: new FeatureContent(),
				template: 'half-width-top-image-title-link',
				cardId: 'positionE',
				positionParam: 'position-E',
				tileSource: 'UPE',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionF: {
				displayContent: new FeatureContent(),
				template: 'half-width-top-image-title-link',
				cardId: 'positionF',
				positionParam: 'position-F',
				tileSource: 'UPE',
				cmsContent: undefined,
				upeContent: undefined,
			},
		};
		cmsService.getOneCMSContent.and.returnValue(null);
		upeService.fetchUPEContent.and.returnValue(UPE_CONTENTS);
		cmsService.fetchContents.and.returnValue(null);
		localInfoService.getLocalInfo.and.returnValue(localInfo);
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'dashboard_only_upe' });
		const ret = await service.getCachedContents('dashboard_only_upe', contentCards, true);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(3);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
		expect(keys.includes('positionC')).toBeTruthy();
		const positionA = 'positionA';
		expect(ret[positionA].length).toEqual(2);
		const positionB = 'positionB';
		expect(ret[positionB].Title).toEqual('UPE Content');
		const positionC = 'positionC';
		expect(ret[positionC].Title).toEqual(
			'Smarter Data Helps Farmers Rapidly Adapt to Climate Change'
		);
	});

	it('save contentList from upe and cms', async () => {
		const contentCards = {
			positionA: {
				displayContent: [],
				template: 'home-page-hero-banner',
				cardId: 'positionA',
				positionParam: 'position-A',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionB: {
				displayContent: new FeatureContent(),
				template: 'half-width-title-description-link-image',
				cardId: 'positionB',
				positionParam: 'position-B',
				tileSource: 'UPE',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionC: {
				displayContent: new FeatureContent(),
				template: 'half-width-title-description-link-image',
				cardId: 'positionC',
				positionParam: 'position-C',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionD: {
				displayContent: new FeatureContent(),
				template: 'full-width-title-image-background',
				cardId: 'positionD',
				positionParam: 'position-D',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionE: {
				displayContent: new FeatureContent(),
				template: 'half-width-top-image-title-link',
				cardId: 'positionE',
				positionParam: 'position-E',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionF: {
				displayContent: new FeatureContent(),
				template: 'half-width-top-image-title-link',
				cardId: 'positionF',
				positionParam: 'position-F',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
		};
		cmsService.getOneCMSContent.and.returnValue(CMS_CONTENTS);
		upeService.fetchUPEContent.and.returnValue(UPE_CONTENTS);
		cmsService.fetchContents.and.returnValue(CMS_CONTENTS);
		localInfoService.getLocalInfo.and.returnValue(localInfo);
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'dashboard' });
		const ret = await service.getCachedContents('dashboard', contentCards, true);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(3);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
		expect(keys.includes('positionC')).toBeTruthy();
		const positionA = 'positionA';
		expect(ret[positionA].length).toEqual(2);
		const positionB = 'positionB';
		expect(ret[positionB].Title).toEqual(
			'Lenovo Tech World &#8211; The New Era of Data Intelligence Decoded'
		);
		const positionC = 'positionC';
		expect(ret[positionC].Title).toEqual(
			'Smarter Data Helps Farmers Rapidly Adapt to Climate Change'
		);
	});

	it('save contentList that segment is commercial', async () => {
		const contentCards = {
			positionA: {
				displayContent: [],
				template: 'home-page-hero-banner',
				cardId: 'positionA',
				positionParam: 'position-A',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionB: {
				displayContent: new FeatureContent(),
				template: 'half-width-title-description-link-image',
				cardId: 'positionB',
				positionParam: 'position-B',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionC: {
				displayContent: new FeatureContent(),
				template: 'half-width-title-description-link-image',
				cardId: 'positionC',
				positionParam: 'position-C',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionD: {
				displayContent: new FeatureContent(),
				template: 'full-width-title-image-background',
				cardId: 'positionD',
				positionParam: 'position-D',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionE: {
				displayContent: new FeatureContent(),
				template: 'half-width-top-image-title-link',
				cardId: 'positionE',
				positionParam: 'position-E',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
			positionF: {
				displayContent: new FeatureContent(),
				template: 'half-width-top-image-title-link',
				cardId: 'positionF',
				positionParam: 'position-F',
				tileSource: 'CMS',
				cmsContent: undefined,
				upeContent: undefined,
			},
		};
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'dashboard_only_cms' });
		cmsService.fetchContents.and.returnValue(CMS_CONTENTS);
		cmsService.getOneCMSContent.and.returnValue(CMS_CONTENTS);
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		const currentLocalInfo = {
			Brand: 'think',
			GEO: 'en',
			Lang: 'en',
			OEM: 'LENOVO',
			OS: 'Windows',
			Segment: 'Commercial',
		};
		localInfoService.getLocalInfo.and.returnValue(currentLocalInfo);
		const ret = await service.getCachedContents('dashboard_only_upe', contentCards, true);

		expect(ret).toBeTruthy();
		const keys = Object.keys(ret);
		expect(keys).toBeTruthy();
		expect(keys.length).toEqual(3);
		expect(keys.includes('positionA')).toBeTruthy();
		expect(keys.includes('positionB')).toBeTruthy();
		expect(keys.includes('positionC')).toBeTruthy();
		const positionA = 'positionA';
		expect(ret[positionA].length).toEqual(2);
		const positionB = 'positionB';
		expect(ret[positionB].Title).toEqual('CMS Content');
		const positionC = 'positionC';
		expect(ret[positionC].Title).toEqual(
			'Smarter Data Helps Farmers Rapidly Adapt to Climate Change'
		);
	});

	it('should throw exception when fetch contents from upe and cms', async () => {
		const contentCards = {
			positionB: {
				displayContent: new FeatureContent(),
				template: 'half-width-title-description-link-image',
				cardId: 'positionB',
				positionParam: 'position-B',
				tileSource: 'UPE',
				cmsContent: undefined,
				upeContent: undefined,
			},
		};

		upeService.fetchUPEContent.and.throwError('upe error');
		cmsService.fetchContents.and.throwError('upe error');
		localInfoService.getLocalInfo.and.returnValue(localInfo);
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'dashboard' });
		await service.getCachedContents('dashboard', contentCards, true);
		expect(logger.error).toHaveBeenCalledTimes(2);
	});

	it('should return the build-in article when get article by id', async () => {
		cmsService.getLocalinfo.and.returnValue(localInfo);
		buildInContentService.getArticle.and.returnValue(ARTICLE);
		const ret = await service.getArticleById(ContentActionType.BuildIn, '11111');
		expect(ret).toEqual(ARTICLE);
		expect(buildInContentService.getArticle).toHaveBeenCalledTimes(1);
	});

	it('should return the online article when get article by id', async () => {
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'normalContents' });
		await service.getCachedContents('normalContents', null, true);
		cmsService.getLocalinfo.and.returnValue(localInfo);
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		const ret = await service.getArticleById(ContentActionType.Internal, '11111');
		expect(ret).toEqual(ARTICLE);
	});

	it('should return the cached article when get article by id', async () => {
		cmsService.getLocalinfo.and.returnValue(localInfo);
		const ret = await service.getArticleById(ContentActionType.Internal, 'cached_article');
		expect(ret).toEqual(ARTICLE);
		expect(cmsService.fetchCMSArticle).toHaveBeenCalledTimes(0);
	});

	it('should return the online article and save when get article by id', async () => {
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'normalContents' });
		await service.getCachedContents('normalContents', null, true);
		cmsService.getLocalinfo.and.returnValue(localInfo);
		cmsService.fetchCMSArticle.and.returnValue(ARTICLE);
		const ret = await service.getArticleById(
			ContentActionType.Internal,
			'13cada49d4274587a80e26b00dff59a4'
		);
		expect(ret).toEqual(ARTICLE);
	});

	it('should send metrics when get cached contents', async () => {
		cmsService.generateContentQueryParams.and.returnValue({ Page: 'normalContents' });
		await service.getCachedContents('normalContents', null, true);
		expect(metrics.sendMetrics).toHaveBeenCalledTimes(1);
		expect(metrics.sendMetrics.calls.allArgs().length).toBe(1, 'one call');
	});

	it('should replace static OverlayTheme', async () => {
		let ccService: { loadCachedContents: jasmine.Spy; getCachedOnlineContents: jasmine.Spy };
		ccService = jasmine.createSpyObj('ContentCacheService', [
			'loadCachedContents',
			'getCachedOnlineContents',
		]);
		ccService.getCachedOnlineContents.and.returnValue(DYNAMIC_OVERLAY_THEME);

		const content = ccService.loadCachedContents(DYNAMIC_OVERLAY_THEME);
		expect(content.positionA[0].OverlayTheme).toEqual('dark');
		expect(content.positionB.OverlayTheme).toEqual('dark');
	});
});
