import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DevService } from '../dev/dev.service';

@Injectable()
export class CommsService {

	env = environment;
	appId = '';
	token = '';
	serverSwitchLocalData = {};

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

		this.devService.writeLog('API GET ENDPOINT: ', url);
		return this.http.get(url, httpOptions);
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
