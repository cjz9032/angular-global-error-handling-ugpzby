import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';

@Component({
	selector: 'vtr-available-updates',
	templateUrl: './available-updates.component.html',
	styleUrls: ['./available-updates.component.scss']
})
export class AvailableUpdatesComponent implements OnInit {

	@Input() criticalUpdates: AvailableUpdateDetail[];
	@Input() recommendedUpdates: AvailableUpdateDetail[];
	@Input() optionalUpdates: AvailableUpdateDetail[];
	@Input() isInstallationSuccess = false;
	@Input() isInstallationCompleted = false;
	@Input() isInstallingAllUpdates = true;

	@Output() checkChange = new EventEmitter<any>();
	@Output() installAllUpdate = new EventEmitter<any>();
	@Output() installSelectedUpdate = new EventEmitter<any>();

	constructor() { }

	ngOnInit() {
		if (!this.isInstallingAllUpdates) {
			this.criticalUpdates = this.criticalUpdates.filter((item: AvailableUpdateDetail) => {
				return item.isSelected;
			});

			this.recommendedUpdates = this.recommendedUpdates.filter((item: AvailableUpdateDetail) => {
				return item.isSelected;
			});

			this.optionalUpdates = this.optionalUpdates.filter((item: AvailableUpdateDetail) => {
				return item.isSelected;
			});
		}
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
