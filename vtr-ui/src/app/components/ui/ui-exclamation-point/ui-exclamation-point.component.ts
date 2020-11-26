import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-ui-exclamation-point',
	templateUrl: './ui-exclamation-point.component.html',
	styleUrls: ['./ui-exclamation-point.component.scss'],
})
export class UiExclamationPointComponent implements OnInit {
	@Input() width: number;
	@Input() height: number;
	@Input() color: any;
	constructor() {}

	ngOnInit(): void {}
}
