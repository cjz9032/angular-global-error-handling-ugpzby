import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-gaming-legionedge',
	templateUrl: './modal-gaming-legionedge.component.html',
	styleUrls: ['./modal-gaming-legionedge.component.scss']
})
export class ModalGamingLegionedgeComponent implements OnInit {

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	closeModal() {
		this.activeModal.close('close');
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.gaming-help-modal') as HTMLElement;
		modal.focus();
	}
}
