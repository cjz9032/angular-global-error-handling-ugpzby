import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-advisor-wifi-security',
	templateUrl: './advisor-wifi-security.component.html',
	styleUrls: ['./advisor-wifi-security.component.scss']
})

export class AdvisorWifiSecurityComponent implements OnInit {
	/**** passing to ItemParent from metrics ****/
	@Input() metricsParent: string;

	constructor(private deviceService: DeviceService) { }

	ngOnInit() {
	}
}
