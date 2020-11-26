import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MacroKeyMessageData } from 'src/app/enums/macrokey-message-data.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';

@Component({
	selector: 'vtr-ui-macrokey-details',
	templateUrl: './ui-macrokey-details.component.html',
	styleUrls: ['./ui-macrokey-details.component.scss'],
	host: {
		'(document:visibilitychange)': 'toggleOnPageMinimized()',
	},
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

	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.timeoutRecording.title',
		bodyText: 'gaming.macroKey.popupContent.timeoutRecording.body',
		btnConfirm: false,
		metricsItemId: '',
		metricsItemClose: 'close dialog',
		metricsItemPopup: '',
		popupWindowTitle: '',
		automationId: 'macrokey_clear_records_dialog',
	};

	modalAutomationId: any = {
		section: '',
		headerText: '',
		description: '',
		closeButton: '',
		// cancelButton: '',
		okButton: '',
	};

	constructor(private modalService: NgbModal) {}

	ngOnInit() {}

	toggleOnPageMinimized() {
		if (document.hidden) {
			if (this.recording) {
				this.toggleRecording(true);
			}
		}
	}

	onStartClicked(event) {
		if (event instanceof PointerEvent) {
			if (event.pointerId === 0) {
				return;
			}
		}
		this.toggleRecording();
	}

	onStopClicked(event) {
		this.toggleRecording();
		setTimeout(() => {
			const focusElement = document.getElementById(
				'gaming_macrokey_startrecording'
			) as HTMLElement;
			if (focusElement) {
				focusElement.focus();
			}
		}, 20);
	}

	toggleRecording(isAbnormalStop: boolean = false) {
		this.recording = !this.recording;
		const recordingChangeData = {
			recordingStatus: this.recording,
			stopType: isAbnormalStop,
		};
		this.isRecording.emit(recordingChangeData);
	}

	recordsDelete(records) {
		records = records || [];
		records.forEach((record: any, ri: number) => {});
	}

	ngOnChanges(changes) {
		if (!(changes.messageData === undefined)) {
			if (changes.messageData.currentValue === MacroKeyMessageData.timeout10) {
				let idPrefix = 'macrokey_10s_timeout_dialog';
				this.modalAutomationId = {
					section: idPrefix,
					headerText: idPrefix + '_header_text',
					description: idPrefix + '_description',
					closeButton: idPrefix + '_close_button',
					okButton: idPrefix + 'ob_btn',
				};
				let promptRef = this.modalService.open(ModalGamingPromptComponent, {
					backdrop: 'static',
					windowClass: 'modal-prompt',
				});
				promptRef.componentInstance.info = {
					title: 'gaming.macroKey.popupContent.timeoutRecording.title',
					description: 'gaming.macroKey.popupContent.inputStopped.body',
					comfirmButton: 'gaming.macroKey.popupContent.btnOk',
					comfirmButtonAriaLabel: 'gaming.macroKey.popupContent.btnOk',
					confirmMetricEnabled: true,
					confirmMetricsItemId: idPrefix + '_ok_button',
					cancelMetricEnabled: false,
					cancelMetricsItemId: '',
					id: this.modalAutomationId,
				};
				this.toggleRecording(true);
			}
			if (changes.messageData.currentValue === MacroKeyMessageData.timeout20) {
				let idPrefix = 'macrokey_20s_timeout_dialog';
				this.modalAutomationId = {
					section: idPrefix,
					headerText: idPrefix + '_header_text',
					description: idPrefix + '_description',
					closeButton: idPrefix + '_close_button',
					okButton: idPrefix + 'ob_btn',
				};
				let promptRef = this.modalService.open(ModalGamingPromptComponent, {
					backdrop: 'static',
					windowClass: 'modal-prompt',
				});
				promptRef.componentInstance.info = {
					title: 'gaming.macroKey.popupContent.timeoutRecording.title',
					description: 'gaming.macroKey.popupContent.timeoutRecording.body',
					comfirmButton: 'gaming.macroKey.popupContent.btnOk',
					comfirmButtonAriaLabel: 'gaming.macroKey.popupContent.btnOk',
					confirmMetricEnabled: true,
					confirmMetricsItemId: idPrefix + '_ok_button',
					cancelMetricEnabled: false,
					cancelMetricsItemId: '',
					id: this.modalAutomationId,
				};
				this.toggleRecording(true);
			}
			if (changes.messageData.currentValue === MacroKeyMessageData.maximumInput) {
				let idPrefix = 'macrokey_maximum_input_dialog';
				this.modalAutomationId = {
					section: idPrefix,
					headerText: idPrefix + '_header_text',
					description: idPrefix + '_description',
					closeButton: idPrefix + '_close_button',
					okButton: idPrefix + 'ob_btn',
				};
				let promptRef = this.modalService.open(ModalGamingPromptComponent, {
					backdrop: 'static',
					windowClass: 'modal-prompt',
				});
				promptRef.componentInstance.info = {
					title: 'gaming.macroKey.popupContent.maximumInput.title',
					description: 'gaming.macroKey.popupContent.maximumInput.body',
					comfirmButton: 'gaming.macroKey.popupContent.btnOk',
					comfirmButtonAriaLabel: 'gaming.macroKey.popupContent.btnOk',
					confirmMetricEnabled: true,
					confirmMetricsItemId: idPrefix + '_ok_button',
					cancelMetricEnabled: false,
					cancelMetricsItemId: '',
					id: this.modalAutomationId,
				};
				this.toggleRecording();
			}
		}
	}
}
