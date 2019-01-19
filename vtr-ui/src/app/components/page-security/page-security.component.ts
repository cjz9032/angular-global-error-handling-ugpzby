import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../services/security/security.service';

@Component({
	selector: 'vtr-page-security',
	templateUrl: './page-security.component.html',
	styleUrls: ['./page-security.component.scss']
})
export class PageSecurityComponent implements OnInit {

	constructor(
		public securityService: SecurityService
	) { }

	ngOnInit() {
	}

}
