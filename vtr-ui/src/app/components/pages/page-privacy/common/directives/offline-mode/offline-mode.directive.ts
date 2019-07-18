import { Directive, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../../../../../services/common/common.service';
import { filter, map, takeUntil } from 'rxjs/operators';
import { NetworkStatus } from '../../../../../../enums/network-status.enum';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';

@Directive({
	selector: '[vtrOfflineMode]'
})
export class OfflineModeDirective implements OnInit, OnDestroy {
	@HostBinding('disabled') private isDisabled = false;
	@HostBinding('style.background') private backgroundColor = '';

	constructor(
		private commonService: CommonService,
	) {	}

	ngOnInit() {
		this.commonService.notification.pipe(
			filter((notification) => notification.type === NetworkStatus.Online || notification.type === NetworkStatus.Offline),
			map((notification) => notification.payload),
			takeUntil(instanceDestroyed(this))
		).subscribe((payload) => {
			this.isDisabled = !payload.isOnline;
			this.backgroundColor = payload.isOnline ? '' : 'black';

			console.log('this.commonService.notification', payload);
		});
	}

	ngOnDestroy() {
	}

}
