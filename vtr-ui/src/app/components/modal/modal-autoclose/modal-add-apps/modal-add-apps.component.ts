import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { isUndefined } from 'util';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';

@Component({
	selector: 'vtr-modal-add-apps',
	templateUrl: './modal-add-apps.component.html',
	styleUrls: [ './modal-add-apps.component.scss' ]
})
export class ModalAddAppsComponent implements OnInit, AfterViewInit {
	statusAskAgain: boolean;
	@Input() showAppsModal: boolean;
	@Output() closeAddAppsModal = new EventEmitter<any>();
	@Output() addAppToList = new EventEmitter<any>();
	public loading = true;
	public loadingNoApps = false;
	runningList: any = [];
	public isChecked: any = [];
	constructor(private gamingAutoCloseService: GamingAutoCloseService) { }
	public statusitem;
	ariaLabel = 'Auto close add apps window opened';
	//constructor() { }

	ngOnInit() {
		this.refreshRunningList();
		document.getElementById('close').focus();
	}
	ngAfterViewInit() {
		document.getElementById('close').focus();
	}

	async refreshRunningList() {
		try {
			const result: any = await this.gamingAutoCloseService.getAppsAutoCloseRunningList();
			this.runningList = [];
			if (result && !isUndefined(result.processList)) {
				this.runningList = result.processList || [];
			}
			this.loadingNoApps = this.runningList.length === 0 ? true : false;
			this.loading = false;
			if (this.loadingNoApps) {
				this.ariaLabel = 'gaming.autoClose.modalTurnAutoCloseNarrator.running';
			} else {
				this.ariaLabel = 'gaming.autoClose.modalTurnAutoCloseNarrator.open';
			}
			setTimeout(() => {
				document.getElementById('close').focus();
			}, 100);
		} catch (error) {
			this.loading = false;
			this.loadingNoApps = true;
			setTimeout(() => {
				document.getElementById('close').focus();
			}, 100);
		}
	}

	addAppData(event: any, i) {
		this.isChecked[i] = !this.isChecked[i];
		this.statusitem = this.isChecked[i];
		this.addAppToList.emit({ checked: this.isChecked[i], app: event.target.value });
	}

	closeModal(action: boolean) {
		this.closeAddAppsModal.emit(action);
		document.getElementById('main-wrapper').focus();
	}

	runappKeyup(event, index) {
		if (event.which === 9) {
			if (index === this.runningList.length - 1) {
				let txt1 = document.getElementById('close');
				txt1.focus();
			}
		}
	}
}
