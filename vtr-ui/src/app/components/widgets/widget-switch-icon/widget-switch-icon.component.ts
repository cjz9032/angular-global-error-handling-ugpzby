import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';

// @ts-ignore
@Component({
	selector: 'vtr-widget-switch-icon',
	templateUrl: './widget-switch-icon.component.html',
	styleUrls: ['./widget-switch-icon.component.scss']
})
export class WidgetSwitchIconComponent implements OnInit {

	@Input() title: string;
	@Input() icon: string;
	@Input() isChecked: boolean = false;

	public id: string = "a" + new Date().getTime() + Math.floor(Math.random() * 100);

	constructor(
		public deviceService: DeviceService
	) {
	}

	ngOnInit() {
		console.log(this.title, this.icon);
	}

	checkUnCheck($event) {
		if ($event.target.checked) {
			this.isChecked = true;
		} else {
			this.isChecked = false;
		}

	}

}
