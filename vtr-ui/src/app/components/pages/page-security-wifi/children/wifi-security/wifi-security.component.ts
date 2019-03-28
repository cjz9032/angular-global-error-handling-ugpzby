import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalThreatLocatorComponent } from 'src/app/components/modal/modal-threat-locator/modal-threat-locator.component';
import { BaseComponent } from "../../../../base/base.component";

@Component({
	selector: 'wifi-security',
	templateUrl: './wifi-security.component.html',
	styleUrls: ['./wifi-security.component.scss']
})
export class WifiSecurityComponent extends BaseComponent implements OnInit {
	isWifiSecurityEnabled: boolean = true;
	showAllNetworks: boolean = true;
	isCollapsed: boolean = true;
	showMore: boolean = false;

	constructor(
		public modalService: NgbModal
	) {
		super();
	}

	ngOnInit() {
		this.isWifiSecurityEnabled = false;
	}

	enableWifiSecurity() {
		this.isWifiSecurityEnabled = true;
	}

	openThreatLocator() {
		let articleDetailModal: NgbModalRef = this.modalService.open(ModalThreatLocatorComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Threat-Locator-Modal'
		});
	}
}
