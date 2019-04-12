import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { BaseComponent } from "../../../../base/base.component";

@Component({
	selector: 'vtr-advisor-wifi-security',
	templateUrl: './advisor-wifi-security.component.html',
	styleUrls: ['./advisor-wifi-security.component.scss']
})

export class AdvisorWifiSecurityComponent extends BaseComponent implements OnInit {
	/**** passing to ItemParent from metrics ****/
	@Input() metricsParent: string;
	wifiSecurityEnabled: boolean = true;

	constructor(private deviceService: DeviceService) { super(); }

	ngOnInit() {
	}
}
