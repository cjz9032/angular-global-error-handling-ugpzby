import {Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter, ViewEncapsulation} from '@angular/core';

import {SingleViewCore} from '../../tracking-map-base/SingleViewCore';

@Component({
	selector: 'fl-tracking-map-single',
	templateUrl: './map-single.component.html',
	styleUrls: ['./map-single.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class MapSingleComponent implements OnChanges {

	@Input() trackers;

	@Input() positive = false;

	@Input() width = 790;
	@Input() height = 800;

	@Input() defaultSiteIcon: string;
	@Input() defaultTrackerIcon: string;

	mapCore: SingleViewCore;

	constructor() {
	}

	ngOnChanges(changes: SimpleChanges) {
		this.mapCore = new SingleViewCore(this.trackers, {
			width: this.width,
			height: this.height,
			positive: this.positive,
		});
	}

	onSiteLoadError(el) {
		if (typeof this.defaultSiteIcon === 'undefined') {
			return;
		}
		el.updateImage(this.defaultSiteIcon);
	}

	onTrackerLoadError(el) {
		if (typeof this.defaultTrackerIcon === 'undefined') {
			return;
		}
		el.updateImage(this.defaultTrackerIcon);
	}

}
