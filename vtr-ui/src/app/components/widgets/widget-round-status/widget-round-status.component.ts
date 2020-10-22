import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SystemState } from 'src/app/enums/system-state.enum';

@Component({
	selector: 'vtr-widget-round-status',
	templateUrl: './widget-round-status.component.html',
	styleUrls: ['./widget-round-status.component.scss']
})


export class WidgetRoundStatusComponent implements OnInit {
	stateClass = {
		[SystemState.Loading]: 'round-box-loading',
		[SystemState.GoodCondition]: 'round-box-good-condition',
		[SystemState.NeedMaintenance]: 'round-box-need-maintenance',
	};
	SystemState = SystemState;

	@Input() statusText = 'GOOD CONDITION';
	@Input() status: any;
	@Input() statusId =  '';
	@Output() clickAction = new EventEmitter<any>();

	constructor() { }

	ngOnInit(): void {
	}

	onClick($event) {
		this.clickAction.emit($event);
	}

}
