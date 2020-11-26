import { Component, Input, OnDestroy } from '@angular/core';
import { Gradient } from 'src/app/data-models/security-advisor/gradient-color.model';
import * as d3 from 'd3-selection';

@Component({
	selector: 'vtr-material-svg-circle',
	templateUrl: './material-svg-circle.component.html',
	styleUrls: ['./material-svg-circle.component.scss'],
})
export class MaterialSvgCircleComponent implements OnDestroy {
	@Input() colorStep = 100;
	@Input() fill = '#2F3447';
	@Input() width = '3.5';
	@Input() height = '16';

	private gradientColorArr = [];

	@Input() set gradientColor(gradientColor: Gradient) {
		const els = 100;
		const step = 360 / els;
		const circleSvg = d3.select('#score-circle');
		const lineTags = d3.selectAll('rect').size();
		if (lineTags > 0) {
			d3.selectAll('rect')
				.attr('fill', this.fill)
				.attr('class', 'high-contrast-fill-important');
		} else {
			for (let i = 0; i < els; i++) {
				circleSvg
					.append('rect')
					.attr('width', this.width)
					.attr('height', this.height)
					.attr('fill', this.fill)
					.attr('transform', 'rotate(' + Number(i * step) + ',0,113)');
			}
		}
		this._fillColor(gradientColor.startColor, gradientColor.endColor, gradientColor.percent);
	}

	get gradientColor() {
		return this.gradientColor;
	}

	ngOnDestroy(): void {
		d3.selectAll('rect').remove();
	}

	_fillColor(startColor: string, endColor: string, percent: number) {
		const colorStep = this.colorStep;
		const colorArr = this._gradient(startColor, endColor, colorStep);

		d3.selectAll('rect')
			.attr('fill', (d, i) => {
				return i < percent ? colorArr[i] : this.fill;
			})
			.attr('class', (d, i) => {
				return i < percent
					? 'high-contrast-fill-reverse-important'
					: 'high-contrast-fill-important';
			});
	}

	_rgbToHex(r: number, g: number, b: number) {
		const hex = (r * Math.pow(2, 16) + g * Math.pow(2, 8) + b).toString(16);
		return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
	}

	_hexToRgb(hex: string) {
		const rgb = [];
		for (let i = 1; i < 7; i += 2) {
			rgb.push(parseInt(`0x${hex.slice(i, i + 2)}`, 16));
		}
		return rgb;
	}

	_gradient(startColor: string, endColor: string, step: number) {
		this.gradientColorArr = [];
		const sColor = this._hexToRgb(startColor);
		const eColor = this._hexToRgb(endColor);

		const rStep = (eColor[0] - sColor[0]) / step;
		const gStep = (eColor[1] - sColor[1]) / step;
		const bStep = (eColor[2] - sColor[2]) / step;

		for (let i = 0; i < step; i++) {
			this.gradientColorArr.push(
				this._rgbToHex(
					parseInt(rStep * i + sColor[0], 10),
					parseInt(gStep * i + sColor[1], 10),
					parseInt(bStep * i + sColor[2], 10)
				)
			);
		}
		return this.gradientColorArr;
	}
}
