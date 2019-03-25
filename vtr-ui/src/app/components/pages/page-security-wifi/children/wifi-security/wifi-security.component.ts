import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'wifi-security',
	templateUrl: './wifi-security.component.html',
	styleUrls: ['./wifi-security.component.scss']
})
export class WifiSecurityComponent implements OnInit {
	IsWifiSecurityInstalled: string = "not-installed";
	// IsWifiSecurityInstalled: string = "active";
	showAllNetworks: boolean = true;

	constructor() { }

	ngOnInit() {
	}

	enableWifiSecurity() {
		this.IsWifiSecurityInstalled = "active";

	openThreatLocator() {
		let articleDetailModal: NgbModalRef = this.modalService.open(ModalThreatLocatorComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Threat-Locator-Modal'
		});
	}
}
