import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';

@Component({
	selector: 'vtr-widget-device',
	templateUrl: './widget-device.component.html',
	styleUrls: ['./widget-device.component.scss']
})
export class WidgetDeviceComponent implements OnInit {

	subtitle = 'My device status';

	family = 'Ideapad 720s  (14")';
	serial = '123123131';
	productNumber = '81BD001QUS';
	bios = 'v1.3.1.2';

	virusImage = '//vtr-ui//src//assets//Device_antivirus.png';

	dummyDeviceInformation = [
		{
			'status': 0,
			'id': 'processor',
			'title': 'Processor(Intel core i7-8545 @ 1.9GHz)',
			'description': '',
			'detail': 'Learn more',
			'path': 'ms-settings:about',
			'asLink': false,
			'isSystemLink': true
		},
		{
			'status': 1,
			'id': 'memory',
			'title': 'Memory(16GB of DDR3 RAM)',
			'description': '',
			'detail': 'Free memory',
			'path': 'ms-settings:about',
			'asLink': false,
			'isSystemLink': true
		},
		{
			'status': 1,
			'id': 'disk',
			'title': 'Disk space(256GB Toshiba SSD)',
			'description': '',
			'detail': 'Learn more',
			'path': 'ms-settings:storagesense',
			'asLink': false,
			'isSystemLink': true
		},
		{
			'status': 0,
			'id': 'systemupdate',
			'title': 'Software up to date(Updated yesterday)',
			'description': '',
			'detail': 'System update',
			'path': '/system-updates',
			'asLink': false
		},
		{
			'status': 1,
			'id': 'warranty',
			'title': 'Out of warranty(Expired on 10/10/2017)',
			'description': '',
			'detail': 'Extend warranty',
			'path': 'support',
			'asLink': false
		},
	];

	constructor(
		public deviceService: DeviceService
	) { }

	ngOnInit() {
	}

}
