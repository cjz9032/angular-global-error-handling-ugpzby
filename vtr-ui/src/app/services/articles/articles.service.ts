import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
		'Authorization': 'Access-Control-Allow-Origin'
	})
};

@Injectable({
	providedIn: 'root'
})
export class ArticlesService {

	baseUrl = 'https://qa.csw.lenovo.com';
	// articlesUrl = `${this.baseUrl}/api/v1/articles`;
	articlesUrl = `http://qa.csw.lenovo.com/api/v1/articlecategories `;
	articles: any;

	constructor(
		private http: HttpClient,
	) { }

	getArticles() {
		return this.http.get<any>(this.articlesUrl, httpOptions);
	}
}
