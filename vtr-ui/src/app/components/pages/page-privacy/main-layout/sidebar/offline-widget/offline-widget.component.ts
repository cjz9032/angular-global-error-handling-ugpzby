import { Component } from '@angular/core';
import { CommonService } from '../../../../../../services/common/common.service';
import { filter, map, startWith } from 'rxjs/operators';
import { NetworkStatus } from '../../../../../../enums/network-status.enum';

@Component({
	selector: 'vtr-offline-widget',
	templateUrl: './offline-widget.component.html',
	styleUrls: ['./offline-widget.component.scss']
})
export class OfflineWidgetComponent {
	isOnline$ = this.commonService.notification.pipe(
		filter((notification) => notification.type === NetworkStatus.Online || notification.type === NetworkStatus.Offline),
		map((notification) => notification.payload.isOnline),
		startWith(this.commonService.isOnline)
	);

	constructor(
		private commonService: CommonService
	) {
	}
}
