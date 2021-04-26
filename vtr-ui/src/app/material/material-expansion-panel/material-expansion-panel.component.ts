import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'vtr-material-expansion-panel',
	templateUrl: './material-expansion-panel.component.html',
	styleUrls: ['./material-expansion-panel.component.scss'],
})
export class MaterialExpansionPanelComponent implements OnInit {
	@Input() headerLevel = 1;
	@Input() collapseLinkId: string;
	@Input() cardTitle: string;
	@Input() panelOpenState = false;
	@Input() theme = 'white';
	@Input() metricsParent: string;

	@Output() toggle = new EventEmitter<boolean>();
	constructor() {}

	ngOnInit(): void {}

	open() {
		this.panelOpenState = true;
		this.toggle.emit(true);
	}

	close() {
		this.panelOpenState = false;
		this.toggle.emit(false);
	}
}
