import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DevService } from '../dev/dev.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { Observable } from 'rxjs';

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
		private devService: DevService
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
		const url = this.getCmsHost() + endpoint;
		httpOptions.params = new HttpParams({
			fromObject: queryParams
		});

		this.devService.writeLog('API GET ENDPOINT complete: ', url + '?' + httpOptions.params);
		return this.http.get(url, httpOptions);
	}

	public async callUpeApi(url, queryParams: any = {}) {
		const reqHeader = new HttpHeaders({
			'Content-Type': 'application/json;charset=UTF-8',
			'User-Agent': this.userAgent
		});

		this.devService.writeLog('CALL UPE API: ', url);
		return this.http.post(url, JSON.stringify(queryParams),
			{
				observe: 'response',
				headers: reqHeader
			}).toPromise();
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
		const response = await client.sendRequestAsync(request);
		if (response.statusCode !== 200) {
			throw { status: response.statusCode }
		};
		return await response.content.readAsStringAsync();
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
