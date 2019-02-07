import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import BatteryGaugeDetail from 'src/app/data-models/battery/battery-gauge-detail-model';
import { BatteryDetailMockService } from 'src/app/services/battery-detail/battery-detail.mock.service';
import { BaseBatteryDetail } from 'src/app/services/battery-detail/base-battery-detail';

@Component({
	selector: 'vtr-battery-detail',
	templateUrl: './battery-detail.component.html',
	styleUrls: ['./battery-detail.component.scss'],
	providers: [{ provide: BaseBatteryDetail, useClass: BatteryDetailMockService }]
})
export class BatteryDetailComponent implements OnInit {
	public dataSource: BatteryDetail[];

	constructor(
		private modalService: NgbModal
		, private batteryDetailService: BaseBatteryDetail
	) {
		this.batteryDetailService.getBatteryDetail().subscribe(
			(response: BatteryDetail[]) => {
				this.dataSource = response;
			}
		);
	}

	ngOnInit() {
	}

	public open(content: any): void {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'battery-modal-size' }).result
			.then((result) => {
				// on open
			}, (reason) => {
				// on close
			});
	}

	private populateDummyData() {
		const ds1 = new BatteryDetail();
		const ds2 = new BatteryDetail();
		ds1.batteryGaugeDetail = new BatteryGaugeDetail();
		ds2.batteryGaugeDetail = new BatteryGaugeDetail();

		ds1.heading = 'Primary Battery';
		ds1.batteryGaugeDetail.heading = 'Build In Battery Gauge Reset';
		ds2.heading = 'Secondary Battery';
		ds2.batteryGaugeDetail.heading = 'Build In Battery Gauge Reset';

		// primary battery data
		ds1.chargeStatus = 'Discharging';
		ds1.remainingPercent = 90;
		ds1.remainingTime = '5 hours 40 minutes';
		ds1.remainingCapacity = 45.58;
		ds1.fullChargeCapacity = 46.76;
		ds1.voltage = 12.61;
		ds1.wattage = 11.23;
		ds1.temperature = 30;
		ds1.cycleCount = 191;
		ds1.manufacturer = 'Sanyo';
		ds1.manufactureDate = '5/3/2015';
		ds1.firstUseDate = '5/3/2016';
		ds1.barCode = 'AX456987SS';
		ds1.deviceChemistry = 'Li-Polymer';
		ds1.designCapacity = 52.55;
		ds1.designVoltage = 11.4;
		ds1.firmwareVersion = '033-8039-0010-82F';

		ds1.batteryGaugeDetail.barCode = '033-8039-0010-82F';
		ds1.batteryGaugeDetail.status = '1 of 3:full charge';
		ds1.batteryGaugeDetail.remaining = 100;
		ds1.batteryGaugeDetail.logDateTime = '2/26/2014 6:05:09 PM';
		ds1.batteryGaugeDetail.lastRunStatus = 'Failed. Cancelled by user';

		// secondary battery data
		ds2.chargeStatus = 'Discharging';
		ds2.remainingPercent = 90;
		ds2.remainingTime = '5 hours 40 minutes';
		ds2.remainingCapacity = 45.58;
		ds2.fullChargeCapacity = 46.76;
		ds2.voltage = 12.61;
		ds2.wattage = 11.23;
		ds2.temperature = 30;
		ds2.cycleCount = 191;
		ds2.manufacturer = 'Sanyo';
		ds2.manufactureDate = '5/3/2015';
		ds2.firstUseDate = '5/3/2016';
		ds2.barCode = 'AX456987SS';
		ds2.deviceChemistry = 'Li-Polymer';
		ds2.designCapacity = 52.55;
		ds2.designVoltage = 11.4;
		ds2.firmwareVersion = '033-8039-0010-82F';

		ds2.batteryGaugeDetail.barCode = '033-8039-0010-82F';
		ds2.batteryGaugeDetail.status = '1 of 3:full charge';
		ds2.batteryGaugeDetail.remaining = 100;
		ds2.batteryGaugeDetail.logDateTime = '2/26/2014 6:05:09 PM';
		ds2.batteryGaugeDetail.lastRunStatus = 'Failed. Cancelled by user';

		this.dataSource = [ds1, ds2];

	}
}
