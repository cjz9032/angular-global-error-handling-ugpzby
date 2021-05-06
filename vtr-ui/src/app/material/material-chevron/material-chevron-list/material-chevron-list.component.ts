import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Status } from 'src/app/data-models/widgets/status.model';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-material-chevron-list',
	templateUrl: './material-chevron-list.component.html',
	styleUrls: ['./material-chevron-list.component.scss'],
})
export class MaterialChevronListComponent extends BaseComponent {
	@Input() data: Status[];
	@Input() isLeftIcon = false;
	@Input() chevronVisibility = true;
	@Input() arrowColor = 'blue';

	/**** passing to ItemParent from metrics ****/
	@Input() metricsParent: string;
	@Input() clickable = true;
	@Input() metricsEvent = 'FeatureClick';
	@Input() blockPosition: string;
	@Input() linkId: string;

	constructor(private deviceService: DeviceService, public router: Router) {
		super();
	}

	/**
	 * launchSystemUri
	 * path: string
	 */
	public launchSystemUri(path: string) {
		if (path) {
			this.deviceService.launchUri(path);
		}
	}

	retry(item: Status, e) {
		e.stopPropagation();
		item.retryText = undefined;
		item.retry();
	}
}
