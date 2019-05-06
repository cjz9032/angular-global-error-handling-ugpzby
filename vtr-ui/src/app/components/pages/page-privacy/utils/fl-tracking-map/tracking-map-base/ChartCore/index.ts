import {ChartPieData, PieStyle, defaultPieStyle} from './ChartPieData';
import {ChartCircles, CircleStyle, defaultCircleStyle} from './ChartCircles';

import {TrackerNode} from '..';
import {ChartPieLine, defaultTextStyle} from './ChartPieLine';
import {Transform2, VectorUtils, TransformUtils, Vector2} from '../Transform';
import {MText, defaultGlobalTextStyle, TextStyle} from '../Text';
import {Logo} from '../Logo';

export interface ChartProps {
	position: Vector2;

	title: string;
	circleLabel: string;

	maxRadius: number;
	innerRadius: number;

	logoOffset: number;
	logoSizePx: number;

	minDistance: number;

	positive: boolean;
}

export interface BackgroundStyle {
	transform: Transform2;

	borderRadius: number;
	color: string;
}

export const defaultBackgroundStyle: BackgroundStyle = {
	color: '#FDF6F7',
	borderRadius: 8,

	transform: {
		position: {x: '-25%', y: '-47.5%'},
		scale: {x: '50%', y: '95%'}
	}
};

export const defaultChartTitleStyle: TextStyle = {
	...defaultTextStyle,
	className: 'fl-chart-title',
	anchor: 'middle',
	color: '#FE5050',
};

export interface ChartStyle {
	transform: Transform2;

	pieLine: PieStyle;
	circle: CircleStyle;
	title: TextStyle;

	background: BackgroundStyle;
}

export const defaultChartStyle: ChartStyle = {

	transform: {
		position: {x: 0, y: 0},
		scale: VectorUtils.ZeroVector()
	},

	pieLine: {...defaultPieStyle},
	circle: {...defaultCircleStyle},

	title: {...defaultChartTitleStyle},

	background: {...defaultBackgroundStyle}
};

export class ChartCore {

	chartPieData: ChartPieData;
	chartCircles: ChartCircles;

	text: MText;

	style: ChartStyle;

	protected _trackerNodes: TrackerNode[];
	protected _props: ChartProps;

	constructor(trackerNodes: any, chartProps: ChartProps, style: ChartStyle = {...defaultChartStyle}) {
		this.style = style;

		this._trackerNodes = trackerNodes;
		this._props = chartProps;

		this.style.transform.position = this._props.position;

		this.text = {
			text: this._props.title,
			transform: {
				position: {x: 0, y: '-40%'},
				scale: VectorUtils.ZeroVector(),
			},
			style: this.style.title,
		};

		this.chartPieData = new ChartPieData(
			this._trackerNodes,
			this._props,
			this.style.pieLine
		);

		this.chartCircles = ChartCircles.circles(
			this._props.innerRadius,
			(this._props.positive) ? this._props.innerRadius + 25 : this.chartPieData.minRadius,
			this.style.circle,
			this._props.circleLabel
		);
	}

	get transform() {
		return TransformUtils.transformToString(this.style.transform);
	}

	/**
	 * Highlights all trackers
	 */
	highlightAll() {
		this.chartPieData.higlightAll();
	}

	/**
	 * Highlights tracker and set of sites assosicated with it
	 */
	highlightTracker(p: ChartPieLine) {
		this.chartPieData.higlightSelected(p);
	}

}
