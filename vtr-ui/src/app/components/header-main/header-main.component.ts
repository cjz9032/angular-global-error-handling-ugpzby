import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-header-main',
	templateUrl: './header-main.component.html',
	styleUrls: ['./header-main.component.scss']
})
export class HeaderMainComponent implements OnInit {

	@Input() title: string;
	@Input() forwardLink: { path: string, label: string };

	constructor() { }

	ngOnInit() {
	}

}
