import { Component, OnInit, Input } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';

@Component({
	selector: 'vtr-page-security-antivirus',
	templateUrl: './page-security-antivirus.component.html',
	styleUrls: ['./page-security-antivirus.component.scss']
})
export class PageSecurityAntivirusComponent implements OnInit {
	@Input() public productName = 'product name';

	title = 'Anti-Virus';
	subTitle = `You are currently being protected by ${ this.productName }.
	However, you could be better protected with McAfee LiveSafe. Learn more below.`;
	avType = 2;
	back = 'BACK';
	backarrow = '< ';
	value = 1;

	constructor(public mockService: MockService) { }

	ngOnInit() {
	}
}
