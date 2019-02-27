import { Component, OnInit } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';

@Component({
	selector: 'vtr-page-security-wifi',
	templateUrl: './page-security-wifi.component.html',
	styleUrls: ['./page-security-wifi.component.scss']
})
export class PageSecurityWifiComponent implements OnInit {

	title = 'Wifi Security';
	isLWSEnabled = true;
	viewSecChkRoute = 'viewSecChkRoute';

	constructor(public mockService: MockService) { }

	ngOnInit() {
	}
	enableWiFiSecurity(event) {
		console.log('enableWiFiSecurity button clicked');
	}

}
