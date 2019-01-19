import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DevService } from '../dev/dev.service';

@Injectable()
export class CommsService {

	env = environment;
	appId = '';
	token = '';

	constructor(
		private http: HttpClient,
		private devService: DevService
	) { }

	handleAPIError(method, err) {
		this.devService.writeLog('API ERROR', method, err);
	}

	endpointGetCall(endpoint, addString = '') {
		const self = this;
		const url = this.env.apiRoot + endpoint.path + addString;
		this.devService.writeLog('API GET ENDPOINT: ', url);
		return this.http.get(url);
	}

	flatGetCall(url) {
		const self = this;
		this.devService.writeLog('FLAT GET ENDPOINT: ', url);
		return this.http.get(url);
	}

	logout() {
		const url = this.env.ssoLogout + this.env.ssoCallback;
		this.devService.writeLog('LOGOUT: ', url);
		return this.flatGetCall(url);
	}

}
