import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';

@Component({
	selector: 'vtr-home-security-card',
	templateUrl: './home-security-card.component.html',
	styleUrls: ['./home-security-card.component.scss']
})
export class HomeSecurityCardComponent implements OnInit {
	dialogService: DialogService;


	constructor(dialogService: DialogService) {
		this.dialogService = dialogService;
	}

	ngOnInit() {
	}

	joinGroup() {
		this.dialogService.openInvitationCodeDialog();
	}

}
