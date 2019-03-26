import { Component, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../base/base.component";

@Component({
	selector: 'wifi-security',
	templateUrl: './wifi-security.component.html',
	styleUrls: ['./wifi-security.component.scss']
})
export class WifiSecurityComponent extends BaseComponent implements OnInit {
	IsWifiSecurityInstalled: string = "not-installed";
	// IsWifiSecurityInstalled: string = "active";
	showAllNetworks: boolean = true;

	constructor() { super(); }

	ngOnInit() {
	}

	enableWifiSecurity() {
		this.IsWifiSecurityInstalled = "active";
	}
}
