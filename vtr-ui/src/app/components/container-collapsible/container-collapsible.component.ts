import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-container-collapsible',
	templateUrl: './container-collapsible.component.html',
	styleUrls: ['./container-collapsible.component.scss']
})
export class ContainerCollapsibleComponent implements OnInit {
	@Input() cardTitle: string;
	@Input() isCollapsed: boolean = true;
	@Input() allowCollapse: boolean = true;
	@Input() theme: string = 'white';

	constructor() { }

	ngOnInit() {
	}
}
