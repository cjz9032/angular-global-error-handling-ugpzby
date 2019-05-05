import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class InlineSvgService {

	constructor(private http: HttpClient) {
	}

	getSvg(src: string) {
		const myHeaders = new HttpHeaders({
			'Content-Type': 'text/xml'
		});
		return this.http.get(src, {
			responseType: 'text',
			headers: myHeaders
		});
	}
}
