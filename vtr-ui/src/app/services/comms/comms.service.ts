import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DevService } from '../dev/dev.service';

@Injectable()
export class CommsService {

	env = environment;
	appId = '';
	token = '';
	private serverSwitchLocalData: any;

	constructor(
		private http: HttpClient,
		private devService: DevService
	) { }

	handleAPIError(method, err) {
		this.devService.writeLog('API ERROR', method, err);
	}

	endpointGetCall(endpoint, queryParams: any = {}, httpOptions: any = {}) {
		const url = (this.serverSwitchLocalData && this.serverSwitchLocalData.forceit && this.serverSwitchLocalData.forceit === true ?
			this.serverSwitchLocalData.cmsserver : this.env.cmsApiRoot) + endpoint;

		const httpQueryParams = new HttpParams({
			fromObject: queryParams
		});

		httpOptions.params = httpQueryParams;
		this.devService.writeLog('API GET ENDPOINT complete: ', url + '?' + httpOptions.params);
		return this.http.get(url, httpOptions);
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

	makeTagRequest(url, headers: any = {}) {
		return this.http.get(url, { observe: 'response', headers });
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
