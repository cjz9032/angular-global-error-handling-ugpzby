import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	EventEmitter,
	Output,
	Input,
	OnChanges,
} from '@angular/core';
import ReinventedColorWheel from 'reinvented-color-wheel';
import 'reinvented-color-wheel/css/reinvented-color-wheel.css';
import { isUndefined } from 'util';
import { ColorWheelStatus } from './../../../enums/color-wheel-status.enum';

@Component({
	selector: 'vtr-ui-color-wheel',
	templateUrl: './ui-color-wheel.component.html',
	styleUrls: ['./ui-color-wheel.component.scss'],
})
export class UiColorWheelComponent implements OnInit, OnChanges {
	colorWheelStatus = ColorWheelStatus;
	@ViewChild('colorWheel', { static: true }) canvasElement: ElementRef;
	color: any = [255, 0, 0];
	backColor: String = '#ff0000';
	@Output() colorChanged = new EventEmitter<any>();
	@Output() colorEffectChanged = new EventEmitter<any>();
	@Input() inRGB: any;
	@Input() inHEX: any;
	@Input() btnStatus: string = this.colorWheelStatus.apply;
	@Input() showOverlay: Boolean;
	@Input() defaultLang: any;
	@Input() automationId: string;
	colorWheel: any;

	constructor() {}

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
				that.btnStatus = that.colorWheelStatus.apply;
				that.colorChanged.emit(color);
			},
		});

		this.colorWheel.rgb = this.color;
		this.colorWheel.redraw();
		this.colorWheel.hex = '#' + this.inHEX;
		this.colorWheel.redraw();
	}

	ngOnChanges(changes) {
		if (!isUndefined(changes.inHEX)) {
			if (changes.inHEX.previousValue !== changes.inHEX.currentValue) {
				this.inHEX = changes.inHEX.currentValue;
				if (!isUndefined(this.colorWheel)) {
					this.colorWheel.hex = '#' + this.inHEX;
					this.colorWheel.redraw();
				}
			}
		}
		if (!isUndefined(changes.btnStatus)) {
			if (changes.btnStatus.previousValue !== changes.btnStatus.currentValue) {
				this.btnStatus = changes.btnStatus.currentValue;
			}
		}
	}

	onApplyColorEffect(backColor) {
		this.colorEffectChanged.emit(backColor);
	}

	rgbChanged() {
		this.colorWheel.rgb = this.color;
		this.colorWheel.redraw();
	}

	validateInput(event: any) {
		const charCode = event.which ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	}

	checkEmpty(event: any) {
		event.target.value = event.target.value === '' ? 0 : event.target.value;
	}
}
