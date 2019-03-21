import { Component, OnInit } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { $ } from 'protractor';

@Component({
	selector: 'vtr-page-security-password',
	templateUrl: './page-security-password.component.html',
	styleUrls: ['./page-security-password.component.scss']
})
export class PageSecurityPasswordComponent implements OnInit {

	title = 'Password Health';
	back = 'BACK';
	backarrow = '< ';

	IsDashlaneInstalled: Boolean = false;

	constructor(public mockService: MockService) { }

	ngOnInit() {
	}
	dashlane() {
		// window.open('https://www.dashlane.com/lenovo/');
		this.IsDashlaneInstalled = this.IsDashlaneInstalled ? false : true;

	}
}
