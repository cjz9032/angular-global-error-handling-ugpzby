import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DevService } from '../dev/dev.service';
import { NetworkPerformance } from '../metric/metrics.model';
import { MetricEventName as EventName } from 'src/app/enums/metrics.enum';
import { MetricService } from '../metric/metrics.service';
import { tap } from 'rxjs/operators';

declare var Windows;

@Injectable()
export class CommsService {

	env = environment;
	appId = '';
	token = '';
	userAgent = `VantageWeb/${environment.appVersion}`;
	private serverSwitchLocalData: any;
	constructor(
		private http: HttpClient,
		private devService: DevService,
		private metricService: MetricService
	) {
	}

	handleAPIError(method, err) {
		this.devService.writeLog('API ERROR', method, err);
	}

	public getCmsHost() {
		if (this.serverSwitchLocalData && this.serverSwitchLocalData.forceit === true) {
			return this.serverSwitchLocalData.cmsserver;
		} else {
			return this.env.cmsApiRoot;
		}
	}

	public endpointGetCall(endpoint, queryParams: any = {}, httpOptions: any = {}) {
		const cmsHost = this.getCmsHost();
		const url =  cmsHost + endpoint;
		httpOptions.params = new HttpParams({
			fromObject: queryParams
		});

		this.devService.writeLog('API GET ENDPOINT complete: ', url + '?' + httpOptions.params);

		if (endpoint.indexOf('/api/v1/') > -1) {	// CMS API
			const performanceData: NetworkPerformance = {
				ItemType: EventName.performance,
				Host: cmsHost,
				Api: endpoint,
				Duration: Date.now()
			};

			return this.http.get(url, httpOptions).pipe(tap(() => {
				performanceData.Duration = Date.now() - performanceData.Duration;
				this.metricService.sendMetrics(performanceData);
			}));
		} else {
			return this.http.get(url, httpOptions);
		}
	}

	public async callUpeApi(urlStr, queryParams: any = {}) {
		const reqHeader = new HttpHeaders({
			'Content-Type': 'application/json;charset=UTF-8',
			'User-Agent': this.userAgent
		});

		this.devService.writeLog('CALL UPE API: ', urlStr);

		const url = new URL(urlStr);
		const performanceData: NetworkPerformance = {
			ItemType: EventName.performance,
			Host: url.host,
			Api: url.pathname,
			Duration: Date.now()
		};

		const result = await this.http.post(urlStr, JSON.stringify(queryParams),
			{
				observe: 'response',
				headers: reqHeader
			}).toPromise();

		performanceData.Duration = Date.now() - performanceData.Duration;
		this.metricService.sendMetrics(performanceData);

		return result;
	}

	async makeTagRequest(strUrl, headers: any = {}) {
		// return this.http.get(url, { observe: 'response', headers });
		if (!Windows) {
			throw new Error('unknow error');
		}

		const client = new Windows.Web.Http.HttpClient();
		const url = new Windows.Foundation.Uri(strUrl);
		const request = new Windows.Web.Http.HttpRequestMessage(Windows.Web.Http.HttpMethod.get, url);
		if (headers) {
			Object.keys(headers).forEach(key => {
				request.headers.append(key, headers[key]);
			});
		}

		request.headers.append('User-Agent', this.userAgent);

		const performanceData: NetworkPerformance = {
			ItemType: EventName.performance,
			Host: url.host,
			Api: url.path,
			Duration: Date.now()
		};

		const response = await client.sendRequestAsync(request);
		if (response.statusCode !== 200) {
			throw { status: response.statusCode };
		}
		const result = await response.content.readAsStringAsync();

		performanceData.Duration = Date.now() - performanceData.Duration;
		this.metricService.sendMetrics(performanceData);

		return result;
	}

	flatGetCall(url) {
		const self = this;
		this.devService.writeLog('FLAT GET ENDPOINT: ', url);
		return this.http.get(url);
	}

	setServerSwitchLocalData(serverSwitchLocalData) {
		this.serverSwitchLocalData = serverSwitchLocalData;
	}
}
