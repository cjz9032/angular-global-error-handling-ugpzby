import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-connected-home-status',
	templateUrl: './connected-home-status.component.html',
	styleUrls: ['./connected-home-status.component.scss']
})
export class ConnectedHomeStatusComponent implements OnInit {
	badgeStatus = true;
	constructor(
		public dialogService: DialogService,
		public modalService: NgbModal,
	) {
	}

	ngOnInit() {}

	public switchBadge() {
		if (this.badgeStatus) {
			this.badgeStatus = false;
		} else {
			this.badgeStatus = true;
		}
	}
}
