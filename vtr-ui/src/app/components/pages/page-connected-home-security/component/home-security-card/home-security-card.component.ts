import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { HomeSecurityLocation } from 'src/app/data-models/home-security/home-security-location.model';

@Component({
	selector: 'vtr-home-security-card',
	templateUrl: './home-security-card.component.html',
	styleUrls: ['./home-security-card.component.scss']
})
export class HomeSecurityCardComponent implements OnInit {
	@Input() location: HomeSecurityLocation;
	@Input() permission: any;
	dialogService: DialogService;


	constructor(dialogService: DialogService) {
		this.dialogService = dialogService;
	}

	ngOnInit() {
	}

	joinGroup() {
		if (this.location && this.location.isLocationServiceOn) {
			this.dialogService.openInvitationCodeDialog();
		} else {
			this.isShowCHSPermissionDialog().then((result) => {
				if (result) {
					this.dialogService.openCHSPermissionModal();
				}
			});
		}
	}

	isShowCHSPermissionDialog(): Promise<boolean> {
		return this.permission.getSystemPermissionShowed().then((result) => {
			if (!result) {
				if (this.location && this.location.isDeviceServiceOn && this.location.isComputerServiceOn) {
					this.permission.requestPermission('geoLocatorStatus');
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		});
	}
}
