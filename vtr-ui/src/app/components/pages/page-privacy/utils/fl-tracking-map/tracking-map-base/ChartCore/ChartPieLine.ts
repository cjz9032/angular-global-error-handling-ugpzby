import * as d3 from 'd3';

import { ChartProps } from './index';
import { Color, ColorUtils } from '../Color';
import { defaultGlobalTextStyle, TextStyle } from '../Text';
import { VectorUtils } from '../Transform';
import { ChartPieLogo, ChartPieLogo_NULL } from './ChartPieLogo';

export interface DotStyle {
	color: string;
	size: number;

	opacity: number;
}

export const defaultDotStyle: DotStyle = {
	color: '#FE5050',
	size: 3,

	opacity: 1,
};

export interface LineStyle {
	color: string;
	strokeSize: number;
	dashes: string;

	opacity: number;
}

export const defaultLineStyle: LineStyle = {
	color: '#FFE2E2',
	strokeSize: 1,
	dashes: '3, 3',

	opacity: 1,
};

export const defaultTextStyle: TextStyle = {
	...defaultGlobalTextStyle,

	color: '#7C8696',
	className: 'map-chart-line-label',
};

export interface PieLineStyle {
	line: LineStyle;
	dot: DotStyle;
	text: TextStyle;

	opacity: number;
	color: Color;

	hidden: boolean;
}

export const defaultPieLineStyle: PieLineStyle = {
	line: { ...defaultLineStyle },
	dot: { ...defaultDotStyle },
	text: { ...defaultTextStyle },

	hidden: false,

	opacity: 1,
	color: ColorUtils.getZeroColor(),
};

export class ChartPieLine {

	logo: InstanceType<typeof ChartPieLogo>;

	style: PieLineStyle;

	pie: any;
	protected _chartProps: ChartProps;

	totalSegments: number;

	constructor(pie: any, chartProps: ChartProps, style: PieLineStyle = { ...defaultPieLineStyle }) {
		this.pie = pie;

		this.logo = (typeof chartProps !== 'undefined') ? new ChartPieLogo(this, chartProps) : ChartPieLogo_NULL;

		this._chartProps = chartProps;
		this.style = style;
	}

	protected get _d3Arc() {
		return d3.arc()
			.innerRadius(this._chartProps.innerRadius)
			.outerRadius(d => d.outerRadius);
	}

	protected get _d3ArcFull() {
		const len = this._chartProps.maxRadius + this._chartProps.logoOffset + this._chartProps.logoSizePx / 2;
		return d3.arc()
			.innerRadius(this._chartProps.innerRadius)
			.outerRadius(len);
	}

	get textHitbox() {
		const { text, x, y } = this.text;
		const width = 10 * text.length;
		const height = 20;
		return { x, y: (y as number) - height / 2, width, height };
	}

	get arcCenter() {
		if (typeof this.pie === 'undefined') {
			return VectorUtils.ZeroVector();
		}

		const r = this.pie.outerRadius;

		return {
			x: Math.cos(this.angle) * r,
			y: Math.sin(this.angle) * r
		};
	}

	get text() {
		if (typeof this.pie === 'undefined') {
			return { text: '', x: -100, y: 0 };
		}

		const h = (this.pie.index === 0) ? 0 : 2;
		const len = h / Math.cos(this.angle);

		return {
			...this.getArcFixedOffset(this._chartProps.logoOffset, len + 20),
			text: this.pie.data.name,
		};
	}

	get angle() {
		return (this.pie.startAngle + this.pie.endAngle) / 2 - Math.PI / 2;
	}

	get color() {
		return ColorUtils.toRGBString(this.style.color);
	}

	get path() {
		if (typeof this.pie === 'undefined') {
			return '';
		}
		return this._d3Arc(this.pie);
	}

	get pathFull() {
		if (typeof this.pie === 'undefined') {
			return '';
		}
		return this._d3ArcFull(this.pie);
	}

	getArcFixedOffset(len = 0, fixed = 0) {
		if (typeof this.pie === 'undefined') {
			return VectorUtils.ZeroVector();
		}

		const min = this._chartProps.minDistance;

		const dist = this.pie.outerRadius + len;
		const d = (dist <= min) ? min : dist;

		const r = d + fixed;

		return {
			x: Math.cos(this.angle) * r,
			y: Math.sin(this.angle) * r
		};
	}

	setRadius(innerRadius, outerRadius) {
		if (typeof this.pie === 'undefined') {
			return;
		}

		this.pie.innerRadius = innerRadius;
		this.pie.outerRadius = outerRadius;
	}

	setStyle(style: PieLineStyle) {
		this.style = {
			...this.style,
			...style
		};
	}

}

export const ChartPieLine_NULL = new ChartPieLine(undefined, undefined, { ...defaultPieLineStyle, hidden: true, opacity: 0 });
