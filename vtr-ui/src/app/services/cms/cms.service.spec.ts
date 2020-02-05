import { async, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { Observable } from 'rxjs/internal/Observable';

import { CMSService } from "./cms.service";
import { CommsService } from "../comms/comms.service";
import { DevService } from "../dev/dev.service";
import { VantageShellService } from "../vantage-shell/vantage-shell.service";
import { LocalInfoService } from "../local-info/local-info.service";
import { LoggerService } from '../logger/logger.service';
import { CommonService } from '../common/common.service';
import { SegmentConst } from '../self-select/self-select.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { of } from 'rxjs';

describe("CMSService", () => {
	let service: CMSService;
	let shellservice: VantageShellService;
	let localInfoService: LocalInfoService;
	let devService: DevService;
	let logger: LoggerService;
	let commService: CommsService;
	let commonService: CommonService

	beforeEach(async(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [
				VantageShellService,
				CommsService,
				DevService,
				LocalInfoService,
				LoggerService,
				CommonService
			]
		}))
	);

	it("should be created", async(() => {
		service = TestBed.get(CMSService)
		expect(service).toBeTruthy();
	}));

	it('should call deviceFilter when filter is empty', async(() => {
		const filter = undefined
		service = TestBed.get(CMSService)
		shellservice = TestBed.get(VantageShellService)
		let spy = spyOn(shellservice, 'deviceFilter')
		service.deviceFilter(filter)
		expect(spy).not.toHaveBeenCalled()
	}))

	it('should call deviceFilter when filter not empty', async(() => {
		const filter = {}
		service = TestBed.get(CMSService)
		shellservice = TestBed.get(VantageShellService)
		let spy = spyOn(shellservice, 'deviceFilter').and.returnValue(Promise.resolve(true))
		service.deviceFilter(filter)
		expect(spy).toHaveBeenCalled()
	}))

	it('should call deviceFilter when filter not empty and error', async(() => {
		const filter = {}
		service = TestBed.get(CMSService)
		shellservice = TestBed.get(VantageShellService)
		let spy = spyOn(shellservice, 'deviceFilter').and.returnValue(Promise.reject(true))
		service.deviceFilter(filter)
		expect(spy).toHaveBeenCalled()
	}))

	it('should call filterCMSContent', async(() => {
		const results = [{Filter: 'some'}]
		service = TestBed.get(CMSService)
		const spy = spyOn(service, 'deviceFilter')
		service['filterCMSContent'](results)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSContent', async(() => {
		service = TestBed.get(CMSService)
		localInfoService = TestBed.get(LocalInfoService)
		const queryParams = {queryParams: {filter: 'ababab'}}
		service.localInfo = undefined
		let spy = spyOn(localInfoService, 'getLocalInfo').and.returnValue(Promise.resolve(true))
		service.fetchCMSContent(queryParams).subscribe({
			complete() {}
		})
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSContent - catch block', async(() => {
		service = TestBed.get(CMSService)
		localInfoService = TestBed.get(LocalInfoService)
		const queryParams = {queryParams: {filter: 'ababab'}}
		service.localInfo = undefined
		let spy = spyOn(localInfoService, 'getLocalInfo').and.returnValue(Promise.reject(true))
		service.fetchCMSContent(queryParams).subscribe({
			complete() {}
		})
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSContent - else', async(() => {
		service = TestBed.get(CMSService)
		service.localInfo = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: SegmentConst.Consumer,
			Brand: 'Lenovo',
		}
		const queryParams = {queryParams: {filter: 'ababab'}}
		const spy = spyOn(service, 'requestCMSContent')
		service.fetchCMSContent(queryParams)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call requestCMSContent - else case', async(() => {
		const locInfo = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: SegmentConst.Consumer,
			Brand: 'Lenovo',
		}
		// const notification: AppNotification = ({
		// 	type: NetworkStatus.Online
		// })
		const queryParams = {queryParams: {filter: 'ababab'}}
		service = TestBed.get(CMSService)
		commonService = TestBed.get(CommonService);
		commonService.isOnline = false;
		const spy = spyOn(service, 'getCMSContent')
		service.requestCMSContent(queryParams, locInfo).subscribe({
			complete() {}
		})
		expect(spy).not.toHaveBeenCalled()		
	}));

	it('should call fetchCMSArticleCategories', async(() => {
		const results = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: SegmentConst.Consumer,
			Brand: 'Lenovo',
		}
		const queryParams = {queryParams: {filter: 'ababab'}}
		service = TestBed.get(CMSService)
		localInfoService = TestBed.get(LocalInfoService)
		service.localInfo = undefined
		let spy = spyOn(localInfoService, 'getLocalInfo').and.returnValue(Promise.resolve(results))
		service.fetchCMSArticleCategories(queryParams)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSArticleCategories - catch block', async(() => {
		const results = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: SegmentConst.Consumer,
			Brand: 'Lenovo',
		}
		const queryParams = {queryParams: {filter: 'ababab'}}
		service = TestBed.get(CMSService)
		localInfoService = TestBed.get(LocalInfoService)
		service.localInfo = undefined
		let spy = spyOn(localInfoService, 'getLocalInfo').and.returnValue(Promise.reject(results))
		service.fetchCMSArticleCategories(queryParams)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSArticleCategories - else case', async(() => {
		const queryParams = {queryParams: {filter: 'ababab'}}
		service = TestBed.get(CMSService)
		localInfoService = TestBed.get(LocalInfoService)
		service.localInfo = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: SegmentConst.Consumer,
			Brand: 'Lenovo',
		}
		let spy = spyOn(service, 'requestCMSArticleCategories')
		service.fetchCMSArticleCategories(queryParams)
		expect(spy).toHaveBeenCalled()
	}))
});
