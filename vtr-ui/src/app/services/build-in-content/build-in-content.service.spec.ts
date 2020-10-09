import { TestBed, async } from '@angular/core/testing';
import { BuildInContentService } from './build-in-content.service';
import { asyncData, asyncError } from 'src/testing/async-observable-helpers';
import { NORMAL_CONTENTS, ARTICLE } from 'src/testing/content-data';
import { HttpClient } from '@angular/common/http';

describe('BuildInContentService', () => {
	let httpClientSpy: { get: jasmine.Spy };
	let service: BuildInContentService;
	const queryParam = { Page: 'dashboard', Lang: 'en' };
	beforeEach(() => {
		httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
		service = new BuildInContentService(httpClientSpy as any);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return the content list', async () => {
		httpClientSpy.get.and.returnValue(asyncData(NORMAL_CONTENTS));
		const contents = await service.getContents(queryParam);
		expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
		expect(contents).toEqual(NORMAL_CONTENTS);
	});

	it('should throw error when get content list', async () => {
		httpClientSpy.get.and.returnValue(asyncError(NORMAL_CONTENTS));
		await expectAsync(service.getContents(queryParam)).toBeRejected();
		expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');

	});

	it('should return one article when get article by id', async () => {
		httpClientSpy.get.and.returnValue(asyncData(ARTICLE));
		const article = await service.getArticle('123', 'en');
		expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
		expect(article).toEqual(ARTICLE);
	});

	it('should throw error when get article by id', async () => {
		httpClientSpy.get.and.returnValue(asyncError(ARTICLE));
		await expectAsync(service.getArticle('123', 'en')).toBeRejected();
		expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
	});
});
