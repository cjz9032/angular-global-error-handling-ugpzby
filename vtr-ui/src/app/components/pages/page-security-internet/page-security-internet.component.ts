import { Component, OnInit } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';

@Component({
	selector: 'vtr-page-security-internet',
	templateUrl: './page-security-internet.component.html',
	styleUrls: ['./page-security-internet.component.scss']
})
export class PageSecurityInternetComponent implements OnInit {

	title = 'VPN Security';
	back="BACK";
	backarrow="< ";
	IsDashlaneInstalled: string="not-installed";
	constructor(public mockService: MockService) { }

	ngOnInit() {
	}
	surfeasy() {
		 window.open("https://www.surfeasy.com/lenovo/")
	}
}
