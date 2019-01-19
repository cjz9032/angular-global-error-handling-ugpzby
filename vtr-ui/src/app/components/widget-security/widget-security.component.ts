import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../services/security/security.service';

@Component({
	selector: 'vtr-widget-security',
	templateUrl: './widget-security.component.html',
	styleUrls: ['./widget-security.component.scss']
})
export class WidgetSecurityComponent implements OnInit {

	constructor(
		public securityService: SecurityService
	) { }

	ngOnInit() {
	}

}
