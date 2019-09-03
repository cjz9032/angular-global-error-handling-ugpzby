import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isUndefined } from 'util';

@Component({
	selector: 'vtr-modal-add-apps',
	templateUrl: './modal-add-apps.component.html',
	styleUrls: ['./modal-add-apps.component.scss']
})
export class ModalAddAppsComponent implements OnInit {
	statusAskAgain: boolean;
	@Input() loaderData: any;
	@Input() showAppsModal: boolean;
	@Input() runningListData: any[];
	@Output() closeAddAppsModal = new EventEmitter<boolean>();
	@Output() addAppToList = new EventEmitter<boolean>();
	public loading = true;
	public loadingNoApps = false;
	constructor() { }

	ngOnInit() {
		if (!isUndefined(this.loaderData)) {
			this.loading = this.loaderData.loading;
			this.loadingNoApps = this.loaderData.noApps;
		}
	}

	addAppData(event: any) {
		this.addAppToList.emit(event);
	}

	closeModal(action: boolean) {
		this.closeAddAppsModal.emit(action);
	}

}
