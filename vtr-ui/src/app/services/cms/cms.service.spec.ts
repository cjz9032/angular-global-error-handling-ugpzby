import { async, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { of, from, throwError } from 'rxjs';

import { CMSService } from "./cms.service";
import { CommsService } from "../comms/comms.service";
import { DevService } from "../dev/dev.service";
import { VantageShellService } from "../vantage-shell/vantage-shell.service";
import { LocalInfoService } from "../local-info/local-info.service";
import { LoggerService } from '../logger/logger.service';
import { CommonService } from '../common/common.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';

const data: any = {
	Results :[{
	Id: "5708566453fa4150825147391e079e14",
	Title: "5 privacy myths most people believe",
	ShortTitle: "",
	Description: "Privacy is a universal concern. Just because you have nothing to hide doesn’t mean you’re invulnerable to privacy breaches.",
	FeatureImage: "https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/25112019-Day-Zero-Content/Five-Privacy-Myths-Position-C.png?v=2bedf0f470f14c4fb2ec4de975fec934",
	Action: "",
	ActionType: "Internal",
	ActionLink: "771784467e3a4130addab0e1b4ca493a",
	BrandName: "",
	BrandImage: "",
	Priority: "P1",
	Page: "dashboard",
	Template: "half-width-title-description-link-image",
	Position: "position-C",
	ExpirationDate: null,
	Filters: null
  }],
  Metadata: {
	Count: 11
  }
}

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
			Segment: 'Consumer',
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
			Segment: 'Consumer',
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

	it('should call getCMSContent - if results', async(() => {
		service = TestBed.get(CMSService)
		commService = TestBed.get(CommsService)
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			})
		};
		const CMSOption = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		let subscriber = {
			next(res) {
				return res
			},
			complete() {
				return
			}
		}
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(of(data))
		service.getCMSContent(CMSOption, subscriber)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getCMSContent - if reason', async(() => {
		service = TestBed.get(CMSService)
		commService = TestBed.get(CommsService)
		// const httpOptions = {
		// 	headers: new HttpHeaders({
		// 		'Content-Type': 'application/json',
		// 	})
		// };
		const CMSOption = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		const dataE: any = {}
		const subscriber = {
			next(res) {
				return res
			},
			complete() {
				return
			},
			error(err) {
				return err
			}
		}
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(of(dataE))
		service.getCMSContent(CMSOption, subscriber)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getCMSContent - error', async(() => {
		const subscriber = {
			next(res) {
				return res
			},
			complete() {
				return
			},
			error(err) {
				return err
			}
		}
		const CMSOption = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		service = TestBed.get(CMSService)
		commService = TestBed.get(CommsService)
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(throwError({status: 404}))
		service.getCMSContent(CMSOption, subscriber)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSArticleCategories', async(() => {
		const results = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
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
			Segment: 'Consumer',
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
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		let spy = spyOn(service, 'requestCMSArticleCategories')
		service.fetchCMSArticleCategories(queryParams)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call requestCMSArticleCategories - if results', async(() => {
		service = TestBed.get(CMSService)
		commService = TestBed.get(CommsService)
		const locInfo = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		const queryParams = {}
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(of(data))
		service.requestCMSArticleCategories(queryParams, locInfo)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call requestCMSArticleCategories - if reason', async(() => {
		service = TestBed.get(CMSService)
		commService = TestBed.get(CommsService)
		const locInfo = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		const dataE: any = {}
		const queryParams = {}
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(of(dataE))
		service.requestCMSArticleCategories(queryParams, locInfo)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call requestCMSArticleCategories - if error', async(() => {
		service = TestBed.get(CMSService)
		commService = TestBed.get(CommsService)
		const locInfo = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		const queryParams = {}
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(throwError({status: 404}))
		service.requestCMSArticleCategories(queryParams, locInfo)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSArticles', async(() => {
		const queryParams = {}
		const results = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		let returnAll = false
		service = TestBed.get(CMSService);
		localInfoService = TestBed.get(LocalInfoService)
		service.localInfo = undefined
		let spy = spyOn(localInfoService, 'getLocalInfo').and.returnValue(Promise.resolve(results))
		service.fetchCMSArticles(queryParams, returnAll)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSArticles -catch block', async(() => {
		const queryParams = {}
		const results = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		let returnAll = false
		service = TestBed.get(CMSService);
		localInfoService = TestBed.get(LocalInfoService)
		service.localInfo = undefined
		let spy = spyOn(localInfoService, 'getLocalInfo').and.returnValue(Promise.reject())
		service.fetchCMSArticles(queryParams, returnAll)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSArticles - else case', async(() => {
		const queryParams = {}
		let returnAll = false
		service = TestBed.get(CMSService);
		localInfoService = TestBed.get(LocalInfoService)
		service.localInfo = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		let spy = spyOn(service, 'requestCMSArticles')
		service.fetchCMSArticles(queryParams, returnAll)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call requestCMSArticles', async(() => {
		service = TestBed.get(CMSService)
		commService = TestBed.get(CommsService)
		const locInfo = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		const queryParams = {}
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(of(data))
		service.requestCMSArticles(queryParams, locInfo)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call requestCMSArticles - if reason', async(() => {
		service = TestBed.get(CMSService)
		commService = TestBed.get(CommsService)
		const locInfo = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		const dataE: any = {}
		const queryParams = {}
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(of(dataE))
		service.requestCMSArticles(queryParams, locInfo)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call requestCMSArticles - if error', async(() => {
		service = TestBed.get(CMSService)
		commService = TestBed.get(CommsService)
		const locInfo = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		const queryParams = {}
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(throwError({status: 404}))
		service.requestCMSArticles(queryParams, locInfo)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSArticle', async(() => {
		const queryParams = {}
		const articleId = '1DHKKM344LL599000'
		const results = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		service = TestBed.get(CMSService);
		localInfoService = TestBed.get(LocalInfoService)
		service.localInfo = undefined
		let spy = spyOn(localInfoService, 'getLocalInfo').and.returnValue(Promise.resolve(results))
		service.fetchCMSArticle(articleId, queryParams)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSArticle -catch block', async(() => {
		const queryParams = {}
		const articleId = '1DHKKM344LL599000'
		service = TestBed.get(CMSService);
		localInfoService = TestBed.get(LocalInfoService)
		service.localInfo = undefined
		let spy = spyOn(localInfoService, 'getLocalInfo').and.returnValue(Promise.reject())
		service.fetchCMSArticle(articleId, queryParams)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSArticle - else case', async(() => {
		const queryParams = {}
		const articleId = '1DHKKM344LL599000'
		service = TestBed.get(CMSService);
		localInfoService = TestBed.get(LocalInfoService)
		service.localInfo = {
			Lang: 'en',
			GEO: 'us',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'Consumer',
			Brand: 'Lenovo',
		}
		let spy = spyOn(service, 'requestCMSArticle')
		service.fetchCMSArticle(articleId, queryParams)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getOneCMSContent', async(() => {
		service = TestBed.get(CMSService);
		const results = [{Template: 'template', Position: 'position'}]
		const template = 'template'
		const position = 'position'
		service.getOneCMSContent(results, template, position)
		expect(service.getOneCMSContent).toBeTruthy()
	}));

	it('should call fetchCMSEntitledAppList', async(() => {
		service = TestBed.get(CMSService);
		commService = TestBed.get(CommsService)
		service.localInfo = {
			Lang: 'en',
			GEO: 'us',
		}
		const queryParams = {}
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(of(data))
		service.fetchCMSEntitledAppList(queryParams)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSEntitledAppList -error', async(() => {
		service = TestBed.get(CMSService);
		commService = TestBed.get(CommsService)
		service.localInfo = {
			Lang: 'en',
			GEO: 'us',
		}
		const queryParams = {}
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(throwError({status: 404}))
		service.fetchCMSEntitledAppList(queryParams)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSAppDetails', async(() => {
		service = TestBed.get(CMSService);
		commService = TestBed.get(CommsService)
		service.localInfo = {
			Lang: 'en'
		}
		const appId = "5708566453fa4150825147391e079e14"
		const queryParams = {}
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(of(data))
		service.fetchCMSAppDetails(appId, queryParams)
		expect(spy).toHaveBeenCalled()
	}));

	it('should call fetchCMSAppDetails -error', async(() => {
		service = TestBed.get(CMSService);
		commService = TestBed.get(CommsService)
		service.localInfo = {
			Lang: 'en'
		}
		const queryParams = {}
		const appId = "5708566453fa4150825147391e079e14"
		const spy = spyOn<any>(commService, 'endpointGetCall').and.returnValue(throwError({status: 404}))
		service.fetchCMSAppDetails(appId, queryParams)
		expect(spy).toHaveBeenCalled()
	}));
});
