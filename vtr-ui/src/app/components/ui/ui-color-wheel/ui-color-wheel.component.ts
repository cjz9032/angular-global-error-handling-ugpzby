import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import ReinventedColorWheel from 'reinvented-color-wheel';
import 'reinvented-color-wheel/css/reinvented-color-wheel.css';

@Component({
	selector: 'vtr-ui-color-wheel',
	templateUrl: './ui-color-wheel.component.html',
	styleUrls: ['./ui-color-wheel.component.scss']
})
export class UiColorWheelComponent implements OnInit {
	@ViewChild('colorWheel') canvasElement: ElementRef;
	color: any = [];
	backColor: string = '#FFFFFF';
	@Output() colorChanged = new EventEmitter<any>();
	@Output() colorEffectChanged = new EventEmitter<any>();
	@Input() inRGB:any;
	@Input() inHEX:any;
	@Input() showApply:boolean;
	constructor() { }

	ngOnInit() {
		function set(input, value) {
			if (input !== document.activeElement) {
				input.value = value;
			}
		}
		const that = this;
		// create a new color picker
		const colorWheel = new ReinventedColorWheel({
			// appendTo is the only required property. specify the parent element of the color wheel.
			appendTo: this.canvasElement.nativeElement,

			// followings are optional properties and their default values.

			// initial color (can be specified in hsv / hsl / rgb / hex)
			// hsv: [0, 100, 100],
			// hsl: [0, 100, 50],
			rgb: [255, 0, 0],
			// hex: "#ff0000",

			// appearance
			wheelDiameter: 200,
			wheelThickness: 20,
			handleDiameter: 16,
			wheelReflectsSaturation: false,

			// handler
			onChange: function (color) {
				// the only argument is the ReinventedColorWheel instance itself.
				that.backColor = color.hex;
			//	console.log('color changed in squaere ########################################', JSON.stringify(that.backColor));
				that.color = color.rgb;
				that.colorChanged.emit(this.color);
			}
		});

		// set color in HSV / HSL / RGB / HEX
		colorWheel.rgb = [255, 128, 64];
		colorWheel.hsl = [120, 100, 50];
		colorWheel.hsv = [240, 100, 100];
		colorWheel.hex =this.inHEX ;//'#888888';

		// get color in HSV / HSL / RGB / HEX
		console.log('hsv:', colorWheel.hsv[0], colorWheel.hsv[1], colorWheel.hsv[2]);
		console.log('hsl:', colorWheel.hsl[0], colorWheel.hsl[1], colorWheel.hsl[2]);
		console.log('rgb:', colorWheel.rgb[0], colorWheel.rgb[1], colorWheel.rgb[2]);
		console.log('hex:', colorWheel.hex);

		// please call redraw() after changing some appearance properties.
		colorWheel.wheelDiameter = 240;
		colorWheel.wheelThickness = 30;
		colorWheel.redraw();
	}
	onApplyColorEffect() {
		console.log('apply button clicked......................................');
		this.colorEffectChanged.emit(this.backColor);
	}
}
