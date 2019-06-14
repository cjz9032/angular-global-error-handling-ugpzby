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
	public recording: Boolean = false;
	public recordsList: any = [];
	timeout: any;
	showModal: Boolean = false;
	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.timeoutRecording.title',
		bodyText: 'gaming.macroKey.popupContent.timeoutRecording.body',
		btnConfirm: false
	};

	constructor(private macroKeyService: MacrokeyService) {}

	ngOnInit() {}

	onStartClicked(event) {
		this.timeout = setTimeout(() => {
			const myChanges: SimpleChanges = {
				recordingData: new SimpleChange(this.recordingData, this.recordingData, true)
			};
			this.ngOnChanges(myChanges);
		}, 20 * 1000);
		this.toggleRecording();
	}

	onStopClicked(event) {
		if (this.keyData.inputs.length > 0) {
			this.number.status = true;
		}
		this.toggleRecording();
		clearTimeout(this.timeout);
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
		if (!isUndefined(changes.recordingData)) {
			if (this.recording) {
				if (changes.recordingData.currentValue.length === 0) {
					if (changes.recordingData.previousValue.length > 0) {
						this.modalContent.bodyText = 'gaming.macroKey.popupContent.inputStopped.body';
						this.showModal = !this.showModal;
					} else {
						this.modalContent.bodyText = 'gaming.macroKey.popupContent.timeoutRecording.body';
						this.showModal = !this.showModal;
					}
					this.toggleRecording(true);
				} else if (changes.recordingData.currentValue.length === 40) {
					this.modalContent.headerTitle = 'gaming.macroKey.popupContent.maximumInput.title';
					this.modalContent.bodyText = 'gaming.macroKey.popupContent.maximumInput.body';
					this.showModal = !this.showModal;
					this.toggleRecording(true);
				}
			}
		}
	}
}
