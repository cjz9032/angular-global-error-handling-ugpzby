import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-header-main',
	templateUrl: './header-main.component.html',
	styleUrls: ['./header-main.component.scss']
})
export class HeaderMainComponent implements OnInit {

	@Input() title: string;
	@Input() back: string;
	@Input() backarrow: string;
	@Input() forwardLink: { path: string, label: string };
	@Input() menuItems: any[];

	constructor() { }

	ngOnInit() {
	}
	 goBack() {
		window.history.back();
	  }
}
