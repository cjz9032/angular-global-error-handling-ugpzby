import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-voice',
	templateUrl: './modal-voice.component.html',
	styleUrls: ['./modal-voice.component.scss']
})
export class ModalVoiceComponent implements OnInit {

	constructor(public activeModal: NgbActiveModal) { }
	value: any;
	metricsParent: any;
	ngOnInit() {
	}

	closeModal() {
		this.activeModal.close('close');
	}

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.closeModal();
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.Voice-Modal') as HTMLElement;
		modal.focus();
	}

}
