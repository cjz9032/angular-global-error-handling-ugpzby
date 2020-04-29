import { Component, EventEmitter, Input, Output } from '@angular/core';
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
	@Input() tabIndex = 0;
	@Input() headerLevel : number;

	constructor() {
		super();
	}

	ngAfterViewInit(): void {
		if(this.headerLevel && this.headerLevel>0){
			const domHeaderLevel = document.getElementById(this.collapseLinkId+'-collapse-card-title')
			domHeaderLevel.setAttribute('aria-level', this.headerLevel.toString());
		}
	}
	
	public onToggle() {
		this.isCollapsed = !this.isCollapsed;
		this.toggle.emit(this.isCollapsed);
	}

}
