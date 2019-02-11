import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { BatteryDetailMockService } from 'src/app/services/battery-detail/battery-detail.mock.service';
import { BaseBatteryDetail } from 'src/app/services/battery-detail/base-battery-detail';

@Component({
	selector: 'vtr-battery-detail',
	templateUrl: './battery-detail.component.html',
	styleUrls: ['./battery-detail.component.scss'],
	providers: [
		{ provide: BaseBatteryDetail, useClass: BatteryDetailMockService }
	]
})
export class BatteryDetailComponent implements OnInit {
	public dataSource: BatteryDetail[];

	constructor(
		private modalService: NgbModal,
		private batteryDetailService: BaseBatteryDetail
	) {
		this.batteryDetailService
			.getBatteryDetail()
			.subscribe((response: BatteryDetail[]) => {
				this.dataSource = response;
			});
	}

	ngOnInit() {}
}
