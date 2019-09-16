import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isUndefined } from 'util';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';

@Component({
	selector: 'vtr-modal-add-apps',
	templateUrl: './modal-add-apps.component.html',
	styleUrls: ['./modal-add-apps.component.scss']
})
export class ModalAddAppsComponent implements OnInit, OnChanges {
	statusAskAgain: boolean;
	@Input() showAppsModal: boolean;
	@Output() closeAddAppsModal = new EventEmitter<boolean>();
	@Output() addAppToList = new EventEmitter<boolean>();
	public loading = true;
	public loadingNoApps = false;
	runningList: any = [];
	constructor(private gamingAutoCloseService: GamingAutoCloseService) { }
	public statusitem;
	//constructor() { }

	ngOnInit() {
		this.refreshRunningList();
	}

	async refreshRunningList() {
		try {
			const result: any = await this.gamingAutoCloseService.getAppsAutoCloseRunningList();
			this.loading = false;
			this.runningList = [];
			if (result && !isUndefined(result.processList)) {
				this.runningList = result.processList || [];
			}
			this.loadingNoApps = this.runningList.length === 0 ? true : false;
		} catch (error) {
			this.loading = false;
			this.loadingNoApps = true;
		}
	}

	addAppData(event: any) {
		this.statusitem = event.target.checked;
		this.addAppToList.emit(event);
	}

	closeModal(action: boolean) {
		this.closeAddAppsModal.emit(action);
	}

}
