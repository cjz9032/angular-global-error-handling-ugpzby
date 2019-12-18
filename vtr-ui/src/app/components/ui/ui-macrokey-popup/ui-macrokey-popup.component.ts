import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-macrokey-popup',
	templateUrl: './ui-macrokey-popup.component.html',
	styleUrls: ['./ui-macrokey-popup.component.scss']
})
export class UiMacrokeyPopupComponent implements OnInit {
	@Input() showModal: boolean;
	@Input() modalContent: any;
	@Output() action = new EventEmitter<boolean>();
	constructor() { }

	ngOnInit() {
		const popupFocus = document.getElementById('close');
		popupFocus.focus();
		this.hiddenScroll(true);
	}

	submitAction(isConfirm: boolean = false) {
		this.action.emit(isConfirm);
		this.hiddenScroll(isConfirm);
		document.getElementById('main-wrapper').focus();
	}

	keydownFn(event) {
		if (event.which === 9) {
			const txt1 = document.getElementById('close');
			txt1.focus();
		}
	}

	hiddenScroll(action: boolean) {
		if (action) {
			(document.getElementsByClassName('vtr-app')[0] as HTMLElement).style.overflow = 'hidden';
		} else {
			(document.getElementsByClassName('vtr-app')[0] as HTMLElement).style.overflow = '';
		}
	}
}
