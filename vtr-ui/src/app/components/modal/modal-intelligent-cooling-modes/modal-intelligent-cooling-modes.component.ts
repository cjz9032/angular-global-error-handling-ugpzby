import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-intelligent-cooling-modes',
	templateUrl: './modal-intelligent-cooling-modes.component.html',
	styleUrls: ['./modal-intelligent-cooling-modes.component.scss']
})
export class ModalIntelligentCoolingModesComponent implements OnInit {

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	closeModal() {
		this.activeModal.close('close');
	}
	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.closeModal();
	}

	@HostListener('document:keydown.enter', ['$event']) onKeydownEnterHandler(event: KeyboardEvent) {
		this.closeModal();
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.Intelligent-Cooling-Modes-Modal') as HTMLElement;
		modal.focus();
	}
}
