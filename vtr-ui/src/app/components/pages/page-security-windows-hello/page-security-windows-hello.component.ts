import { Component, OnInit } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';

@Component({
	selector: 'vtr-page-security-windows-hello',
	templateUrl: './page-security-windows-hello.component.html',
	styleUrls: ['./page-security-windows-hello.component.scss']
})
export class PageSecurityWindowsHelloComponent implements OnInit {

	title = 'Windows Hello';
	back = 'BACK';
	backarrow = '< ';
	IsWindowsHelloInstalled = 'not-installed';
	constructor(public mockService: MockService) { }

	ngOnInit() {
	}

}
