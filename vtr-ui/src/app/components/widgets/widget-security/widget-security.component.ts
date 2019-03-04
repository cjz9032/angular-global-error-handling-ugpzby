import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-widget-security',
	templateUrl: './widget-security.component.html',
	styleUrls: ['./widget-security.component.scss']
})
export class WidgetSecurityComponent implements OnInit {
	@Input() title: string = this.title || '';
	@Input() subTitle1: string = this.subTitle1 || '';
	@Input() subTitle2: string = this.subTitle2 || '';
	@Input() buttonText: string = this.buttonText || '';
	@Input() percentValue: number = this.percentValue || 100;

	constructor() { }

	ngOnInit() {

	}

	buttonClick() {

	}
}
