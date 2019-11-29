import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs/internal/observable/interval';
import { LoggerService } from '../logger/logger.service';
// import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// import { ModalAppUpdateAvailableComponent } from 'src/app/components/modal/modal-app-update-available/modal-app-update-available.component';
import { first } from 'rxjs/internal/operators/first';
import { concat } from 'rxjs/internal/observable/concat';

@Injectable({
	providedIn: 'root'
})
export class AppUpdateService {

	constructor(
		private updates: SwUpdate,
		// private modalService: NgbModal,
		appRef: ApplicationRef,
		private logger: LoggerService
	) {
		if (updates.isEnabled) {
			const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
			const everySixHours$ = interval(6 * 60 * 60 * 1000);
			const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

			everySixHoursOnceAppIsStable$.subscribe(() => {
				this.logger.info('AppUpdateService: scheduled checking for updates');
				updates.checkForUpdate();
			});

			updates.activated.subscribe(event => {
				this.logger.info(`AppUpdateService: old version was `, event.previous);
				this.logger.info(`AppUpdateService: new version is `, event.current);
			});
		}
	}

	public checkForUpdatesNoPrompt(): void {
		this.logger.info('AppUpdateService: app launch, checking for update');
		this.updates.available.subscribe(() => {
			this.logger.info('AppUpdateService: new version available, activating updates');
			this.updates.activateUpdate().then(() => {
				this.logger.info('AppUpdateService: updates activated, it will be applied on next launch');
			});
		});
	}

	// public checkForUpdates(): void {
	// 	this.logger.info('AppUpdateService: app launch, checking for update');
	// 	// this.promptUser();
	// 	this.updates.available.subscribe(() => this.promptUser());
	// }

	// private promptUser(): void {
	// 	this.logger.info('AppUpdateService: new version available, waiting for user confirmation');
	// 	const modalRef: NgbModalRef = this.modalService.open(ModalAppUpdateAvailableComponent, {
	// 		size: 'lg',
	// 		backdrop: 'static',
	// 		windowClass: 'confirmation-modal',
	// 		centered: true,
	// 		keyboard: false	// disable escape key
	// 	});
	// 	modalRef.result.then(
	// 		(reason: boolean) => {
	// 			// on close
	// 			if (reason) {
	// 				this.logger.info('AppUpdateService: updating to latest version');
	// 				// show spinner on modal
	// 				this.updates.activateUpdate().then(() => {
	// 					// hide spinner and modal. reload app
	// 					document.location.reload();
	// 				});
	// 			} else {
	// 				this.logger.info('AppUpdateService: update aborted by user');
	// 			}
	// 		}
	// 	);
	// }
}
