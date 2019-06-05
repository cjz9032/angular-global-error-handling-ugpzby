import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-macrokey-popup',
	templateUrl: './ui-macrokey-popup.component.html',
	styleUrls: ['./ui-macrokey-popup.component.scss']
})
export class UiMacrokeyPopupComponent implements OnInit {
	@Input() clearRecordPopup: boolean;
	@Input() timeoutRecording: boolean;
	@Input() showModal: boolean;
	@Input() modalContent: any;
	constructor() { }

	ngOnInit() {
	}
	close() {
		this.showModal = false;
	}
}
