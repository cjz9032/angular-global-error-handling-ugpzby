import { Component, OnInit } from '@angular/core';
import { QA } from 'src/app/data-models/qa/qa.model';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-page-high-density-battery',
	templateUrl: './page-high-density-battery.component.html',
	styleUrls: ['./page-high-density-battery.component.scss']
})
export class PageHighDensityBatteryComponent implements OnInit {
	title = 'High density battery'
	qas: QA[] = [
		{
			id: 1,
			title: this.translate.instant('device.deviceSettings.batteryGauge.highDensityBattery.subtitle'),
			category: 'q&a',
			path: '/device/high-density-battery',
			icon: ['fal','gem'],
			isIconBackground: false,
			like: false,
			dislike: false,
			itemId: 'high-density-battery',
		}
	];
	constructor(private translate: TranslateService, public modalService: NgbModal) { }

	ngOnInit(): void {
		this.modalService.dismissAll();
	}

}
