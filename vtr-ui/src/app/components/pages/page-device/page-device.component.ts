import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';

@Component({
	selector: 'vtr-page-device',
	templateUrl: './page-device.component.html',
	styleUrls: ['./page-device.component.scss']
})
export class PageDeviceComponent implements OnInit {

	title = 'My Device';
	subtitle = "My device status";

	@Input() type: string = this.type || 'system';
	@Input() description: string = this.description || '';
	@Input() items: any[];

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
			'description': 'Lorem ipsum dolor sit amet del Lorem ipsum dolor sit amet del',
			'detail': 'Lear more',
			'path': 'support',
			'asLink': false
		},
		{
			'status': 1,
			'id': 'memory',
			'title': 'Memory(16GB if DDR3 RAM)',
			'description': 'Lorem ipsum dolor sit amet del Lorem ipsum dolor sit amet del',
			'detail': 'Free memory',
			'path': 'support',
			'asLink': false
		},
		{
			'status': 1,
			'id': 'disk',
			'title': 'Disk space(256GB Toshiba SSD)',
			'description': 'Lorem ipsum dolor sit amet del Lorem ipsum dolor sit amet del',
			'detail': 'Learn more',
			'path': 'support',
			'asLink': false
		},
		{
			'status': 0,
			'id': 'systemupdate',
			'title': 'Software up to date(Updated yesterday)',
			'description': 'Lorem ipsum dolor sit amet del Lorem ipsum dolor sit amet del',
			'detail': 'System update',
			'path': '/system-updates',
			'asLink': false
		},
		{
			'status': 1,
			'id': 'warranty',
			'title': 'Out of warranty(Expired on 10/10/2017)',
			'description': 'Lorem ipsum dolor sit amet del Lorem ipsum dolor sit amet del',
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
