import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';

@Component({
	selector: 'vtr-modal-find-us',
	templateUrl: './modal-find-us.component.html',
	styleUrls: ['./modal-find-us.component.scss']
})
export class ModalFindUsComponent implements OnInit, AfterViewInit {

	region: string;

	constructor(
		public activeModal: NgbActiveModal,
		private localInfoService: LocalInfoService
	) {
		localInfoService.getLocalInfo().then(result => {
			this.region = result.Lang;
		}).catch(e => {
			this.region = 'us';
		});
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		setTimeout(() => { document.getElementById('findUs-dialog').parentElement.parentElement.parentElement.parentElement.focus(); }, 0);
	}

	public onCancelClick() {
		this.activeModal.close(false);
	}
}
