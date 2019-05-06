import { Component, Input, EventEmitter } from '@angular/core';
import { WifiHomeViewModel } from 'src/app/data-models/security-advisor/wifisecurity.model';
import { SecurityService } from 'src/app/services/security/security.service';

@Component({
	selector: 'vtr-connected-home',
	templateUrl: './connected-home.component.html',
	styleUrls: ['./connected-home.component.scss']
})
export class ConnectedHomeComponent {

	@Input() data: WifiHomeViewModel;
	@Input() isShowInvitationCode: boolean;
	emitter = new EventEmitter();
	showDescribe = false;


	constructor(
		public securityService: SecurityService
	) { }
}
