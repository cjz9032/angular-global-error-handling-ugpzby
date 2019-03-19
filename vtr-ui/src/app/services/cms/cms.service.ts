import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { CommsService } from '../comms/comms.service';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
		'Authorization': 'Access-Control-Allow-Origin'
	})
};

@Injectable({
	providedIn: 'root'
})
export class CMSService {
	constructor(
		private commsService: CommsService,
	) { }

	fetchCMSContent(queryParams) {
		return this.commsService.endpointGetCall('/api/v1/features', queryParams, {}).pipe(map((response: any) => {
			return response.Results;
		}));
	}

	getOneCMSContent(results, template, position) {
		return results.filter((record) => {
			return record.Template === template;
		}).filter((record) => {
			return record.Position === position;
		}).sort((a, b) => a.Priority.localeCompare(b.Priority));
	}
}
