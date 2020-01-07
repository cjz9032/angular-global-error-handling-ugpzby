import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { GradientColor } from 'src/app/data-models/security-advisor/gradient-color.model';

@Component({
  selector: 'vtr-widget-svg-circle',
  templateUrl: './widget-svg-circle.component.html',
  styleUrls: ['./widget-svg-circle.component.scss']
})
export class WidgetSvgCircleComponent implements OnInit, DoCheck {
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
		this.oldGradientPercent = this.gradientColor.percent;
		this.oldColor = this.gradientColor.startColor;
	}

	ngDoCheck(): void {
		if (!this.oldGradientPercent || this.gradientColor.percent !== this.oldGradientPercent) {
			this.oldGradientPercent = this.gradientColor.percent;
			this.updateStatus();
		}
	}

	updateStatus() {
		if (this.gradientColor) {
			const sameColor = this.oldColor === this.gradientColor.startColor;
			const startColor = this.gradientColor.startColor;
			const endColor = this.gradientColor.endColor;
			const colorStep = this.colorStep;
			const colorArr = sameColor && this.gradientColorArr.length > 0 ? this.gradientColorArr : this.gradient(startColor, endColor, colorStep);

			const circleSvg = document.getElementById('score-circle');
			const lineTags = document.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'rect') ? document.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'rect') : [];

			if (lineTags && lineTags.length > 0) {
				for (let i = lineTags.length - 1; i >= 0; i--) {
					lineTags[i].setAttribute('fill', this.fill);
				}
			} else {
				const myLine = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
				myLine.setAttribute('width', this.width);
				myLine.setAttribute('height', this.height);
				myLine.setAttribute('fill', this.fill);
				myLine.setAttribute('transform', 'rotate(0,0,113)');
				myLine.setAttribute('filter', 'url(#f1)');

				const els = 100;
				const step = 360 / els;
				for (let i = 0; i < els; i++) {
					lineTags[i] = myLine.cloneNode(true);
					lineTags[i].setAttribute('transform', 'rotate(' + Number(i * step) + ',0,113)');
					circleSvg.appendChild(lineTags[i]);
				}

			}
			const percent = this.gradientColor.percent > 0 ? this.gradientColor.percent : 100;
			for (let i = 0; i <= percent; i++) {
				if (lineTags[i]) {
					lineTags[i].setAttribute('fill', colorArr[i]);
				}
			}
		}
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
