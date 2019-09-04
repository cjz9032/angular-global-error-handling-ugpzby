import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-settings-page-layout',
	templateUrl: './settings-page-layout.component.html',
	styleUrls: ['./settings-page-layout.component.scss']
})
export class SettingsPageLayoutComponent implements OnInit {

	@Input() pageTitle: string;
	@Input() textId: string;
	@Input() pageCssClass: string;
	@Input() parentPath: string;
	@Input() backLinkText: string;
	@Input() menuItems: any[];

	constructor() { }

	ngOnInit() {
	}

}
