import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-widget-reboot',
	templateUrl: './widget-reboot.component.html',
	styleUrls: ['./widget-reboot.component.scss']
})
export class WidgetRebootComponent implements OnInit {
	@Output() rebootClick = new EventEmitter<any>();
	@Output() dismissClick = new EventEmitter<any>();
	constructor() { }

	ngOnInit() {
	}

	onRebootClick($event) {
		this.rebootClick.emit($event);
	}

	onDismissClick($event) {
		this.dismissClick.emit($event);
	}
}
