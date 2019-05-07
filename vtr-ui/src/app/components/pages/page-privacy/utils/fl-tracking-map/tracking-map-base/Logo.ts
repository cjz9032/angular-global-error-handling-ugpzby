import {Transform2, VectorUtils, Vector2} from './Transform';

export class Logo {

	protected _icon: string;

	protected _transform: Transform2;
	protected _pixelSize: number;

	constructor(icon: string, transform: Transform2, pixelSize: number) {
		this._icon = icon;

		this._transform = transform;
		this._pixelSize = pixelSize;
	}

	setPosition(pos: Vector2) {
		this._transform.position = pos;
	}

	get icon() {
		return this._icon;
	}

	get size() {
		return VectorUtils.scalarMultiply(this._transform.scale, this._pixelSize);
	}

	get center() {
		return VectorUtils.scalarDivide(this.size, 2);
	}

	get position() {
		return VectorUtils.vectorDif(this._transform.position, this.center);
	}

	get rawPosition() {
		return this._transform.position;
	}
}
