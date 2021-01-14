import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSlideToggleChange } from '@lenovo/material/slide-toggle';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { TileItem, MaxSelected } from 'src/app/feature/types/auto-close';
import { AutoCloseService } from 'src/app/feature/service/auto-close.service';
import { MockService } from 'src/app/services/mock/mock.service';

@Component({
	selector: 'vtr-auto-close',
	templateUrl: './auto-close.component.html',
	styleUrls: ['./auto-close.component.scss']
})
export class AutoCloseComponent implements OnInit, OnDestroy {
	someItem = [];
	savedApps: TileItem[];
	runningApps: TileItem[];
	maxSelected: MaxSelected;
	removable: boolean;
	autoCloseChecked = true;
	selectedEmitSubscribe: Subscription;

	constructor(
		private dialogService: DialogService,
		private autoCloseService: AutoCloseService,
	) { }

	ngOnInit(): void {
		this.initAutoClose();
	}

	ngOnDestroy(): void {
		this.selectedEmitSubscribe?.unsubscribe();
	}

	initAutoClose() {
		this.autoCloseService.getAutoCloseApps().then((apps: TileItem[]) => {
			this.savedApps = apps;
		});
		this.autoCloseService.getState().then((status: boolean) => {
			this.autoCloseChecked = status;
		});
	}

	remove(item: TileItem): void {
		const index = this.savedApps.indexOf(item);
		if (index >= 0) {
			this.autoCloseService.deleteAutoCloseApps([item]).then((res) => {
				if (res) {
					this.savedApps.splice(index, 1);
				}
			});
		}
	}

	openRunningAppsDialog(): void {
		this.autoCloseService.getRunningApps().then((apps: TileItem[]) => {
			this.runningApps = apps;
			const appListDialog = this.dialogService.openAppListDialog(this.runningApps, this.maxSelected);
			this.selectedEmitSubscribe = appListDialog.componentInstance.selectedEmit.subscribe((selectItem: TileItem) => {
				appListDialog.afterClosed().subscribe(() => {
					const index = this.runningApps.indexOf(selectItem);
					if (index >= 0 && this.runningApps[index].buttonType === 'selected') {
						this.runningApps.splice(index, 1);
					}
					this.selectedEmitSubscribe.unsubscribe();
				});
				const selectItemIndex = this.savedApps.indexOf(selectItem);
				if (selectItemIndex >= 0) {
					this.savedApps.splice(selectItemIndex, 1);
				} else {
					this.autoCloseService.addAutoCloseApps([selectItem]).then((res) => {
						if (res) {
							this.savedApps.push(selectItem);
						}
					});
				}
			});
		});
	}

	updateAutoCloseToggleState($event: MatSlideToggleChange) {
		this.autoCloseChecked = $event.checked;
		this.autoCloseService.setState(this.autoCloseChecked);
	}
}
