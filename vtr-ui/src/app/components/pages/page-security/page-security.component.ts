import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../../services/security/security.service';
import { MockService } from '../../../services/mock/mock.service';

@Component({
	selector: 'vtr-page-security',
	templateUrl: './page-security.component.html',
	styleUrls: ['./page-security.component.scss']
})
export class PageSecurityComponent implements OnInit {
	title = 'Security';

	constructor(
		public securityService: SecurityService,
		public mockService: MockService
	) { }

	ngOnInit() {
	}

}
