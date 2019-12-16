import { Pipe, PipeTransform } from '@angular/core';
import { DataKnowledgeService } from '../services/data-knowledge.service';
import { Observable } from 'rxjs';

@Pipe({
	name: 'sitesFavicon'
})
export class SitesFaviconPipe implements PipeTransform {

	constructor(private dataKnowledgeService: DataKnowledgeService) {
	}

	transform(domain: string, defaultImageType?: string): Observable<string> {
		return this.dataKnowledgeService.getFaviconImages(domain, defaultImageType);
	}

}
