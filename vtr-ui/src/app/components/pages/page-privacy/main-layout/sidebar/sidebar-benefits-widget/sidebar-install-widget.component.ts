import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterChangeHandlerService } from '../../../common/services/router-change-handler.service';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { InstallWidgetPageSettings, SidebarInstallWidgetService } from './sidebar-install-widget.service';
import { UserDataGetStateService } from '../../../common/services/user-data-get-state.service';
import { AppStatuses } from '../../../userDataStatuses';
import { merge } from 'rxjs';

@Component({
	selector: 'vtr-sidebar-install-widget',
	templateUrl: './sidebar-install-widget.component.html',
	styleUrls: ['./sidebar-install-widget.component.scss']
})
export class SidebarInstallWidgetComponent implements OnInit, OnDestroy {
	primaryButtonText = 'Try Lenovo Privacy';
	linkButtonText = 'Learn more';

	installWidgetSettings: InstallWidgetPageSettings = {
		visible: false,
		title: '',
		text: '',
		image: '',
	};

	isFigleafInstalled = false;
	isFirstTimeVisitor = false;
	currentPath = '';

	constructor(
		private routerChangeHandler: RouterChangeHandlerService,
		private sidebarInstallWidgetService: SidebarInstallWidgetService,
		private userDataGetStateService: UserDataGetStateService,
	) {
	}

	ngOnInit() {
		merge(
			this.userDataGetStateService.userDataStatus$.pipe(
				takeUntil(instanceDestroyed(this)),
				tap(({appState}) => {
					this.isFirstTimeVisitor = appState === AppStatuses.firstTimeVisitor;
					this.isFigleafInstalled = appState === AppStatuses.figLeafInstalled;
				})
			),
			this.routerChangeHandler.onChange$.pipe(
				takeUntil(instanceDestroyed(this)),
				filter((currentPath) => this.sidebarInstallWidgetService.pagesSettings[currentPath]),
				tap((currentPath) => this.currentPath = currentPath)
			),
		).subscribe(() => {
			if (this.isFirstTimeVisitor) {
				this.installWidgetSettings = this.sidebarInstallWidgetService.generalizedSettings;
			} else {
				this.installWidgetSettings = this.sidebarInstallWidgetService.pagesSettings[this.currentPath];
			}
		});
	}

	ngOnDestroy() {
	}
}
