import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	ElementRef,
	HostListener,
} from '@angular/core';
import { LightingDataList } from 'src/app/data-models/gaming/lighting-new-version/lighting-data-list';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-ui-color-picker',
	templateUrl: './ui-color-picker.component.html',
	styleUrls: ['./ui-color-picker.component.scss'],
})
export class UiColorPickerComponent implements OnInit, OnChanges {
	@Input() isColorPicker: boolean;
	@Input() color: any;
	@Output() isToggleColorPicker = new EventEmitter<any>();
	@Output() setColor = new EventEmitter<any>();
	@Input() automationId: any;
	public isToggleMoreColor = false;
	public presetColorList: any = LightingDataList.presetColorListData;
	public isSliderOut: boolean;
	public clickEvent: any = { target: '' };
	public isFirstTrigger: boolean;

	constructor(private elementRef: ElementRef, private logger: LoggerService) {
		if (document.getElementById('menu-main-btn-navbar-toggler')) {
			document
				.getElementById('menu-main-btn-navbar-toggler')
				.addEventListener('click', (event) => {
					this.generalClick(event);
				});
		}
	}

	@HostListener('window:resize', ['$event']) onResize($event) {
		this.isColorPicker = false;
		this.isToggleColorPicker.emit(this.isColorPicker);
	}

	@HostListener('document:click', ['$event'])
	public generalClick(event: Event) {
		this.clickEvent = event;
		this.isFirstTrigger = true;
		if (this.elementRef.nativeElement) {
			if (!this.elementRef.nativeElement.contains(event.target)) {
				setTimeout(() => {
					if (this.isSliderOut) {
						this.isColorPicker = true;
						this.isSliderOut = false;
					} else {
						this.isColorPicker = false;
						this.isToggleColorPicker.emit(this.isColorPicker);
					}
				}, 50);
			}
		}
	}

	ngOnInit() {
		this.color = this.colorToUpperCase(this.color);
		this.presetColorList.forEach((element, index) => {
			if (this.color === element.color) {
				this.presetColorList[index].isChecked = true;
			}
		});
	}

	ngOnChanges(changes) {}

	public colorChange(index, flag) {
		if (flag === true) {
			this.isColorPicker = false;
			this.isToggleColorPicker.emit(this.isColorPicker);
		} else {
			this.isColorPicker = true;
			(document.querySelector('.ui-color-picker') as HTMLElement).focus();
		}
		this.presetColorList.forEach((element) => {
			element.isChecked = false;
		});
		this.presetColorList[index].isChecked = true;
		this.setColor.emit(this.presetColorList[index].color);
	}

	// apply
	public colorPickerSelectFun() {
		this.setColor.emit(this.color);
		this.isColorPicker = false;
		this.isToggleColorPicker.emit(this.isColorPicker);
	}

	// cancel
	public colorPickerCancelFun() {
		this.isColorPicker = false;
		this.isToggleColorPicker.emit(this.isColorPicker);
	}

	public moreColorFun(type) {
		if (type === 1) {
			this.isToggleMoreColor = false;
		} else {
			this.isToggleMoreColor = true;
		}
	}

	public colorPickerChangeFun(event) {
		this.logger.info('event: ', event);
		this.color = this.rgbToHex(event);
	}

	public colorPresetFun() {
		this.isColorPicker = true;
	}

	public rgbToHex(color) {
		let value;
		const arr = color.split(',');
		const r = +arr[0].split('(')[1];
		const g = +arr[1];
		const b = +arr[2].split(')')[0];
		value = (1 << 24) + r * (1 << 16) + g * (1 << 8) + b;
		value = value.toString(16);
		return value.slice(1);
	}

	public cpSliderDragEndFun(event) {
		this.logger.info('slıder: ', event);
		if (this.clickEvent.target !== '') {
			if (this.elementRef.nativeElement) {
				if (
					!this.elementRef.nativeElement.contains(this.clickEvent.target) &&
					this.isFirstTrigger
				) {
					this.isSliderOut = true;
					this.isFirstTrigger = false;
				}
			}
		}
	}

	public colorToUpperCase(color) {
		let newColor = '';
		color.split('').forEach((element) => {
			newColor += element.toUpperCase();
		});
		return newColor;
	}
}
