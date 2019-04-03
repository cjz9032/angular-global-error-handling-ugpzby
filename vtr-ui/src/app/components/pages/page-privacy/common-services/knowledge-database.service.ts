import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const KNOWLEDGE_DATABASE_API_URL = 'https://api.tz.figleafapp.com/api/v1/public/kb';

@Injectable({
	providedIn: 'root'
})
export class KnowledgeDatabaseService {

	constructor(private http: HttpClient) {
		this.getDatabase(0, 10).subscribe(
			(val) => console.log('KNOWLEDGE_DATABASE_API_URL', val)
		);
	}

	getDatabase(since, limit) {
		return this.http.get(KNOWLEDGE_DATABASE_API_URL, {
			params: {
				since,
				limit
			}
		});
	}
}
