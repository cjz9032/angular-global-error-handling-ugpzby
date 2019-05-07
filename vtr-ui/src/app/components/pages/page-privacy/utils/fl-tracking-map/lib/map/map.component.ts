import {
	Component,
	OnInit,
	OnChanges,
	Input,
	SimpleChanges,
	Output,
	EventEmitter,
	ViewEncapsulation,
	DoCheck,
	KeyValueDiffer,
	KeyValueDiffers,
	ChangeDetectionStrategy,
	AfterViewInit,
	ChangeDetectorRef,
	ViewChildren,
	QueryList
} from '@angular/core';

import {TrackingMapCore, defaultMapProps} from '../../tracking-map-base';
import {animations} from './map.animations';
import {ChartLineComponent} from '../chart-line/chart-line.component';
import {ChartComponent} from '../chart/chart.component';
import {SiteCloudComponent} from '../site-cloud/site-cloud.component';

export interface MapLabels {
	chartLabel?: string;
	cloudLabel?: string;
	circleLabel?: string;
}

@Component({
	selector: 'fl-tracking-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss'],

	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,

	animations
})
export class MapComponent implements OnChanges, OnInit, DoCheck, AfterViewInit {
	@ViewChildren(ChartComponent) charts: QueryList<ChartComponent>;
	@ViewChildren(SiteCloudComponent) siteClouds: QueryList<SiteCloudComponent>;

	private _trackersDiffer: KeyValueDiffer<any, any>;
	@Input() trackers;

	private _labelsDiffer: KeyValueDiffer<any, any>;
	@Input() labels: MapLabels = {};

	@Input() defaultSiteIcon: string;
	@Input() defaultTrackerIcon: string;

	@Input() positive = false;
	@Input() animate = false;

	@Input() width = 790;
	@Input() height = 520;

	@Output() showDetails = new EventEmitter<any>();

	mapCore: TrackingMapCore;

	constructor(
		private differ: KeyValueDiffers,
		private cdr: ChangeDetectorRef
	) {
	}

	ngAfterViewInit() {
		this.cdr.detach();
	}

	ngOnInit() {
		this._trackersDiffer = this.differ.find(this.trackers).create();
		this.applyChanges();
	}

	ngDoCheck() {
		let trackersDiff;
		let labelsDiff;

		if (this._trackersDiffer) {
			trackersDiff = this._trackersDiffer.diff(this.trackers);
		}

		if (this._labelsDiffer) {
			labelsDiff = this._labelsDiffer.diff(this.labels);
		}

		if (trackersDiff || labelsDiff) {
			this.applyChanges();
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.trackers || changes.labels) {
			return;
		}
		this.applyChanges();
	}

	applyChanges() {
		this.mapCore = new TrackingMapCore(this.trackers, {
			width: this.width,
			height: this.height,
			positive: this.positive,

			defaultTrackerIcon: this.defaultTrackerIcon,
			defaultSiteIcon: this.defaultSiteIcon,

			chartLabel: this.labels.chartLabel || defaultMapProps.chartLabel,
			cloudLabel: this.labels.cloudLabel || defaultMapProps.cloudLabel,
			circleLabel: this.labels.circleLabel || defaultMapProps.circleLabel,
		});

		this.cdr.detectChanges();
	}

	updateAll() {
		this.updateGraph();
		this.updateCloud();
	}

	updateGraph() {
		this.charts.forEach(chart => {
			chart.updateLines();
		});
	}

	updateCloud() {
		this.siteClouds.forEach(siteCloud => {
			siteCloud.updateSites();
		});
	}

	onHover(id) {
		this.mapCore.selectTracker(id);
		this.updateAll();
	}

	onLeave() {
		this.mapCore.selectAll();
		this.updateAll();
	}

	onShowDetails(event) {
		const details = this.mapCore.getDetails(event);
		this.showDetails.emit(details);
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
