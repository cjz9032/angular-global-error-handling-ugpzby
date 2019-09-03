import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { HomeSecurityDevicePosture } from 'src/app/data-models/home-security/home-security-device-posture.model';

@Component({
	selector: 'vtr-home-security-card',
	templateUrl: './home-security-card.component.html',
	styleUrls: ['./home-security-card.component.scss']
})
export class HomeSecurityCardComponent implements OnInit {
	@Input() data: HomeSecurityDevicePosture;
	dialogService: DialogService;


	constructor(dialogService: DialogService) {
		this.dialogService = dialogService;
	}

	ngOnInit() {
	}

	joinGroup() {
		if (this.data && this.data.isLocationServiceOn) {
			this.dialogService.openInvitationCodeDialog();
		} else {
			this.dialogService.openCHSPermissionModal();
		}
	}

}
