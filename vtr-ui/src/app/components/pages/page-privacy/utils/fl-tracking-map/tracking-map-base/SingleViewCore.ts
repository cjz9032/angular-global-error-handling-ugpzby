import {ChartCore, ChartProps} from './ChartCore';
import {SiteCloudCore, defaultSiteCloudStyle, SiteCloudStyle} from './SiteCloudCore';
import {ChartPieLine} from './ChartCore/ChartPieLine';
import {Vector2, Transform2, VectorUtils} from './Transform';
import {ChartCircles, CircleStyle, defaultCircleStyle} from './ChartCore/ChartCircles';
import {Logo} from './Logo';
import {MapProps, defaultMapProps, ConnectionLine, defaultConnectionLineStyle, ConnectionLineStyle} from '.';
import {ColorUtils} from './Color';

export interface SingleViewStyle {
	cloudStyle: SiteCloudStyle;
	lineStyle: ConnectionLineStyle;
	circleStyle: CircleStyle;
}

export const defaultSingleViewStyle = {
	cloudStyle: {
		...defaultSiteCloudStyle
	},

	lineStyle: {
		...defaultConnectionLineStyle,
		stroke: 'url(#lgr_v)',
	},

	circleStyle: {
		...defaultCircleStyle,
	}
};

export const positiveSingleViewStyle = {
	...defaultSingleViewStyle,

	lineStyle: {
		...defaultSingleViewStyle.lineStyle,
		stroke: 'url(#lgr_v_p)',
		dash: '1 10',
	},

	circleStyle: {
		...defaultSingleViewStyle.circleStyle,
		color: ColorUtils.colorFromHEX('#5AC462'),

		border: true,
	}
};

export class SingleViewCore {

	siteCloud: SiteCloudCore;
	chartCircles: ChartCircles;

	logo: Logo;

	line: ConnectionLine;

	protected _trackers: any;
	protected _props: MapProps;
	protected _style: SingleViewStyle;

	protected _siteNodes: any[] = [];

	protected _radius: number;
	protected _innerRadius: number;

	constructor(trackers: any, props: MapProps = {}, style: SingleViewStyle = {...defaultSingleViewStyle}) {
		this._trackers = trackers;

		this._props = {
			...defaultMapProps,
			...props
		};
		this._style = (this._props.positive) ? {...positiveSingleViewStyle} : style;

		this.calculateRadius();
		this.prepareData();

		this.siteCloud = new SiteCloudCore(this._siteNodes, {
			title: '',

			position: {x: 150, y: this._props.height / 2 - 250},
			minSizePx: this._props.minSizePx,
		}, this._style.cloudStyle);

		this.line = {
			style: {...this._style.lineStyle},

			start: {x: -this._props.width / 2 + 100, y: 0},
			end: {x: -this._props.width / 2 + 450, y: 1},
		};

		if (this._props.positive) {
			this.line.end = {x: -this._props.width / 2 + 300, y: 0};
		}

		this.chartCircles = ChartCircles.circles(55, 100, this._style.circleStyle);

		const logoT: Transform2 = {
			position: VectorUtils.ZeroVector(),
			scale: {x: 3, y: 3}
		};

		this.logo = new Logo(this._trackers.tracker.logo_url, logoT, this._props.minSizePx);
	}

	get logoBlockTransform() {
		const offset = (this._props.positive) ? -300 : -250;
		// return `translate(${0} ${-this._props.height / 2 + offset})`;
		return `translate(${-250} ${0})`;
	}

	get viewBox() {
		return [-this._props.width / 2, -this._props.height / 2, this._props.width, this._props.height].join(' ');
	}

	calculateRadius() {
		this._radius = Math.min(this._props.width, this._props.height) / 3;
		this._innerRadius = 0.38 * this._radius;
	}

	prepareData() {
		const data = this._trackers.sites;

		for (const site of data) {
			this._siteNodes.push({
				name: site.domain,
				icon: site.favicon_url,

				trackers: [], // site.trackers.map(i => this._trackers.trackers[i].company_name),

				size: this._props.siteSize,
				outerSize: this._props.siteSize * 1.7
			});
		}
	}
}
