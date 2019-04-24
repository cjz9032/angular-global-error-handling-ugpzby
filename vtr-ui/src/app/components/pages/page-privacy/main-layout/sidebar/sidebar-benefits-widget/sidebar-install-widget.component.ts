import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterChangeHandlerService } from '../../../shared/services/router-change-handler.service';
import { filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../shared/custom-rxjs-operators/instance-destroyed';
import { InstallWidgetPageSettings, SidebarInstallWidgetService } from './sidebar-install-widget.service';
import { RoutersName } from '../../../privacy-routing-name';
import { CommunicationWithFigleafService } from '../../../communication-with-figleaf/communication-with-figleaf.service';

@Component({
	selector: 'vtr-sidebar-install-widget',
	templateUrl: './sidebar-install-widget.component.html',
	styleUrls: ['./sidebar-install-widget.component.scss']
})
export class SidebarInstallWidgetComponent implements OnInit, OnDestroy {
	primaryButtonText = 'Try Lenovo Privacy';
	linkButtonText = 'Learn more';

	isMainPage = false;

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
					this.isMainPage = currentPath === RoutersName.PRIVACY;
					this.installWidgetSettings = this.sidebarInstallWidgetService.pagesSettings[currentPath];
				}
			);
	}

	ngOnDestroy() {
	}
}
