import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-available-updates',
	templateUrl: './available-updates.component.html',
	styleUrls: ['./available-updates.component.scss']
})
export class AvailableUpdatesComponent implements OnInit {

	@Input() criticalUpdates: any;
	@Input() recommendedUpdates: any;
	@Input() optionalUpdates: any;

	@Output() checkChange = new EventEmitter<any>();
	@Output() installAllUpdate = new EventEmitter<any>();
	@Output() installSelectedUpdate = new EventEmitter<any>();

	constructor() { }

	ngOnInit() {
	}

	onInstallAllUpdates(event) {
		console.log('installUpdates', event);
		this.installAllUpdate.emit(event);
	}

	onInstallSelectedUpdates(event) {
		console.log('installSelectedUpdates', event);
		this.installSelectedUpdate.emit(event);
	}

	public onCheckChange($event: any) {
		this.checkChange.emit($event);
	}
}
