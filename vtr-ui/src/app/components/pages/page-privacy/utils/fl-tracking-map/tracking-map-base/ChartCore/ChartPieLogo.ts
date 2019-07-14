import {ChartProps} from '.';
import {ChartPieLine} from './ChartPieLine';
import {Logo} from '../Logo';
import {VectorUtils, Transform2} from '../Transform';

export class ChartPieLogo {

	private _logo: Logo;

	protected _pieLine: InstanceType<typeof ChartPieLine>;
	protected _chartProps: ChartProps;

	constructor(pieLine: InstanceType<typeof ChartPieLine>, chartProps: ChartProps) {
		const size = (typeof pieLine !== 'undefined') ? pieLine.pie.data.size : 0;

		const transform: Transform2 = {
			position: VectorUtils.ZeroVector(),
			scale: {x: size, y: size},
		};

		this._logo = (typeof pieLine !== 'undefined')
			? new Logo(pieLine.pie.data.icon, transform, chartProps.logoSizePx)
			: undefined;

		this._pieLine = pieLine;
		this._chartProps = chartProps;
	}

	setLogoPosition() {
		if (typeof this._pieLine === 'undefined') {
			return;
		}

		const pos = this._pieLine.getArcFixedOffset(this._chartProps.logoOffset);
		this._logo.setPosition(pos);
	}

	get icon() {
		if (typeof this._logo === 'undefined') {
			return '';
		}

		return this._logo.icon;
	}

	get size() {
		if (typeof this._logo === 'undefined') {
			return VectorUtils.ZeroVector();
		}

		return this._logo.size;
	}

	get position() {
		if (typeof this._logo === 'undefined') {
			return VectorUtils.ZeroVector();
		}

		this.setLogoPosition();
		return this._logo.position;
	}

	get rawPosition() {
		if (typeof this._logo === 'undefined') {
			return VectorUtils.ZeroVector();
		}

		this.setLogoPosition();
		return this._logo.rawPosition;
	}
}

export const ChartPieLogo_NULL = new ChartPieLogo(undefined, undefined);
