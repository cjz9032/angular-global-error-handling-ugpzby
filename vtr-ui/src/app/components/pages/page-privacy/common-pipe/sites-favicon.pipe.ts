import { Pipe, PipeTransform } from '@angular/core';
import { DataKnowledgeService } from '../shared/services/data-knowledge.service';
import { Observable } from 'rxjs';

@Pipe({
	name: 'sitesFavicon'
})
export class SitesFaviconPipe implements PipeTransform {

	constructor(private dataKnowledgeService: DataKnowledgeService) {
	}

	transform(domain: string, args?: any): Observable<string> {
		return this.dataKnowledgeService.getFaviconImages(domain);
	}

}
