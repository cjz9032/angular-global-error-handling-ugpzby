import { Component, OnInit, HostListener } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { Vpn, EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-page-security-internet',
	templateUrl: './page-security-internet.component.html',
	styleUrls: ['./page-security-internet.component.scss']
})
export class PageSecurityInternetComponent implements OnInit {

	title = 'VPN Security';

	vpn: Vpn;
	status: string;

	constructor(public mockService: MockService, vantageShellService: VantageShellService) {
		this.vpn = vantageShellService.getSecurityAdvisor().vpn;
		this.status = this.vpn.status;
		this.vpn.on(EventTypes.vpnStatusEvent, (status: string) => {
			this.status = status;
		});
	}

	ngOnInit() {}

	getSurfEasy(): void {
		this.vpn.download();
	}

	openSurfEasy(): void {
		this.vpn.launch();
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.vpn.refresh();
	}
}
