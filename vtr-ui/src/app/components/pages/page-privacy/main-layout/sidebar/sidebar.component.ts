import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../../services/common/common.service';
import { filter, map, startWith } from 'rxjs/operators';
import { NetworkStatus } from '../../../../../enums/network-status.enum';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';

@Component({
	selector: 'vtr-side-bar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	isOnline$ = this.commonService.notification.pipe(
		filter((notification) => notification.type === NetworkStatus.Online || notification.type === NetworkStatus.Offline),
		map((notification) => notification.payload.isOnline),
		startWith(this.commonService.isOnline)
	);

	isFigleafInExit$ = this.communicationWithFigleafService.isFigleafInExit$;

	constructor(
		private commonService: CommonService,
		private communicationWithFigleafService: CommunicationWithFigleafService
	) {
	}

	ngOnInit() {

	}
}
