import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'vtr-widget-offline-info',
	templateUrl: './widget-offline-info.component.html',
	styleUrls: ['./widget-offline-info.component.scss']
})
export class WidgetOfflineInfoComponent implements OnInit {
	@Input() title: string;
	@Input() subtitle: string;
	@Input() isButtonVisible = false;
	@Input() buttonText: string;
	@Input() isSubtitleVisible = false;
	@Input() offlineConnection: string;
 	@Output() buttonClick = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	public onConnectivityClick($event: any) {
		this.buttonClick.emit($event);
	}
}
