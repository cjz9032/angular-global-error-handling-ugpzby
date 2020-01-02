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
	@Input() stroke = '#2F3447';
	@Input() strokeWidth = '4';
	oldGradientPercent: number;

	ngOnInit() {
		this.updateStatus();
		this.oldGradientPercent = this.gradientColor.percent;
	}

	ngDoCheck(): void {
		if (!this.oldGradientPercent || this.gradientColor.percent !== this.oldGradientPercent) {
			this.oldGradientPercent = this.gradientColor.percent;
			this.updateStatus();
		}
	}

	updateStatus() {
		if (this.gradientColor) {
			const startColor = this.gradientColor.startColor;
			const endColor = this.gradientColor.endColor;
			const colorStep = this.colorStep;
			const colorArr = this.gradient(startColor, endColor, colorStep);

			const circleSvg = document.getElementById('score-circle');
			const lineTags = document.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'line') ? document.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'line') : [];

			if (lineTags && lineTags.length > 0) {
				for (let i = lineTags.length - 1; i >= 0; i--) {
					lineTags[i].setAttribute('stroke', this.stroke);
				}
			} else {
				const myLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
				myLine.setAttribute('class', 'line');
				myLine.setAttribute('x1', '120');
				myLine.setAttribute('y1', '5');
				myLine.setAttribute('x2', '120');
				myLine.setAttribute('y2', '23');
				myLine.setAttribute('stroke', this.stroke);
				myLine.setAttribute('stroke-width', this.strokeWidth);
				myLine.setAttribute('transform', 'rotate(0,120,120)');

				const els = 100;
				const step = 360 / els;
				for (let i = 0; i < els; i++) {
					lineTags[i] = myLine.cloneNode(true);
					lineTags[i].setAttribute('transform', 'rotate(' + i * step + ',120,120)');
					circleSvg.appendChild(lineTags[i]);
				}

			}
			const percent = this.gradientColor.percent > 0 ? this.gradientColor.percent : 100;
			for (let i = 0; i <= percent; i++) {
				if (lineTags[i]) {
					lineTags[i].setAttribute('stroke', colorArr[i]);
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
		const sColor = this.hexToRgb(startColor);
		const eColor = this.hexToRgb(endColor);

		const rStep = (eColor[0] - sColor[0]) / step;
		const gStep = (eColor[1] - sColor[1]) / step;
		const bStep = (eColor[2] - sColor[2]) / step;

		const gradientColorArr = [];
		for (let i = 0; i < step; i++) {
			gradientColorArr.push(this.rgbToHex(parseInt(rStep * i + sColor[0], 10), parseInt(gStep * i + sColor[1], 10), parseInt(bStep * i + sColor[2], 10)));
		}
		return gradientColorArr;
	}

}
