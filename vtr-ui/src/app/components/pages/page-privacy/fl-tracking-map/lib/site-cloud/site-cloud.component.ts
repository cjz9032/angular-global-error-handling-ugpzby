import {Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChildren, QueryList} from '@angular/core';
import {SiteCloudCore} from '../../tracking-map-base/SiteCloudCore';
import {SiteComponent} from '../site/site.component';
import {Site_NULL} from '../../tracking-map-base/SiteCloudCore/Site';
import { ImageComponent } from '../image/image.component';

const MAX_SITES = 40;

@Component({
	selector: '[fl-site-cloud]',
	templateUrl: './site-cloud.component.html',
	styleUrls: ['./site-cloud.component.scss']
})
export class SiteCloudComponent implements OnInit {
	@ViewChildren(SiteComponent) sites: QueryList<SiteComponent>;

	@Input() siteCloud: SiteCloudCore;

	@Output() loadError = new EventEmitter<ImageComponent>();

	constructor() {
	}

	ngOnInit() {
	}

	get siteData() {
		let siteData = this.siteCloud.sites;
		const lenDiff = MAX_SITES - siteData.length;

		if (lenDiff > 0) {
			siteData = [...siteData];
			for (let i = 0; i < lenDiff; i++) {
				siteData.push(Site_NULL);
			}
		}

		return siteData;
	}

	onLoadError(event) {
		this.loadError.emit(event);
	}

	updateSites() {
		this.sites.forEach(site => {
			site.update();
		});
	}

	trackSite(index: number, site) {
		return site ? index : null;
		// return site ? site.node.name : null
	}

}
