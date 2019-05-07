import {ChartCore, ChartStyle, defaultChartStyle, defaultBackgroundStyle, defaultChartTitleStyle} from './ChartCore';
import {SiteCloudCore, SiteCloudStyle, defaultSiteCloudStyle} from './SiteCloudCore';
import {ChartPieLine, defaultLineStyle, defaultPieLineStyle, defaultDotStyle, defaultTextStyle} from './ChartCore/ChartPieLine';
import {Vector2} from './Transform';
import {defaultCircleStyle} from './ChartCore/ChartCircles';
import {ColorUtils} from './Color';
import {defaultPieStyle} from './ChartCore/ChartPieData';

export interface Node {
	name: string;
	icon: string;

	group: number;

	size: number;
}

export interface SiteNode extends Node {
	trackers: Array<string>;
	outerSize: number;
}

export interface TrackerNode extends Node {
	connections: Array<string>;
}

export interface ConnectionLine {
	start: Vector2;
	end: Vector2;

	style: ConnectionLineStyle;
}

export interface ConnectionLineStyle {
	stroke: string;
	dash: string;
	cap: string;
	size: number;
	opacity: number;
}

export const defaultConnectionLineStyle: ConnectionLineStyle = {
	stroke: 'url(#lgr)',
	dash: '5 10',
	cap: 'round',
	size: 5,
	opacity: 1,
};

export interface MapProps {
	width?: number;
	height?: number;

	defaultTrackerIcon?: string;
	defaultSiteIcon?: string;

	maxTrackers?: number;
	minDistance?: number;

	logoOffset?: number;

	minSizePx?: number;

	siteSize?: number;
	trackerSize?: number;

	chartLabel?: string;
	cloudLabel?: string;
	circleLabel?: string;

	positive?: boolean;
}

export interface MapStyles {
	chartStyle: ChartStyle;
	cloudStyle: SiteCloudStyle;
	lineStyle: ConnectionLineStyle;
}

export const defaultMapStyle: MapStyles = {
	chartStyle: defaultChartStyle,
	cloudStyle: defaultSiteCloudStyle,
	lineStyle: defaultConnectionLineStyle,
};

export const positiveMapStyle: MapStyles = {
	...defaultMapStyle,

	lineStyle: {
		...defaultConnectionLineStyle,
		opacity: 0,
	},

	chartStyle: {
		...defaultChartStyle,

		background: {
			...defaultBackgroundStyle,
			color: '#F2FFF3'
		},

		pieLine: {
			...defaultPieStyle,

			transform: {
				...defaultPieStyle.transform,
				position: {
					x: -15,
					y: defaultPieStyle.transform.position.y
				}
			},

			pieLine: {
				...defaultPieLineStyle,
				dot: {
					...defaultDotStyle,
					opacity: 0,
				},
				line: {
					...defaultLineStyle,
					opacity: 0,
				},
				text: {
					...defaultTextStyle,
					opacity: 0,
				}
			},

			gradient: [
				ColorUtils.colorFromHEX('#F2FFF3'),
				ColorUtils.colorFromHEX('#F2FFF3'),
			]
		},

		title: {
			...defaultChartTitleStyle,
			color: '#7C8696'
		},

		circle: {
			...defaultCircleStyle,
			color: ColorUtils.colorFromHEX('#5AC462'),
			border: true,
		}
	},
};

export const defaultMapProps: MapProps = {
	width: 790,
	height: 520,

	maxTrackers: 14,
	minDistance: 120,

	logoOffset: 25,
	minSizePx: 24,

	siteSize: 1,
	trackerSize: 1,

	chartLabel: 'Companies That Track You',
	cloudLabel: 'The Most Popular Websites',

	circleLabel: 'Trackers',

	positive: false,
};

export class TrackingMapCore {

	chart: ChartCore;
	siteCloud: SiteCloudCore;
	line: ConnectionLine;

	protected _trackers: any;
	protected _props: MapProps;
	protected _style: MapStyles;

	protected _siteNodes: any[] = [];
	protected _trackerNodes: any[] = [];

	protected _radius: number;
	protected _innerRadius: number;

	constructor(trackers: any, props: MapProps = {}, style: MapStyles = {...defaultMapStyle}) {
		this._trackers = trackers;

		this._props = {
			...defaultMapProps,
			...props
		};
		this._style = (!this._props.positive) ? style : {...positiveMapStyle};

		this.calculateRadius();
		this.prepareData();
		this.filterNodes();

		if (this._props.positive) {
			this.positivieFilter();
		}

		this.chart = new ChartCore(this._trackerNodes, {
			title: this._props.chartLabel,
			circleLabel: this._props.circleLabel,

			position: {x: this._props.width / 4, y: 0},

			maxRadius: this._radius,
			innerRadius: this._innerRadius,

			logoOffset: this._props.logoOffset,
			logoSizePx: this._props.minSizePx,

			minDistance: this._props.minDistance,

			positive: this._props.positive,
		}, this._style.chartStyle);

		this.siteCloud = new SiteCloudCore(this._siteNodes, {
			title: this._props.cloudLabel,

			position: {x: -this._props.width / 4, y: 0},
			minSizePx: this._props.minSizePx,
		}, this._style.cloudStyle);

		this.line = {
			style: {...this._style.lineStyle},

			start: {x: 50, y: 60},
			end: {x: -100, y: 61},
		};
	}

	get viewBox() {
		return [-this._props.width / 2, -this._props.height / 2, this._props.width, this._props.height].join(' ');
	}

	selectTracker(p: ChartPieLine) {
		this.chart.highlightTracker(p);
		this.siteCloud.highlightSites(p.pie.data.connections);
	}

	selectAll() {
		this.chart.highlightAll();
		this.siteCloud.highlightAll();
	}

	getDetails(event) {
		const {sites, trackers} = this._trackers;
		const {name, connections} = event.pie.data;

		let tracker;
		Object.keys(trackers).forEach(key => {
			const t = trackers[key];
			if (t.company_name === name) {
				tracker = t;
			}
		});

		return {
			sites: sites.filter(site => connections.indexOf(site.domain) !== -1),
			tracker,
		};
	}

	calculateRadius() {
		this._radius = Math.min(this._props.width, this._props.height) / 3;
		this._innerRadius = 0.38 * this._radius;

		if (this._props.positive) {
			this._radius /= 1.4;
		}
	}

	filterNodes() {
		let nodes;
		let minConnections = 1;
		do {
			nodes = this._trackerNodes.filter(n => n.connections.length >= minConnections);
			minConnections++;
		} while (nodes.length > this._props.maxTrackers);

		this._trackerNodes = nodes;
	}

	positivieFilter() {
		this._trackerNodes.forEach(t => t.connections = ['one']);
	}

	prepareData() {
		const data = this._trackers.sites;

		for (const site of data) {
			const trackers = site.trackers;

			this._siteNodes.push({
				name: site.domain,
				icon: (site.favicon_url.length > 0) ? site.favicon_url : this._props.defaultSiteIcon,
				// icon: site.favicon_url,

				trackers: site.trackers.map(i => this._trackers.trackers[i].company_name),

				size: this._props.siteSize,
				outerSize: this._props.siteSize * 1.7
			});

			for (const trackerId of trackers) {
				const t = this._trackers.trackers[trackerId];
				const trackerGroup = t.company_name;
				const icon = t.logo_url;

				const inx = this._trackerNodes.findIndex(n => n.name === trackerGroup);
				if (inx !== -1) {
					this._trackerNodes[inx].connections.push(site.domain);
				} else {
					this._trackerNodes.push({
						name: trackerGroup,

						connections: [site.domain],

						icon: (icon.length > 0) ? icon : this._props.defaultTrackerIcon,
						// icon: icon,

						size: this._props.trackerSize * 0.7,
					});
				}

			}
		}
	}
}
