import { Component, OnInit, HostListener } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { PasswordManager, EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-page-security-password',
	templateUrl: './page-security-password.component.html',
	styleUrls: ['./page-security-password.component.scss']
})
export class PageSecurityPasswordComponent implements OnInit {

	title = 'Password Health';

	passwordManager: PasswordManager;
	status: string;

	constructor(public mockService: MockService, vantageShellService: VantageShellService) {
		this.passwordManager = vantageShellService.getSecurityAdvisor().passwordManager;
		this.status = this.passwordManager.status;
		this.passwordManager.on(EventTypes.pmStatusEvent, (status: string) => {
			this.status = status;
		});
	}

	ngOnInit() {}

	getDashLane(): void {
		this.passwordManager.download();
	}

	openDashLane(): void {
		this.passwordManager.launch();
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.passwordManager.refresh();
	}
}
