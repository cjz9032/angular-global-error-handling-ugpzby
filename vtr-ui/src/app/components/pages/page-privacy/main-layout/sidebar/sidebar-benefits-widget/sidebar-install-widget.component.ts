import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterChangeHandlerService } from '../../../common/services/router-change-handler.service';
import { filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { InstallWidgetPageSettings, SidebarInstallWidgetService } from './sidebar-install-widget.service';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { UserDataGetStateService } from '../../../common/services/user-data-get-state.service';
import { AppStatuses } from '../../../userDataStatuses';

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

	isFigleafInstalled$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;

	constructor(
		private routerChangeHandler: RouterChangeHandlerService,
		private sidebarInstallWidgetService: SidebarInstallWidgetService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private userDataGetStateService: UserDataGetStateService,
	) {
	}

	ngOnInit() {
		this.routerChangeHandler.onChange$
			.pipe(
				takeUntil(instanceDestroyed(this)),
				filter((currentPath) => this.sidebarInstallWidgetService.pagesSettings[currentPath])
			)
			.subscribe(
				(currentPath) => {
					this.installWidgetSettings = this.sidebarInstallWidgetService.pagesSettings[currentPath];
					const {appState} = this.userDataGetStateService.getUserDataStatus();
					if ( appState === AppStatuses.firstTimeVisitor ) {
						this.installWidgetSettings = this.sidebarInstallWidgetService.generalizedSettings;
					}
				}
			);
	}

	ngOnDestroy() {
	}
}
