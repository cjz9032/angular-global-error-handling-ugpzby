import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class AbTestsBackendService {

	constructor(private http: HttpClient) {
	}

	getConfig() {

	}

	sendError() {

	}
}
