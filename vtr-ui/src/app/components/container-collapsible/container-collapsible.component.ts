import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from "../base/base.component";

@Component({
	selector: 'vtr-container-collapsible',
	templateUrl: './container-collapsible.component.html',
	styleUrls: ['./container-collapsible.component.scss'],
	exportAs: 'containerCollapisble'
})
export class ContainerCollapsibleComponent extends BaseComponent {
	@Input() cardTitle: string;
	@Input() isCollapsed: boolean = true;
	@Input() allowCollapse: boolean = true;
	@Input() theme: string = 'white';


	constructor() {
		super();
	}


}
