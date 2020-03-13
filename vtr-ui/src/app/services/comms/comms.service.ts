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
	private serverSwitchLocalData: any;
	private cmsHost: Promise<any>;
	constructor(
		private http: HttpClient,
		private devService: DevService,
		shellService: VantageShellService
	) {
		this.cmsHost = this.getCmsHostFromReg(shellService);
	}

	async getCmsHostFromReg(shellService: VantageShellService) {
		const registryUtil = shellService.getRegistryUtil();
		if (!registryUtil) {
			return null;
		}

		const val = await registryUtil.queryValue('HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Lenovo\\VantageService\\CloudLinks');
		if (!val || (val.keyList || []).length === 0) {
			return null;
		}

		for (const key of val.keyList) {
			const child = key.keyChildren.find(item => item.name === 'CmsUrlBase');
			if (child) {
				return child.value;
			}
		}

		return null;
	}

	async getCmsHost() {
		return await this.cmsHost || this.env.cmsApiRoot;
	}

	handleAPIError(method, err) {
		this.devService.writeLog('API ERROR', method, err);
	}

	endpointGetCall(endpoint, queryParams: any = {}, httpOptions: any = {}) {
		return new Observable(subscriber => {
			this.getCmsHost().then(cmsApiRoot => {
				const url = (this.serverSwitchLocalData && this.serverSwitchLocalData.forceit && this.serverSwitchLocalData.forceit === true ?
					this.serverSwitchLocalData.cmsserver : cmsApiRoot) + endpoint;

				const httpQueryParams = new HttpParams({
					fromObject: queryParams
				});

				httpOptions.params = httpQueryParams;
				this.devService.writeLog('API GET ENDPOINT complete: ', url + '?' + httpOptions.params);
				return this.http.get(url, httpOptions);
			}).then(httpResponse => {
				httpResponse.subscribe(subscriber);
			});
		});
	}

	callUpeApi(url, queryParams: any = {}) {
		// const url = this.env.upeApiRoot + api;

		const reqHeader = new HttpHeaders({
			'Content-Type': 'application/json;charset=UTF-8'
		});

		this.devService.writeLog('CALL UPE API: ', url);
		return this.http.post(url, JSON.stringify(queryParams),
			{
				observe: 'response',
				headers: reqHeader
			});
	}

	async makeTagRequest(strUrl, headers: any = {}) {
		//return this.http.get(url, { observe: 'response', headers });
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

		const response = await client.sendRequestAsync(request);
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
