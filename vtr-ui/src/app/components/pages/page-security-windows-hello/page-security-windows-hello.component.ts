import { Component, OnInit, HostListener } from '@angular/core';
import { MockService } from 'src/app/services/mock/mock.service';
import { WindowsHello, EventTypes } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-page-security-windows-hello',
	templateUrl: './page-security-windows-hello.component.html',
	styleUrls: ['./page-security-windows-hello.component.scss']
})
export class PageSecurityWindowsHelloComponent implements OnInit {

	title = 'Windows Hello';

	windowsHello: WindowsHello;
	status: string;

	constructor(public mockService: MockService, vantageShellService: VantageShellService) {
		this.windowsHello = vantageShellService.getSecurityAdvisor().windowsHello;
		this.updateStatus();
		this.windowsHello.on(EventTypes.helloFingerPrintStatusEvent, () => {
			this.updateStatus();
		}).on(EventTypes.helloFacialIdStatusEvent, () => {
			this.updateStatus();
		});
	}

	ngOnInit() { }

	setUpWindowsHello(): void {
		this.windowsHello.launch();
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.windowsHello.refresh();
	}

	private updateStatus(): void {
		if (this.windowsHello.fingerPrintStatus === 'active' ||
			this.windowsHello.facialIdStatus === 'active') {
			this.status = 'enabled';
		} else {
			this.status = 'disabled';
		}
	}
}
