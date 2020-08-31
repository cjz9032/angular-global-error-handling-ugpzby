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
	@Input() isInstallationSuccess = false;
	@Input() isInstallingAllUpdates = true;

	@Input() set ignoredUpdates(value: AvailableUpdateDetail[]) {
		this.mIgnoredUpdates = value;
		this.expandIgnoredForDependencyUpdates();
	}
	get ignoredUpdates(): AvailableUpdateDetail[] {
		return this.mIgnoredUpdates;
	}

	@Input() set isInstallationCompleted(value: boolean) {
		this.mIsInstallationCompleted = value;
		this.expandIgnoredForInstallationResult();
	}
	get isInstallationCompleted(): boolean {
		return this.mIsInstallationCompleted;
	}


	@Output() checkChange = new EventEmitter<any>();
	@Output() ignoreUpdate = new EventEmitter<any>();
	@Output() installAllUpdate = new EventEmitter<any>();
	@Output() installSelectedUpdate = new EventEmitter<any>();

	public isUpdateSelected = false;

	public isCollapsed = true;

	private mIsInstallationCompleted = false;
	private mIgnoredUpdates: AvailableUpdateDetail[];

	constructor(private systemUpdateService: SystemUpdateService) { }

	public criticalUpdatesIcon = 'assets/icons/Icon_Critical_Update.svg';
	public recommendedUpdatesIcon = 'assets/icons/Icon_Recommended_Update.svg';
	public optionalUpdateIcon = 'assets/icons/Icon_Optional_Update.svg';
	public ignoredUpdateIcon = 'assets/icons/Icon_Eye_Slash.svg';

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
		this.expandIgnoredForDependencyUpdates();
	}

	private expandIgnoredForDependencyUpdates() {
		if (this.isCollapsed) {
			const dependencyInIgnored = this.ignoredUpdates.find(x => x.isDependency);
			if (dependencyInIgnored) {
				this.isCollapsed = false;
			}
		}
	}

	private expandIgnoredForInstallationResult() {
		if (this.mIsInstallationCompleted && this.ignoredUpdates.length > 0 && this.isCollapsed) {
			this.isCollapsed = false;
		}
	}
}
