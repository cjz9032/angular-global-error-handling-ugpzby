import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-ui-lighting-color-wheel',
	templateUrl: './ui-lighting-color-wheel.component.html',
	styleUrls: ['./ui-lighting-color-wheel.component.scss']
})
export class UiLightingColorWheelComponent implements OnInit {

	public color: string = "#127bdc";

	constructor() { }

	ngOnInit() {
	}

}
