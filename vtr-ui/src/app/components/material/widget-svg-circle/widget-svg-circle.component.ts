import { Component, OnInit, Input, DoCheck, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { GradientColor } from 'src/app/data-models/security-advisor/gradient-color.model';
import * as d3 from 'd3-selection';

@Component({
	selector: 'vtr-widget-svg-circle',
	templateUrl: './widget-svg-circle.component.html',
	styleUrls: ['./widget-svg-circle.component.scss']
})
export class WidgetSvgCircleComponent implements OnInit, DoCheck, AfterViewChecked {
	@Input() gradientColor: GradientColor;
	@Input() colorStep = 100;
	@Input() fill = '#2F3447';
	@Input() width = '3.5';
	@Input() height = '16';
	oldGradientPercent: number;
	oldColor: string;
	gradientColorArr = [];

	ngOnInit() {
		this.updateStatus();
		if (this.gradientColor) {
			this.oldGradientPercent = this.gradientColor.percent;
			this.oldColor = this.gradientColor.startColor;
		}
	}

	ngDoCheck(): void {
		if (this.gradientColor) {
			if (this.gradientColor.percent !== this.oldGradientPercent || this.gradientColor.startColor !== this.oldColor) {
				this.oldGradientPercent = this.gradientColor.percent;
				this.updateStatus();
			}
		}
	}

	ngAfterViewChecked() {
		const lineTags = d3.selectAll('rect').size();
		if (lineTags === 0) {
			this.updateStatus();
		}
	}

	updateStatus() {
		if (this.gradientColor) {
			const els = 100;
			const step = 360 / els;
			const circleSvg = d3.select('#score-circle');
			const lineTags = d3.selectAll('rect').size();
			if (lineTags > 0) {
				d3.selectAll('rect').attr('fill', this.fill)
					.attr('class', 'line-tag');
				this.fillColor();
			} else {
				for (let i = 0; i < els; i++) {
					circleSvg.append('rect')
						.attr('width', this.width)
						.attr('height', this.height)
						.attr('fill', this.fill)
						.attr('transform', 'rotate(' + Number(i * step) + ',0,113)');
				}
				this.fillColor();
			}
		}
	}

	fillColor() {
		const percent = this.gradientColor.percent >= 0 ? this.gradientColor.percent : 0;
		const sameColor = this.oldColor === this.gradientColor.startColor;
		const startColor = this.gradientColor.startColor;
		const endColor = this.gradientColor.endColor;
		const colorStep = this.colorStep;
		const colorArr = sameColor && this.gradientColorArr.length > 0 ? this.gradientColorArr : this.gradient(startColor, endColor, colorStep);

		d3.selectAll('rect').attr('fill', ((d, i) => {
			return i < percent ? colorArr[i] : this.fill;
		})).attr('class', ((d, i) => {
			return i < percent ? 'line-tag-fill line-tag' : 'line-tag';
		}));
	}

	rgbToHex(r: number, g: number, b: number) {
		const hex = ((r * Math.pow(2, 16)) + (g * Math.pow(2, 8)) + b).toString(16);
		return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
	}

	hexToRgb(hex: string) {
		const rgb = [];
		for (let i = 1; i < 7; i += 2) {
			rgb.push(parseInt(`0x${hex.slice(i, i + 2)}`, 16));
		}
		return rgb;
	}

	gradient(startColor: string, endColor: string, step: number) {
		this.oldColor = startColor;
		this.gradientColorArr = [];
		const sColor = this.hexToRgb(startColor);
		const eColor = this.hexToRgb(endColor);

		const rStep = (eColor[0] - sColor[0]) / step;
		const gStep = (eColor[1] - sColor[1]) / step;
		const bStep = (eColor[2] - sColor[2]) / step;

		for (let i = 0; i < step; i++) {
			this.gradientColorArr.push(this.rgbToHex(parseInt(rStep * i + sColor[0], 10), parseInt(gStep * i + sColor[1], 10), parseInt(bStep * i + sColor[2], 10)));
		}
		return this.gradientColorArr;
	}

}
