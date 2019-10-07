import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';

@Component({
	selector: 'vtr-modal-turn-on',
	templateUrl: './modal-turn-on.component.html',
	styleUrls: ['./modal-turn-on.component.scss']
})
export class ModalTurnOnComponent implements OnInit, AfterViewInit {
	setAutoClose: any;
	constructor(private gamingAutoCloseService: GamingAutoCloseService) { }

	@Input() showTurnOnModal: boolean;
	@Output() actionTurnOn = new EventEmitter<boolean>();
	@Output() actionNotNow = new EventEmitter<boolean>();
	@Output() closeTurnOnModal = new EventEmitter<boolean>();
	@Output() actionNeedAsk = new EventEmitter<any>();
	public isChecked: any;
	ngOnInit() {
		document.getElementById('closedialog').focus();
	}
	ngAfterViewInit() {
		document.getElementById('closedialog').focus();
	}

	setAksAgain(event: any) {
		this.isChecked = !this.isChecked;
		this.actionNeedAsk.emit(this.isChecked);
	}

	turnOnAction(isConfirm: boolean) {
		this.actionTurnOn.emit(isConfirm);
	}

	notNowAction(event: any) {
		this.actionNotNow.emit(event);
	}

	closeModal(action: boolean) {
		this.closeTurnOnModal.emit(action);
		document.getElementById('main-wrapper').focus();
	}

	keydownFn(event) {
		if (event.which === 9) {
			document.getElementById('closedialog').focus();
		}
	}
}
