import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-container-collapsible',
	templateUrl: './container-collapsible.component.html',
	styleUrls: ['./container-collapsible.component.scss']
})
export class ContainerCollapsibleComponent implements OnInit {

	@Input() title: string;

	isCollapsed: boolean = false;

	constructor() { }
	
	ngOnInit() {
	}


}
