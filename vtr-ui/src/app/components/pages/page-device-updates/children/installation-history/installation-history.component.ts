import { Component, OnInit } from '@angular/core';
import { MockService } from "../../../../../services/mock/mock.service"

@Component({
	selector: 'vtr-installation-history',
	templateUrl: './installation-history.component.html',
	styleUrls: ['./installation-history.component.scss']
})
export class InstallationHistoryComponent implements OnInit {
	sortAsc: boolean = true;
	expandedRecordId: string = '';

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

	toggleSortOrder() {
		this.sortAsc = !this.sortAsc;
	}

	toggleExpand(itemId) {
		if (this.expandedRecordId === itemId) {
			this.expandedRecordId = '';
		} else {
			this.expandedRecordId = itemId;
		}
	}
}
