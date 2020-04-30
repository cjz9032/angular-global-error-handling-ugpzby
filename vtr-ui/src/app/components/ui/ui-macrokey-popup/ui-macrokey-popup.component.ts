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
		this.focusElement();
		this.hiddenScroll();
	}

	submitAction(isConfirm: boolean = false) {
		this.action.emit(isConfirm);
		this.hiddenScroll();
		document.getElementById('main-wrapper').focus();
	}

	keydownFn(event) {
		if (event.which === 9) {
			this.focusElement();
		}
	}

	focusElement() {
		setTimeout(() => {
			const popupFocus = document.getElementsByClassName('macrokey_popup_close_btn')[0] as HTMLElement;
			if (popupFocus) {
				popupFocus.focus();
			}
		}, 10);
	}

	hiddenScroll() {
		const selectorVtr = (document.getElementsByClassName('vtr-app')[0] as HTMLElement);
		if (selectorVtr.style.overflowY === 'hidden') {
			selectorVtr.style.overflowY = 'auto';
			selectorVtr.style.overflowX = 'hidden';
		} else {
			selectorVtr.style.overflowY = 'hidden';
			selectorVtr.style.overflowX = 'hidden';
		}
	}
}
