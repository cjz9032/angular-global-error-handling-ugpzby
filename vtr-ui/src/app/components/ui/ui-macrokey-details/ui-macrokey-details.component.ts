import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { isUndefined } from 'util';

@Component({
	selector: 'vtr-ui-macrokey-details',
	templateUrl: './ui-macrokey-details.component.html',
	styleUrls: [ './ui-macrokey-details.component.scss' ]
})
export class UiMacrokeyDetailsComponent implements OnInit, DoCheck {
	@Input() number;
	@Input() isNumberpad = false;
	@Output() isRecording = new EventEmitter<any>();
	@Input() keyData: any;
	public recording: Boolean = false;
	public showModal: Boolean = false;
	public stopInterval: any;
	public recordsList: any = [];
	public inputProvided: Boolean = false;
	public waitingDone: Boolean = false;

	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.timeoutRecording.title',
		bodyText: 'gaming.macroKey.popupContent.timeoutRecording.body',
		btnConfirm: false
	};

	constructor() {}

	ngOnInit() {}

	onStartClicked(event) {
		setTimeout(() => {
			console.log('wait done!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
			this.waitingDone = true;
		}, 10000);
		this.toggleRecording();
	}

	onStopClicked(event) {
		if (this.keyData.inputs.length > 0) {
			this.number.status = true;
		}
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

	ngDoCheck() {
		// const currentKeyData = this.keyData;
		// if (this.recording) {
		// 	if (currentKeyData.inputs.length > 0) {
		// 		this.inputProvided = true;
		// 	} else {
		// 		if (this.waitingDone) {
		// 			if (currentKeyData.inputs.length === 0) {
		// 				if (this.inputProvided) {
		// 					this.modalContent.bodyText = 'gaming.macroKey.popupContent.inputStopped.body';
		// 					this.showModal = !this.showModal;
		// 				} else {
		// 					this.modalContent.bodyText = 'gaming.macroKey.popupContent.timeoutRecording.body';
		// 					this.showModal = !this.showModal;
		// 				}
		// 				this.toggleRecording();
		// 			}
		// 		}
		// 	}
		// }
	}
}
