import { Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, DoCheck } from '@angular/core';
import { isUndefined } from 'util';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { MacrokeyService } from 'src/app/services/gaming/macrokey/macrokey.service';
import { MacroKeyRepeat } from 'src/app/enums/macrokey-repeat.enum';
import { MacroKeyInterval } from 'src/app/enums/macrokey-interval.enum.1';

@Component({
	selector: 'vtr-ui-macrokey-recorded-list',
	templateUrl: './ui-macrokey-recorded-list.component.html',
	styleUrls: ['./ui-macrokey-recorded-list.component.scss']
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
			value: MacroKeyRepeat.Repeat1
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.description',

			value: MacroKeyRepeat.Repeat2
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.description',

			value: MacroKeyRepeat.Repeat3
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.description',

			value: MacroKeyRepeat.Repeat4
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.description',

			value: MacroKeyRepeat.Repeat5
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.description',

			value: MacroKeyRepeat.Repeat6
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.description',

			value: MacroKeyRepeat.Repeat7
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.description',

			value: MacroKeyRepeat.Repeat8
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.description',

			value: MacroKeyRepeat.Repeat9
		},
		{
			title: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.title',
			name: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.title',
			description: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.description',
			value: MacroKeyRepeat.Repeat10
		}
	];

	intervalOptions = [
		{
			title: 'gaming.macroKey.details.recorded.intervalStatus.keep.title',
			name: 'gaming.macroKey.details.recorded.intervalStatus.keep.title',
			description: 'gaming.macroKey.details.recorded.intervalStatus.keep.description',
			value: MacroKeyInterval.KeepInterval
		},
		{
			title: 'gaming.macroKey.details.recorded.intervalStatus.ignore.title',
			name: 'gaming.macroKey.details.recorded.intervalStatus.ignore.title',
			description: 'gaming.macroKey.details.recorded.intervalStatus.ignore.description',
			value: MacroKeyInterval.IgnoreInterval
		}
	];

	repeatSelectedValue = 1;
	delaySelectedValue = 1;

	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.clearMacrokey.title',
		bodyText: '',
		btnConfirm: true
	};

	constructor(private macrokeyService: MacrokeyService) { }

	ngOnInit() { }

	recordDelete(record, i) {
		// console.log(this.recordsData.inputs);
		// const remainingInputs = this.recordsData.inputs.filter((records: any) => records.key !== record.key);
		this.recordsData.inputs.splice(i, 2);
		const remainingInputs = this.recordsData.inputs
		this.macrokeyService.setMacroKey(this.number.key, remainingInputs).then((responseStatus) => {
			if (responseStatus) {
				this.recordsData.inputs = remainingInputs;
			}
		});
	}

	clearRecords() {
		this.showModal = true;
		this.clearRecordPopup = !this.clearRecordPopup;
	}

	deleteAllMacros(canDelete) {
		if (canDelete) {
			this.macrokeyService.clearKey(this.number.key);
		}
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

	onRepeatChanged(repeatOption) {
		this.macrokeyService.setRepeat(this.number.key, repeatOption.value).then((responseStatus) => {
			console.log('########################## Set repeat status: ', responseStatus);
			console.log('########################## Set repeat option: ', repeatOption.value);
			if (responseStatus) {
				this.recordsData.repeat = repeatOption.value;
				this.macrokeyService.setOnRepeatStatusCache(repeatOption.value);
			}
		});
	}

	onIntervalChanged(intervalOption) {
		this.macrokeyService.setInterval(this.number.key, intervalOption.value).then((responseStatus) => {
			console.log('########################## Set interval status: ', responseStatus);
			console.log('########################## Set interval option: ', intervalOption.value);
			if (responseStatus) {
				this.recordsData.interval = intervalOption.value;
				this.macrokeyService.setOnIntervalStatusCache(intervalOption.value);
			}
		});

		if (intervalOption.value === 2) {
			this.ignoreInterval = true;
			return;
		}
		this.ignoreInterval = false;
	}
}
