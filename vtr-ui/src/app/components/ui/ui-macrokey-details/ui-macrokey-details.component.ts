import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { isUndefined } from 'util';
import { MacroKeyMessageData } from 'src/app/enums/macrokey-message-data.enum';

@Component({
	selector: 'vtr-ui-macrokey-details',
	templateUrl: './ui-macrokey-details.component.html',
	styleUrls: ['./ui-macrokey-details.component.scss'],
	host: {
		'(document:visibilitychange)': 'toggleOnPageMinimized()'
	}
})
export class UiMacrokeyDetailsComponent implements OnInit, OnChanges {
	@Input() number;
	@Input() isNumberpad = false;
	@Output() isRecording = new EventEmitter<any>();
	@Input() keyData: any;
	@Input() recordingData: any = 0;
	@Input() messageData: any;
	public recording: Boolean = false;
	public recordsList: any = [];
	showModal: Boolean = false;

	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.timeoutRecording.title',
		bodyText: 'gaming.macroKey.popupContent.timeoutRecording.body',
		btnConfirm: false,
		metricsItemId: '',
		metricsItemClose: 'close dialog',
		metricsItemPopup: '',
		popupWindowTitle: '',
		automationId:'macrokey_clear_records_dialog',
	};

	constructor() { }

	ngOnInit() {}
	
	toggleOnPageMinimized() {
		if (document.hidden) {
			if(this.recording) {
				this.toggleRecording(true);
			}
		}
	}

	onStartClicked(event) {
		this.toggleRecording();
	}

	onStopClicked(event) {
		this.toggleRecording();
	}

	toggleRecording(isAbnormalStop: boolean = false) {
		this.recording = !this.recording;
		const recordingChangeData = {
			recordingStatus: this.recording,
			stopType: isAbnormalStop
		};
		this.isRecording.emit(recordingChangeData);
	}

	recordsDelete(records) {
		records = records || [];
		records.forEach((record: any, ri: number) => {
		});
	}

	ngOnChanges(changes) {
		if (!isUndefined(changes.messageData)) {
			if (changes.messageData.currentValue === MacroKeyMessageData.timeout10) {
				this.modalContent.headerTitle = 'gaming.macroKey.popupContent.timeoutRecording.title';
				this.modalContent.bodyText = 'gaming.macroKey.popupContent.inputStopped.body';
				this.modalContent.metricsItemId = 'macrokey_10s_timeout_dialog_ok_button';
				this.modalContent.metricsItemClose = 'close dialog';
				this.modalContent.metricsItemPopup = 'macrokey_10s_timeout_popup';
				this.modalContent.popupWindowTitle = '10 second time out window';
				this.modalContent.automationId = 'macrokey_10s_timeout_dialog';

				this.showModal = !this.showModal;
				this.toggleRecording(true);
			}
			if (changes.messageData.currentValue === MacroKeyMessageData.timeout20) {
				this.modalContent.headerTitle = 'gaming.macroKey.popupContent.timeoutRecording.title';
				this.modalContent.bodyText = 'gaming.macroKey.popupContent.timeoutRecording.body';
				this.modalContent.metricsItemId = 'macrokey_20s_timeout_dialog_ok_button';
				this.modalContent.metricsItemClose = 'close dialog';
				this.modalContent.metricsItemPopup = 'macrokey_20s_timeout_popup';
				this.modalContent.popupWindowTitle = '20 second time out window';
				this.modalContent.automationId = 'macrokey_20s_timeout_dialog';
				this.showModal = !this.showModal;
				this.toggleRecording(true);
			}
			if (changes.messageData.currentValue === MacroKeyMessageData.maximumInput) {
				this.modalContent.headerTitle = 'gaming.macroKey.popupContent.maximumInput.title';
				this.modalContent.bodyText = 'gaming.macroKey.popupContent.maximumInput.body';
				this.modalContent.metricsItemId = 'macrokey_maximum_input_dialog_ok_button';
				this.modalContent.popupWindowTitle = 'Maximum Input Reached window';
				this.modalContent.metricsItemClose = 'close dialog';
				this.modalContent.automationId = 'macrokey_maximum_input_dialog';
				this.showModal = !this.showModal;
				this.toggleRecording();
			}
		}
	}
}
