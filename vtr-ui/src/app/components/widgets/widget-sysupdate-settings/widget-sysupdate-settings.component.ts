import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-sysupdate-settings',
	templateUrl: './widget-sysupdate-settings.component.html',
	styleUrls: ['./widget-sysupdate-settings.component.scss']
})
export class WidgetSysupdateSettingsComponent implements OnInit {

	@Input() title: string;
	@Input() description: string;
	@Input() items: any[];

	constructor() {
	}

	ngOnInit() {
	}
}

