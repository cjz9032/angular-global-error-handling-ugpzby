import { Component, OnInit, Input, Output, EventEmitter, OnChanges, DoCheck } from '@angular/core';
import { isUndefined } from 'util';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { MacrokeyService } from 'src/app/services/gaming/macrokey/macrokey.service';

@Component({
	selector: 'vtr-ui-macrokey-recorded-list',
	templateUrl: './ui-macrokey-recorded-list.component.html',
	styleUrls: [ './ui-macrokey-recorded-list.component.scss' ]
})
export class UiMacrokeyRecordedListComponent implements OnInit, OnChanges, DoCheck {
	@Input() number: any;
	@Input() recordingStatus: any;
	@Input() recordsData: any;
	@Input() isNumberpad = false;
	@Output() deleteRecords = new EventEmitter<any>();
	@Output() clearAll = new EventEmitter<any>();
	public clearRecordPopup: Boolean = false;
	public showModal: Boolean = false;
	public ignoreInterval: Boolean = false;
	public recordsList;

	repeatOptions = [
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat1.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat1.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat1.description',
			value: 1
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.description',

			value: 2
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.description',

			value: 3
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.description',

			value: 4
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.description',

			value: 5
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.description',

			value: 6
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.description',

			value: 7
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.description',

			value: 8
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.description',

			value: 9
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.description',
			value: 10
		}
	];

	intervalOptions = [
		{
			title: 'gaming.macroKey.details.recorded.intervalStatus.keep.title',
			name: 'gaming.macroKey.details.recorded.intervalStatus.keep.title',
			description: 'gaming.macroKey.details.recorded.intervalStatus.keep.description',
			value: 1
		},
		{
			title: 'gaming.macroKey.details.recorded.intervalStatus.ignore.title',
			name: 'gaming.macroKey.details.recorded.intervalStatus.ignore.title',
			description: 'gaming.macroKey.details.recorded.intervalStatus.ignore.description',
			value: 2
		}
	];

	repeatSelectedValue = 1;
	delaySelectedValue = 1;

	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.clearMacrokey.title',
		bodyText: '',
		btnConfirm: true
	};

	constructor(private macrokeyService: MacrokeyService) {}

	ngOnInit() {}

	recordDelete(...record) {
		// console.log(record);
		this.deleteRecords.emit(record);
	}

	clearRecords() {
		this.showModal = true;
		this.clearRecordPopup = !this.clearRecordPopup;
		this.macrokeyService.clearKey(this.number.key);
	}

	deleteAllMacros(canDelete) {
		if (canDelete) {
			this.recordDelete(...this.recordsData);
		}
	}

	onIntervalChanged($event) {
		if ($event.value === 2) {
			this.ignoreInterval = true;
			return;
		}
		this.ignoreInterval = false;
	}

	ngOnChanges(changes) {
		if (!isUndefined(changes)) {
			if (!isUndefined(changes.recordsData)) {
				const recordsData = changes.recordsData.currentValue;
				this.recordsList = recordsData.inputs;
				this.repeatSelectedValue = recordsData.repeat;
				this.delaySelectedValue = recordsData.interval;
				if (this.delaySelectedValue === 2) {
					this.ignoreInterval = true;
				} else {
					this.ignoreInterval = false;
				}
			}
		}
	}

	ngDoCheck() {
		if (this.recordsList !== this.recordsData.inputs) {
			this.recordsList = this.recordsData.inputs;
		}
	}
}
