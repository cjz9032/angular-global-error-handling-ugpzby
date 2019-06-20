import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import ReinventedColorWheel from 'reinvented-color-wheel';
import 'reinvented-color-wheel/css/reinvented-color-wheel.css';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'vtr-ui-color-wheel',
	templateUrl: './ui-color-wheel.component.html',
	styleUrls: [ './ui-color-wheel.component.scss' ]
})
export class UiColorWheelComponent implements OnInit {
	@ViewChild('colorWheel') canvasElement: ElementRef;
	color: any = [ 255, 0, 0 ];
	backColor: String = '#ff0000';
	@Output() colorChanged = new EventEmitter<any>();
	@Output() colorEffectChanged = new EventEmitter<any>();
	@Input() inRGB: any;
	@Input() inHEX: any;
	@Input() showApply: boolean;
	@Input() showOverlay: boolean;
	colorWheel: any;

	constructor(private _fb: FormBuilder) {}

	ngOnInit() {
		const that = this;
		this.colorWheel = new ReinventedColorWheel({
			appendTo: this.canvasElement.nativeElement,
			rgb: [ 255, 0, 0 ],

			wheelDiameter: 200,
			wheelThickness: 20,
			handleDiameter: 16,
			wheelReflectsSaturation: false,

			onChange: function(color) {
				that.backColor = color.hex;
				that.color = color.rgb;
				that.colorChanged.emit(this.color);
			}
		});

		this.colorWheel.rgb = this.color;
		this.colorWheel.redraw();
	}

	onApplyColorEffect(backColor) {
		console.log('apply button clicked......................................');
		this.colorEffectChanged.emit(backColor);
	}

	rgbChanged() {
		this.colorWheel.rgb = this.color;
		this.colorWheel.redraw();
	}
}
