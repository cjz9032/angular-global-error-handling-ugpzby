import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
	selector: 'vtr-container-collapsible',
	templateUrl: './container-collapsible.component.html',
	styleUrls: ['./container-collapsible.component.scss'],
	exportAs: 'containerCollapisble'
})
export class ContainerCollapsibleComponent extends BaseComponent {
	@Input() cardTitle: string;
	@Input() isCollapsed = true;
	@Input() allowCollapse = true;
	@Input() theme = 'white';
	@Input() collapseLinkId: string;
	@Output() toggle = new EventEmitter();
	@Input() metricsParent: string;
	constructor() {
		super();
	}

	public onToggle() {
		this.isCollapsed = !this.isCollapsed;
		this.toggle.emit(this.isCollapsed);
	}

}
