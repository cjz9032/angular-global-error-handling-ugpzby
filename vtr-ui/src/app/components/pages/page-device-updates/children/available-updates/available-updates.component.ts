import { Component, OnInit } from '@angular/core';
import { MockService } from "../../../../../services/mock/mock.service"

@Component({
	selector: 'vtr-available-updates',
	templateUrl: './available-updates.component.html',
	styleUrls: ['./available-updates.component.scss']
})
export class AvailableUpdatesComponent implements OnInit {

	constructor(
		public mockService: MockService
	) { }

	ngOnInit() {
	}

	installUpdates(event) {
		console.log('installUpdates', event);
	}

	installSelectedUpdates(event) {
		console.log('installSelectedUpdates', event);
	}
}
