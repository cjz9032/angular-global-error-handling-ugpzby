import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import ReinventedColorWheel from 'reinvented-color-wheel';
import 'reinvented-color-wheel/css/reinvented-color-wheel.css';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isUndefined } from 'util';

@Component({
	selector: 'vtr-ui-color-wheel',
	templateUrl: './ui-color-wheel.component.html',
	styleUrls: ['./ui-color-wheel.component.scss']
})
export class UiColorWheelComponent implements OnInit, OnChanges {

	@ViewChild('colorWheel') canvasElement: ElementRef;
	color: any = [255, 0, 0];
	backColor: String = '#ff0000';
	@Output() colorChanged = new EventEmitter<any>();
	@Output() colorEffectChanged = new EventEmitter<any>();
	@Input() inRGB: any;
	@Input() inHEX: any;
	@Input() showApply: boolean;
	@Input() showOverlay: boolean;
	colorWheel: any;

	constructor() { }

	ngOnInit() {
		const that = this;
		this.colorWheel = new ReinventedColorWheel({
			appendTo: this.canvasElement.nativeElement,
			rgb: [255, 0, 0],

			wheelDiameter: 200,
			wheelThickness: 20,
			handleDiameter: 16,
			wheelReflectsSaturation: false,

			onChange: function (color) {
				that.backColor = color.hex;
				that.color = color.rgb;
				that.colorChanged.emit(this.color);
			}
		});

		this.colorWheel.rgb = this.color;
		this.colorWheel.redraw();
	}
	ngOnChanges(changes) {
		if (!isUndefined(changes.inHEX)) {
			if (changes.inHEX.previousValue !== changes.inHEX.currentValue) {
				this.inHEX = changes.inHEX.currentValue;
				//this.colorWheel.hex = this.inHEX;
				this.color = this.convertHex('#' + this.inHEX);
				this.colorWheel.rgb = this.color;
				this.colorWheel.redraw();
			}
		}
	}

	onApplyColorEffect(backColor) {
		console.log('apply button clicked......................................');
		this.colorEffectChanged.emit(backColor);
	}

	rgbChanged() {
		this.colorWheel.rgb = this.color;
		this.colorWheel.redraw();
	}
	public convertHex(hex) {
		hex = hex.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		return '[' + r + ', ' + g + ', ' + b + ']';

	}
	public hexToRgb(hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function (m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
}
