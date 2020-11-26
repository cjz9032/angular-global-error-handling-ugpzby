import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-base',
	templateUrl: './base.component.html',
	styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
	@HostBinding('attr.data-component')
	@Input()
	public componentName: string;

	constructor() {}
}
