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
	}

	submitAction(isConfirm: boolean = false) {
		this.action.emit(isConfirm);
	}

	keydownFn(event){
		console.log("event---keydown--------------->",event);
		if(event.which === 9){
			console.log("23333333333333334444444444444444444444")
			let txt1 = document.getElementById("close");
			txt1.focus();
		}
	}
}
