import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';

@Component({
	selector: 'vtr-modal-find-us',
	templateUrl: './modal-find-us.component.html',
	styleUrls: ['./modal-find-us.component.scss'],
})
export class ModalFindUsComponent implements OnInit {
	region: string;

	constructor(public activeModal: NgbActiveModal, private localInfoService: LocalInfoService) {
		localInfoService
			.getLocalInfo()
			.then((result) => {
				this.region = result.GEO;
			})
			.catch((e) => {
				this.region = 'us';
			});
	}

	ngOnInit() {}

	closeModal() {
		this.activeModal.close(false);
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.Find-Us-Modal') as HTMLElement;
		modal.focus();
	}
}
