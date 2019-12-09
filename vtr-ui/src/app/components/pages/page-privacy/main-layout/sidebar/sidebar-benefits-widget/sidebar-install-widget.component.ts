import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterChangeHandlerService } from '../../../common/services/router-change-handler.service';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { InstallWidgetPageSettings, SidebarInstallWidgetService } from './sidebar-install-widget.service';
import { AppStatuses } from '../../../userDataStatuses';
import { merge } from 'rxjs';
import { getFigleafProtectedStatus } from '../../../utils/helpers';
import { AppStatusesService } from '../../../common/services/app-statuses/app-statuses.service';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';

@Component({
	selector: 'vtr-sidebar-install-widget',
	templateUrl: './sidebar-install-widget.component.html',
	styleUrls: ['./sidebar-install-widget.component.scss']
})
export class SidebarInstallWidgetComponent implements OnInit, OnDestroy {
	primaryButtonText = 'Install Now';
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

	isFigleafInExit$ = this.communicationWithFigleafService.isFigleafInExit$;

	constructor(
		private routerChangeHandler: RouterChangeHandlerService,
		private sidebarInstallWidgetService: SidebarInstallWidgetService,
		private appStatusesService: AppStatusesService,
		private communicationWithFigleafService: CommunicationWithFigleafService
	) {
	}

	ngOnInit() {
		merge(
			this.appStatusesService.globalStatus$.pipe(
				tap(({appState}) => {
					this.isFirstTimeVisitor = appState === AppStatuses.firstTimeVisitor;
					this.isFigleafInstalled = getFigleafProtectedStatus(appState);
				})
			),
			this.routerChangeHandler.onChange$.pipe(
				filter((currentPath) => this.sidebarInstallWidgetService.pagesSettings[currentPath]),
				tap((currentPath) => this.currentPath = currentPath)
			),
		).pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe(() => {
			if (this.isFirstTimeVisitor) {
				this.installWidgetSettings = {
					...this.sidebarInstallWidgetService.generalizedSettings,
					visible: this.sidebarInstallWidgetService.pagesSettings[this.currentPath].visible
				};
			} else {
				this.installWidgetSettings = this.sidebarInstallWidgetService.pagesSettings[this.currentPath];
			}
		});
	}

	ngOnDestroy() {
	}
}
