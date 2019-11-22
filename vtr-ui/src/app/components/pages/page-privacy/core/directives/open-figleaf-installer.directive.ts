import { Directive, HostListener, OnDestroy } from '@angular/core';
import { VantageCommunicationService } from '../services/vantage-communication.service';
import { TaskActionWithTimeoutService, TasksName } from '../services/analytics/task-action-with-timeout.service';
import { CommonService } from '../../../../../services/common/common.service';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { combineLatest } from 'rxjs';

@Directive({
	selector: '[vtrOpenFigleafInstaller]'
})
export class OpenFigleafInstallerDirective implements OnDestroy {
	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		private commonService: CommonService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
	) {}

	@HostListener('click', ['$event']) onClick($event) {
		if (!this.commonService.isOnline) {
			return;
		}

		this.getFigleafStates().pipe(
			filter(([isFigleafNotOnboarded, isFigleafInExit]) => isFigleafNotOnboarded || isFigleafInExit),
			switchMap(() => this.vantageCommunicationService.openFigleafByUrl('lenovoprivacy:')),
		).subscribe(() => {});

		this.getFigleafStates().pipe(
			filter(([isFigleafNotOnboarded, isFigleafInExit]) => !isFigleafNotOnboarded && !isFigleafInExit),
			switchMap(() => this.vantageCommunicationService.openInstaller()),
			takeUntil(instanceDestroyed(this)),
		).subscribe(
			() => {
				this.taskActionWithTimeoutService.startAction(TasksName.privacyAppInstallationAction);
			},
			(err) => console.error('openInstaller', err),
		);
	}

	ngOnDestroy() {
	}

	private getFigleafStates() {
		return combineLatest([
			this.communicationWithFigleafService.isFigleafNotOnboarded$,
			this.communicationWithFigleafService.isFigleafInExit$
		]).pipe(
			take(1)
		);
	}

}
