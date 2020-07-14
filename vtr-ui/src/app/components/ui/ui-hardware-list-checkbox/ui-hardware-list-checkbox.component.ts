import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanService } from '../../../services/hardware-scan/hardware-scan.service';
@Component({
	selector: 'vtr-ui-hardware-list-checkbox',
	templateUrl: './ui-hardware-list-checkbox.component.html',
	styleUrls: ['./ui-hardware-list-checkbox.component.scss']
})
export class UiHardwareListCheckboxComponent implements OnInit, OnDestroy {

	public select = this.translate.instant('hardwareScan.select');
	public deselect = this.translate.instant('hardwareScan.deselect');
	public allOptions = this.translate.instant('hardwareScan.allOptions');

	@Input() devices: any[];

	constructor(private translate: TranslateService,
		private hardwareScanService: HardwareScanService) { }

	ngOnInit() {
		this.hardwareScanService.setHasDevicesToRecover(this.devices.find(x => x.isSelected));
	}

	ngOnDestroy() {
		this.onDeselectAllDevices();
	}

	onSelectDevice() {
		this.hardwareScanService.setHasDevicesToRecover(this.devices.find(x => x.isSelected));
	}

	onSelectAllDevices() {
		this.devices.map(device => device.isSelected = true);
		this.hardwareScanService.setHasDevicesToRecover(true);
	}

	onDeselectAllDevices() {
		this.devices.map(device => device.isSelected = false);
		this.hardwareScanService.setHasDevicesToRecover(false);
	}
}
