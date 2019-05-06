import * as d3 from 'd3';

import {ChartProps} from '.';

import {Transform2, VectorUtils, TransformUtils} from '../Transform';

import {ChartPieLine, PieLineStyle, defaultPieLineStyle} from './ChartPieLine';
import {ColorUtils, Color} from '../Color';

export interface PieStyle {
	transform: Transform2;

	gradient: [Color, Color];

	pieLine?: PieLineStyle; // Default PieLine style

	pieLineSelected?: PieLineStyle; // Selected PieLine style
	pieLineFaded?: PieLineStyle; // Faded PieLine style
}

export const defaultPieStyle: PieStyle = {

	transform: {
		position: {x: -80, y: 60},
		scale: VectorUtils.ZeroVector()
	},

	gradient: [
		ColorUtils.colorFromRGBArray([255, 131, 131]),
		ColorUtils.colorFromRGBArray([255, 196, 43])
	],

	pieLine: {...defaultPieLineStyle},

	pieLineSelected: {
		...defaultPieLineStyle,

		color: ColorUtils.colorFromHEX('#FE5050'),
		opacity: 1,
	},

	pieLineFaded: {
		...defaultPieLineStyle,

		opacity: 0.1,
	}
};

export class ChartPieData {

	pieLineData: ChartPieLine[];

	protected _trackerNodes: any;
	protected _chartProps: ChartProps;
	protected _style: PieStyle;

	constructor(trackerNodes: any, chartProps: ChartProps, style: PieStyle = {...defaultPieStyle}) {
		this._chartProps = chartProps;
		this._style = style;

		this.update(trackerNodes);
	}

	get transform() {
		return TransformUtils.transformToString(this._style.transform);
	}

	get maxConnectionsCount() {
		let max = 0;
		this._trackerNodes.forEach(node => {
			if (node.connections.length > max) {
				max = node.connections.length;
			}
		});

		return max;
	}

	get minRadius() {
		return Math.min(...this.pieLineData.map(pie => pie.pie.outerRadius));
	}

	update(trackerNodes: any) {
		this._trackerNodes = trackerNodes;
		this.pieLineData = this.d3Pie(this._trackerNodes).map(pie => new ChartPieLine(pie, this._chartProps));

		this.pieLineData = this.pieLineData.sort((a, b) => a.pie.index - b.pie.index);

		this._calculateParams();
	}

	higlightAll() {
		this.pieLineData.forEach(pieLine => {
			this._setStyles(pieLine, this._style.pieLine);
		});
	}

	higlightSelected(pieLine: ChartPieLine) {
		this.pieLineData.forEach(pl => {
			this._setStyles(pl, this._style.pieLineFaded);
		});

		pieLine.setStyle(this._style.pieLineSelected);
	}

	protected get d3Pie() {
		return d3.pie()
			.value(1)
			.endAngle(Math.PI * 1)
			.sort((a: any, b: any) => {
				if (b.connections.length < a.connections.length) {
					return -1;
				}
				if (b.connections.length > a.connections.length) {
					return 1;
				}
				return 0;
			});
	}

	protected _calculateParams() {
		this.pieLineData.forEach((pieLine) => {
			this._calculateRadius(pieLine);
			this._setStyles(pieLine, this._style.pieLine);
		});
	}

	/**
	 * Calculates inner and outer radius
	 */
	protected _calculateRadius(pieLine: ChartPieLine) {
		const connectionsCount = pieLine.pie.data.connections.length;

		const innerRadius = this._chartProps.innerRadius;
		const outerRadius = (this._chartProps.maxRadius - innerRadius) * (connectionsCount / this.maxConnectionsCount) + innerRadius;

		pieLine.setRadius(innerRadius, outerRadius);
	}

	/**
	 * Calculates gradient color
	 */
	protected _calculateGradient(pieLine: ChartPieLine) {
		const startColor = this._style.gradient[0];
		const endColor = this._style.gradient[1];

		const color = ColorUtils.gradientStepColor(startColor, endColor, pieLine.pie.index, this.pieLineData.length);
		return color;
	}

	protected _setStyles(pieLine: ChartPieLine, style: PieLineStyle) {
		const color = this._calculateGradient(pieLine);

		const styleN: PieLineStyle = {
			...style,
			color
		};

		pieLine.setStyle(styleN);
	}

}
