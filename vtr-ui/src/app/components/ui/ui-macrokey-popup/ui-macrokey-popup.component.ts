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
		const popupFocus = document.getElementsByClassName('macrokey_popup_close_btn')[0] as HTMLElement;
		popupFocus.focus();
		this.hiddenScroll();
	}

	submitAction(isConfirm: boolean = false) {
		this.action.emit(isConfirm);
		this.hiddenScroll();
		document.getElementById('main-wrapper').focus();
	}

	keydownFn(event) {
		if (event.which === 9) {
			const popupFocus = document.getElementsByClassName('macrokey_popup_close_btn')[0] as HTMLElement;
			popupFocus.focus();
		}
	}

	hiddenScroll() {
		if ((document.getElementsByClassName('vtr-app')[0] as HTMLElement).style.overflowY === 'hidden') {
			(document.getElementsByClassName('vtr-app')[0] as HTMLElement).style.overflowY = 'auto';
			(document.getElementsByClassName('vtr-app')[0] as HTMLElement).style.overflowX = 'hidden';
		} else {
			(document.getElementsByClassName('vtr-app')[0] as HTMLElement).style.overflowY = 'hidden';
			(document.getElementsByClassName('vtr-app')[0] as HTMLElement).style.overflowX = 'hidden';
		}
	}
}
