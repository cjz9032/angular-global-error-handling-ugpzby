import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	DoCheck,
	OnChanges,
	SimpleChange,
	SimpleChanges
} from '@angular/core';
import { MacrokeyService } from './../../../services/gaming/macrokey/macrokey.service';
import { isUndefined } from 'util';
import { MacroKeyMessageData } from 'src/app/enums/macrokey-message-data.enum';

@Component({
	selector: 'vtr-ui-macrokey-details',
	templateUrl: './ui-macrokey-details.component.html',
	styleUrls: [ './ui-macrokey-details.component.scss' ]
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
		btnConfirm: false
	};

	constructor(private macroKeyService: MacrokeyService) {}

	ngOnInit() {
		const that = this;
		window.addEventListener(
			'blur',
			function() {
				that.recording = false;
				const recordingChangeData = {
					recordingStatus: that.recording,
					stopType: false
				};
				that.isRecording.emit(recordingChangeData);
			},
			false
		);
	}

	onStartClicked(event) {
		this.toggleRecording();
	}

	onStopClicked(event) {
		this.toggleRecording();
	}

	toggleRecording(isAbnormalStop: Boolean = false) {
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
			console.log(record);
			console.log(ri, 'Index');
		});
	}

	ngOnChanges(changes) {
		if (!isUndefined(changes.messageData)) {
			if (changes.messageData.currentValue === MacroKeyMessageData.timeout10) {
				this.modalContent.bodyText = 'gaming.macroKey.popupContent.inputStopped.body';
				this.showModal = !this.showModal;
				this.toggleRecording(true);
			}
			if (changes.messageData.currentValue === MacroKeyMessageData.timeout20) {
				this.modalContent.bodyText = 'gaming.macroKey.popupContent.timeoutRecording.body';
				this.showModal = !this.showModal;
				this.toggleRecording(true);
			}
			if (changes.messageData.currentValue === MacroKeyMessageData.maximumInput) {
				this.modalContent.headerTitle = 'gaming.macroKey.popupContent.maximumInput.title';
				this.modalContent.bodyText = 'gaming.macroKey.popupContent.maximumInput.body';
				this.showModal = !this.showModal;
				this.toggleRecording();
			}
		}
	}
}
