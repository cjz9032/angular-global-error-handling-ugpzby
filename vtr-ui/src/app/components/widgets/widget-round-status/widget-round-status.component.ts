import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'vtr-widget-round-status',
	templateUrl: './widget-round-status.component.html',
	styleUrls: ['./widget-round-status.component.scss']
})


export class WidgetRoundStatusComponent implements OnInit {
	LOADING = 0;
	GOOD_CONDITION = 1;
	NEED_MAINTENANCE = 2;

	@Input() statusText = 'GOOD CONDITION';
	@Input() status: any;
	@Output() clickAction = new EventEmitter<any>();

	constructor() { }

	ngOnInit(): void {

	}

	getStatusClass() {
		if (this.status === this.GOOD_CONDITION) {
			return 'round-box-good-condition';
		}

		if (this.status === this.NEED_MAINTENANCE) {
			return 'round-box-need-maintenance';
		}

		if (this.status === this.LOADING) {
			return 'round-box-loading';
		}
	}

	isLoading(){
		return this.status === this.LOADING;
	}

	onClick($event){
		this.clickAction.emit($event);
	}

}
