import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
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
	public loading: boolean = true;
	constructor(private gamingAutoCloseService: GamingAutoCloseService) { }

	ngOnInit() {
		this.loading = this.loaderData.loading;
	}

	addAppData(event: any) {
		this.addAppToList.emit(event);
	}

	closeModal(action: boolean) {
		this.closeAddAppsModal.emit(action);
	}
}
