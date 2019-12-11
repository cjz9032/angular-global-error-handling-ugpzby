import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-app-update-available',
	templateUrl: './modal-app-update-available.component.html',
	styleUrls: ['./modal-app-update-available.component.scss']
})
export class ModalAppUpdateAvailableComponent implements OnInit {

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	public onUpdateClick() {
		this.activeModal.close(true);
	}

	public onCancelClick() {
		this.activeModal.close(false);
	}


	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.confirmation-modal') as HTMLElement;
		modal.focus();
	}

}
