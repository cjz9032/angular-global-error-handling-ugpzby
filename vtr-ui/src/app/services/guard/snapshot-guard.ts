import { Injectable } from '@angular/core';
import { GuardConstants } from './guard-constants';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';
import { SnapshotService } from 'src/app/modules/snapshot/services/snapshot.service';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SnapshotGuard extends BasicGuard {
	constructor(
		public guardConstants: GuardConstants,
		public commonService: CommonService,
		private snapshotService: SnapshotService
	) {
		super(commonService, guardConstants);
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
		// NOTICE: Don't try to convert this method into an async one or you'll get an infinite loop
		//  when calling "super.canActivate()"
		return this.snapshotService
			.isAvailable()
			.then((isSnapsotEnabledOnHypothesis) =>
				isSnapsotEnabledOnHypothesis ? true : super.canActivate(route, state)
			)
			.catch(() => super.canActivate(route, state));
	}

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.canActivate(childRoute, state);
	}
}
