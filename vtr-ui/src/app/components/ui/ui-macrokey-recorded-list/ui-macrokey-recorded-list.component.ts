import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-macrokey-recorded-list',
	templateUrl: './ui-macrokey-recorded-list.component.html',
	styleUrls: [ './ui-macrokey-recorded-list.component.scss' ]
})
export class UiMacrokeyRecordedListComponent implements OnInit {
	@Input() number: any;
	@Input() recordingStatus: any;
	@Input() recordsList: any;
	@Output() deleteRecords = new EventEmitter<any>();
	@Output() clearAll = new EventEmitter<any>();
	public clearRecordPopup: Boolean = false;
	public showModal: Boolean = false;
	public ignoreInterval: Boolean = false;

	repeatOptions = [
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat1.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat1.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat1.description',
			selectedOption: false,
			defaultOption: true,
			value: 1
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.description',
			selectedOption: false,
			defaultOption: false,
			value: 2
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.description',
			selectedOption: false,
			defaultOption: false,
			value: 3
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.description',
			selectedOption: false,
			defaultOption: false,
			value: 4
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.description',
			selectedOption: false,
			defaultOption: false,
			value: 5
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.description',
			selectedOption: false,
			defaultOption: false,
			value: 6
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.description',
			selectedOption: false,
			defaultOption: false,
			value: 7
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.description',
			selectedOption: false,
			defaultOption: false,
			value: 8
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.description',
			selectedOption: false,
			defaultOption: false,
			value: 9
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.description',
			selectedOption: false,
			defaultOption: false,
			value: 10
		}
	];

	intervalOptions = [
		{
			title: 'gaming.macroKey.details.recorded.intervalStatus.keep.title',
			name: 'gaming.macroKey.details.recorded.intervalStatus.keep.title',
			description: 'gaming.macroKey.details.recorded.intervalStatus.keep.description',
			selectedOption: false,
			defaultOption: true,
			value: 1
		},
		{
			title: 'gaming.macroKey.details.recorded.intervalStatus.ignore.title',
			name: 'gaming.macroKey.details.recorded.intervalStatus.ignore.title',
			description: 'gaming.macroKey.details.recorded.intervalStatus.ignore.description',
			selectedOption: false,
			defaultOption: false,
			value: 2
		}
	];

	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.clearMacrokey.title',
		bodyText: '',
		btnConfirm: true
	};

	constructor() {}

	ngOnInit() {}

	recordDelete(...record) {
		// console.log(record);
		this.deleteRecords.emit(record);
	}

	clearRecords() {
		this.showModal = true;
		this.clearRecordPopup = !this.clearRecordPopup;
	}

	deleteAllMacros(canDelete) {
		if (canDelete) {
		this.recordDelete(...this.recordsList);
		}
	}

	onIntervalChanged($event) {
		if ($event.value === 2) {
			this.ignoreInterval = true;
			return;
		}
		this.ignoreInterval = false;
	}

}
