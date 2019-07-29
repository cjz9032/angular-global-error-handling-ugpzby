import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegionService } from 'src/app/services/region/region.service';

@Component({
	selector: 'vtr-modal-find-us',
	templateUrl: './modal-find-us.component.html',
	styleUrls: ['./modal-find-us.component.scss']
})
export class ModalFindUsComponent implements OnInit, AfterViewInit {

	region: string;

	constructor(
		public activeModal: NgbActiveModal,
		private regionService: RegionService
	) {
		regionService.getRegion().subscribe({
			next: x => this.region = x,
			error: err => this.region = 'us'
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
