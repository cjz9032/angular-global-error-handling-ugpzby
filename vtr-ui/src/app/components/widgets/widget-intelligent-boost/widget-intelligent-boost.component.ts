import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'vtr-widget-intelligent-boost',
	templateUrl: './widget-intelligent-boost.component.html',
	styleUrls: ['./widget-intelligent-boost.component.scss']
})
export class WidgetIntelligentBoostComponent implements OnInit {
	@Input() featureToggle: boolean;
	@Input() isEmpty: boolean;
	@Input() isDone = true;

	@Output() editButtonClick = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
	}

	clickEdit(): void {
		this.editButtonClick.emit(!this.isDone);
	}
}
