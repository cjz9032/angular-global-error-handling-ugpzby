import { Directive, HostListener, OnDestroy } from '@angular/core';
import { VantageCommunicationService } from '../services/vantage-communication.service';
import { TaskActionWithTimeoutService, TasksName } from '../services/analytics/task-action-with-timeout.service';
import { CommonService } from '../../../../../services/common/common.service';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';

@Directive({
	selector: '[vtrOpenFigleafInstaller]'
})
export class OpenFigleafInstallerDirective implements OnDestroy {
	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		private commonService: CommonService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
	) {
	}

	@HostListener('click', ['$event']) onClick($event) {
		if (!this.commonService.isOnline) {
			return;
		}

		this.communicationWithFigleafService.isFigleafNotOnboarded$.pipe(
			take(1),
			filter((isFigleafNotOnboarded) => isFigleafNotOnboarded),
			switchMap(() => this.vantageCommunicationService.openFigleafByUrl('lenovoprivacy:')),
		).subscribe(() => {
		});

		this.communicationWithFigleafService.isFigleafNotOnboarded$.pipe(
			take(1),
			filter((isFigleafNotOnboarded) => !isFigleafNotOnboarded),
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

}
