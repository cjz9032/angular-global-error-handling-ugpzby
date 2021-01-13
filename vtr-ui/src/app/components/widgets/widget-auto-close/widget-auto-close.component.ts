import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@lenovo/material/slide-toggle';
import { Subscription } from 'rxjs';
import { MaxSelected } from 'src/app/material/material-app-tile-list/material-app-tile-list.component';
import { TileItem } from 'src/app/material/material-tile/material-tile.component';
import { DialogService } from 'src/app/services/dialog/dialog.service';

@Component({
	selector: 'vtr-widget-auto-close',
	templateUrl: './widget-auto-close.component.html',
	styleUrls: ['./widget-auto-close.component.scss']
})
export class WidgetAutoCloseComponent implements OnInit, OnDestroy {
	someItem = [];
	savedApps: TileItem[] = [{
		path: '',
		iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
		name: 'xxx xxxxx clickable',
	}, {
		path: '',
		iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
		name: 'xxx xxxxx clickable',
	}, {
		path: '',
		iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
		name: 'xxx xxxxx clickable',
	}, {
		path: '',
		iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
		name: 'xxx xxxxx clickable',
	}];

	runningApps: TileItem[] = [
		{
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx xxxxx clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx xxxxx clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx xxxxx clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx clickable clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx clickable clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx clickable clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx clickable clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx clickable clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx clickable clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx clickable clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx clickable clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx clickable clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx xxxxx clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx xxxxx clickable',
			buttonType: 'clickable'
		}, {
			path: '',
			iconSrc: 'assets/icons/Icon_Windows_Update_20px.svg',
			name: 'xxx xxxxx clickable',
			buttonType: 'clickable'
		}
	];
	maxSelected: MaxSelected = {
		maxLength: 5,
		tooltips: 'intelligentBoost.appsDialogDisabledTooltip'
	};
	removable: boolean;
	autoCloseChecked = true;
	removeEmitSubscribe: Subscription;
	selectEmitSubscribe: Subscription;

	constructor(
		private dialogService: DialogService,
	) { }

	ngOnInit(): void {
		this.initAutoClose();
	}

	ngOnDestroy(): void {
		this.selectEmitSubscribe?.unsubscribe();
		this.removeEmitSubscribe?.unsubscribe();
	}

	initAutoClose() {
		// this.autoCloseService.getAutoCloseApps().then((apps: TileItem[]) => {
		// 	this.savesApps = apps;
		// });
		// this.autoCloseService.getState().then((state: boolean) => {
		// 	this.autoCloseChecked = state;
		// });
	}

	edit(isDone: boolean): void {
		this.removable = !isDone;
	}

	remove(item: TileItem): void {
		const index = this.savedApps.indexOf(item);
		if (index >= 0) {
			// this.autoCloseService.deleteAutoCloseApps(selectItem).then((res) => {
			// 	if (res) {
			this.savedApps.splice(index, 1);
			// 	}
			// });
		}
	}

	openRunningAppsDialog(): void {
		// this.runningApps = this.autoCloseService.getRunningApps();
		const appListDialog = this.dialogService.openAppListDialog(this.runningApps, this.maxSelected);
		this.selectEmitSubscribe = appListDialog.componentInstance.selectEmit.subscribe((selectItem: TileItem) => {
			appListDialog.afterClosed().subscribe(() => {
				const index = this.runningApps.indexOf(selectItem);
				if (index >= 0 && this.runningApps[index].buttonType === 'selected') {
					this.runningApps.splice(index, 1);
				}
				this.selectEmitSubscribe.unsubscribe();
			});
			const selectItemIndex = this.savedApps.indexOf(selectItem);
			if (selectItemIndex >= 0) {
				this.savedApps.splice(selectItemIndex, 1);
			} else {
				// this.autoCloseService.addAutoCloseApps(selectItem).then((res) => {
				// 	if (res) {
				this.savedApps.push(selectItem);
				// 	}
				// });
			}
		});
	}

	updateAutoCloseToggleState($event: MatSlideToggleChange) {
		this.autoCloseChecked = $event.checked;
		// this.autoCloseService.setState(this.autoCloseChecked);
	}
}
