import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
	selector: 'vtr-ui-lighting-color-wheel',
	templateUrl: './ui-lighting-color-wheel.component.html',
	styleUrls: ['./ui-lighting-color-wheel.component.scss']
})
export class UiLightingColorWheelComponent implements OnInit {

	public color = 'rgb(144,255,0)';
	public pickerContainerWidth = 0;
	public showPicker = false;

	red = 144;
	green = 255;
	blue = 0;

	@ViewChild('pickerContainer', { static: true }) pickerContainer: ElementRef;

	constructor() { }

	ngOnInit() {
		this.updateWheelContainerWidth();
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.updateWheelContainerWidth();
	}

	updateWheelContainerWidth() {
		this.showPicker = false;
		this.pickerContainerWidth = this.pickerContainer.nativeElement.offsetWidth;
		const self = this;
		const delay = setTimeout(function () {
			self.showPicker = true;
		}, 500);
		// console.log('WHEEL CONTAINER WIDTH', this.pickerContainerWidth);
	}

	colorChanged(event) {
		// console.log('COLOR CHANGED', event);
		const colors = event.replace('rgb(', '').replace(')', '').split(',');
		this.red = parseInt(colors[0]);
		this.green = parseInt(colors[1]);
		this.blue = parseInt(colors[2]);
		// console.log('COLORS SET', this.red, this.green, this.blue);
	}

}
