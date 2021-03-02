import { Component, Input } from '@angular/core';
import { WarrantyStatusEnum } from 'src/app/data-models/warranty/warranty.model';
import { DeviceService } from 'src/app/services/device/device.service';
import { WarrantyService } from 'src/app/services/warranty/warranty.service';

@Component({
	selector: 'vtr-ui-header-warranty',
	templateUrl: './ui-header-warranty.component.html',
	styleUrls: ['./ui-header-warranty.component.scss'],
})
export class UiHeaderWarrantyComponent {
	@Input() pageParent: string;
	WarrantyStatusEnum = WarrantyStatusEnum;

	constructor(
		public deviceService: DeviceService,
		public warrantyService: WarrantyService,
	) { }

}
