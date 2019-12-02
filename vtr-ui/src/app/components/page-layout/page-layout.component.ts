import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-page-layout',
	templateUrl: './page-layout.component.html',
	styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit {

	@Input() pageTitle: string;
	@Input() textId: string;
	@Input() pageCssClass: string;
	@Input() parentPath: string;
	@Input() backLinkText: string;
	@Input() menuItems: any[];

	constructor(public deviceService: DeviceService) { }

	ngOnInit() {
	}

}
