import { MacrokeyService } from './../../../services/gaming/macrokey/macrokey.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-macrokey-details',
	templateUrl: './ui-macrokey-details.component.html',
	styleUrls: ['./ui-macrokey-details.component.scss']
})
export class UiMacrokeyDetailsComponent implements OnInit {
	@Input() number;
	@Input() isNumberpad = false;
	@Output() isRecording = new EventEmitter<any>();
	@Input() recordedData: any = [];
	public recording = false;
	public showModal = false;
	public stopInterval: any;

	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.timeoutRecording.title',
		bodyText: 'gaming.macroKey.popupContent.timeoutRecording.body',
		btnConfirm: false
	};

	constructor(private macroKeyService: MacrokeyService) { }

	ngOnInit() { }

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

	/**
	 * @param macroKey macrokey
	 * @description Take an  macrokey and delete the records of macrokey;
	 * @returns void
	 */
	public clearMacroRecords(macroKey: any) {
		console.log(macroKey, 'Macro key12 ------------------');
		if (macroKey) {
			this.macroKeyService.clearMacroKey(macroKey).then(res => {
				console.log('response came from delete Macro', res);
				if (res && res === true) {
					// TODO have to call the gamingMacroKeyRecordedChangeEvent()
				}
			});
		}
	}
	/**
	 * @param record record
	 * @description Take an  record and delete the record;
	 * @returns void
	 */
	public deleteRecord(record: any) {
		if (record) {
			console.log('Currently deleting following record:---->', record);
		}
	}
}
