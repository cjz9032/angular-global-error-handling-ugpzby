import { Component, OnInit } from '@angular/core';
import { AccessTokenService } from '../../common/services/access-token.service';

@Component({
	selector: 'vtr-side-bar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	constructor(
		private accessTokenService: AccessTokenService,
	) {
	}

	ngOnInit() {
	}

	deleteAccessToken() {
		this.accessTokenService.removeAccessToken();
	}
}
