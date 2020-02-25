import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import lowerCase from 'lodash/lowerCase';

@Component({
	selector: 'vtr-subpage-device-settings-power-container',
	templateUrl: './subpage-device-settings-power-container.component.html',
	styleUrls: ['./subpage-device-settings-power-container.component.scss']
})
export class SubpageDeviceSettingsPowerContainerComponent implements OnInit {

	public showDpm = null;

	constructor(
		private deviceService: DeviceService,
	) { }

	ngOnInit() {
		this.deviceService.getMachineInfo().then((info) => {
			if (info) {
				const brand = info.brand.toLowerCase();
				const subBrand = info.subBrand.toLowerCase();
				if ((brand === 'think' || brand === 'lenovo')
					&& (subBrand === 'thinkcentre' || subBrand === 'thinkcenter')) {
					this.showDpm = true;
				} else {
					this.showDpm = false;
				}
			} else {
				this.showDpm = false;
			}

		});
	}
}
