import { Directive, HostListener, OnDestroy } from '@angular/core';
import { VantageCommunicationService } from '../services/vantage-communication.service';
import { TaskActionWithTimeoutService, TasksName } from '../services/analytics/task-action-with-timeout.service';
import { CommonService } from '../../../../../services/common/common.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';

@Directive({
	selector: '[vtrOpenFigleafInstaller]'
})
export class OpenFigleafInstallerDirective implements OnDestroy {

	constructor(
		private vantageCommunicationService: VantageCommunicationService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		private commonService: CommonService,
	) {	}

	@HostListener('click', ['$event']) onClick($event) {
		if (!this.commonService.isOnline) {
			return;
		}
		this.vantageCommunicationService.openInstaller().pipe(
			takeUntil(instanceDestroyed(this))
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
