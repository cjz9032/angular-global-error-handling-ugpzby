import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AvailableUpdateDetail } from 'src/app/data-models/system-update/available-update-detail.model';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';

@Component({
	selector: 'vtr-available-updates',
	templateUrl: './available-updates.component.html',
	styleUrls: ['./available-updates.component.scss']
})
export class AvailableUpdatesComponent implements OnInit {

	@Input() criticalUpdates: AvailableUpdateDetail[];
	@Input() recommendedUpdates: AvailableUpdateDetail[];
	@Input() optionalUpdates: AvailableUpdateDetail[];
	@Input() ignoredUpdates: AvailableUpdateDetail[];
	@Input() isInstallationSuccess = false;
	@Input() isInstallationCompleted = false;
	@Input() isInstallingAllUpdates = true;

	@Output() checkChange = new EventEmitter<any>();
	@Output() ignoreUpdate = new EventEmitter<any>();
	@Output() installAllUpdate = new EventEmitter<any>();
	@Output() installSelectedUpdate = new EventEmitter<any>();

	public isUpdateSelected = false;

	public isCollapsed = true;

	constructor(private systemUpdateService: SystemUpdateService) { }

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
		this.checkSelectedUpdateStatus();
	}

	onInstallAllUpdates(event) {
		this.installAllUpdate.emit(event);
	}

	onInstallSelectedUpdates(event) {
		this.installSelectedUpdate.emit(event);
	}

	public onCheckChange($event: any) {
		this.checkChange.emit($event);
		this.checkSelectedUpdateStatus();
	}

	public onIgnoreUpdate($event: any) {
		this.ignoreUpdate.emit($event);
	}

	public onToggle() {
		this.isCollapsed = !this.isCollapsed;
	}

	private checkSelectedUpdateStatus() {
		const selectedUpdates = this.systemUpdateService.getSelectedUpdates(this.systemUpdateService.updateInfo.updateList);
		this.isUpdateSelected = selectedUpdates.length > 0;
	}
}
