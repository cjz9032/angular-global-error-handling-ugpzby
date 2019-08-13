import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
	selector: 'vtr-ui-hardware-list-checkbox',
	templateUrl: './ui-hardware-list-checkbox.component.html',
	styleUrls: ['./ui-hardware-list-checkbox.component.scss']
})
export class UiHardwareListCheckboxComponent implements OnInit {

	public select = this.translate.instant('hardwareScan.select');
	public deselect = this.translate.instant('hardwareScan.deselect');
	public allOptions = this.translate.instant('hardwareScan.allOptions');

	@Input() devices: any[];

	constructor(private translate: TranslateService) { }

	ngOnInit() { }

	onSelectAllDevices() {
		this.devices.map(device => device.isSelected = true);
	}

	onDeselectAllDevices() {
		this.devices.map(device => device.isSelected = false);
	}
}
