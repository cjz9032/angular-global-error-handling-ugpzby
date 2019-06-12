import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isUndefined } from 'util';

@Component({
	selector: 'vtr-ui-macrokey-details',
	templateUrl: './ui-macrokey-details.component.html',
	styleUrls: [ './ui-macrokey-details.component.scss' ]
})
export class UiMacrokeyDetailsComponent implements OnInit {
	@Input() number;
	@Input() isNumberpad = false;
	@Output() isRecording = new EventEmitter<any>();
	@Input() keyData: any;
	public recording = false;
	public showModal = false;
	public stopInterval: any;
	public recordsList: any = [];

	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.timeoutRecording.title',
		bodyText: 'gaming.macroKey.popupContent.timeoutRecording.body',
		btnConfirm: false
	};

	constructor() {}

	ngOnInit() {}

	onStartClicked(event) {
		// Show warning if no input is given for 10 seconds
		setTimeout(() => {
			this.modalContent.bodyText = 'gaming.macroKey.popupContent.inputStopped.body';
			this.showModal = !this.showModal;
		}, 10000);
		this.stopInterval = setInterval(() => {
			this.modalContent.bodyText = 'gaming.macroKey.popupContent.timeoutRecording.body';
			this.showModal = !this.showModal;
		}, 20000);
		this.toggleRecording();
	}

	onStopClicked(event) {
		this.toggleRecording();
		clearInterval(this.stopInterval);
	}

	toggleRecording() {
		this.recording = !this.recording;
		this.isRecording.emit(this.recording);
	}

	recordsDelete(records) {
		records = records || [];
		records.forEach((record: any, ri: number) => {
			console.log(record);
			console.log(ri, 'Index');
		});
	}
}
