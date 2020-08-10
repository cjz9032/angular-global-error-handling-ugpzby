import { TestBed, async } from '@angular/core/testing';
import { BuildInContentService } from './build-in-content.service';
import { asyncData, asyncError } from 'src/testing/async-observable-helpers'

describe('BuildInContentService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let service: BuildInContentService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new BuildInContentService(<any>httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the content list', async () => {
    httpClientSpy.get.and.returnValue(asyncData({}));
    await service.getContents({});
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should throw error when get content list', async () => {
    httpClientSpy.get.and.returnValue(asyncError({}));
    await expectAsync(service.getContents({})).toBeRejected();
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');

  });

  it('should return one article when get article by id', async () => {
    httpClientSpy.get.and.returnValue(asyncData({}));
    await service.getArticle('123', 'en');
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should throw error when get article by id', async () => {
    httpClientSpy.get.and.returnValue(asyncError({}));
    await expectAsync(service.getArticle('123', 'en')).toBeRejected();
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });
});
