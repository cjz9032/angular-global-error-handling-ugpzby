import { Component, OnInit } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';

@Component({
	selector: 'vtr-page-security-antivirus',
	templateUrl: './page-security-antivirus.component.html',
	styleUrls: ['./page-security-antivirus.component.scss']
})
export class PageSecurityAntivirusComponent implements OnInit {

	title = 'Anti-Virus';
	avType = 2;
	back = 'BACK';
	backarrow = '< ';
	value = 1;

	constructor(public mockService: MockService) { }

	ngOnInit() {
	}
}
