import { Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, DoCheck } from '@angular/core';
import { isUndefined } from 'util';
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
	public deleteCalled: Boolean = false;
	public showModal: Boolean = false;
	public ignoreInterval: Boolean = false;
	public recordsList: any = [];
	public pairCounter = {};
	public hoveredPair = '';

	repeatOptions: any = [
		{
			dropOptions: [
				{
					title: 'gaming.macroKey.details.recorded.repeatStatus.repeat1.title',
					name: 'gaming.macroKey.details.recorded.repeatStatus.repeat1.title',
					description: 'gaming.macroKey.details.recorded.repeatStatus.repeat1.description',
					id: 'macro_key_settings_repeat1',
					label: 'gaming.macroKey.details.recorded.repeatStatus.repeat1.title',
					metricitem: 'macrokey_no_repeat',
					value: MacroKeyRepeat.Repeat1
				},
				{
					title: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.title',
					name: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.title',
					description: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.description',
					id: 'macro_key_settings_repeat2',
					label: 'gaming.macroKey.details.recorded.repeatStatus.repeat2.title',
					metricitem: 'macrokey_no_repeat_2times',
					value: MacroKeyRepeat.Repeat2
				},
				{
					title: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.title',
					name: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.title',
					description: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.description',
					id: 'macro_key_settings_repeat3',
					label: 'gaming.macroKey.details.recorded.repeatStatus.repeat3.title',
					metricitem: 'macrokey_no_repeat_3times',
					value: MacroKeyRepeat.Repeat3
				},
				{
					title: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.title',
					name: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.title',
					description: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.description',
					id: 'macro_key_settings_repeat4',
					label: 'gaming.macroKey.details.recorded.repeatStatus.repeat4.title',
					metricitem: 'macrokey_no_repeat_4times',
					value: MacroKeyRepeat.Repeat4
				},
				{
					title: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.title',
					name: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.title',
					description: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.description',
					id: 'macro_key_settings_repeat5',
					label: 'gaming.macroKey.details.recorded.repeatStatus.repeat5.title',
					metricitem: 'macrokey_no_repeat_5times',
					value: MacroKeyRepeat.Repeat5
				},
				{
					title: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.title',
					name: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.title',
					description: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.description',
					id: 'macro_key_settings_repeat6',
					label: 'gaming.macroKey.details.recorded.repeatStatus.repeat6.title',
					metricitem: 'macrokey_no_repeat_6times',
					value: MacroKeyRepeat.Repeat6
				},
				{
					title: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.title',
					name: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.title',
					description: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.description',
					id: 'macro_key_settings_repeat7',
					label: 'gaming.macroKey.details.recorded.repeatStatus.repeat7.title',
					metricitem: 'macrokey_no_repeat_7times',
					value: MacroKeyRepeat.Repeat7
				},
				{
					title: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.title',
					name: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.title',
					description: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.description',
					id: 'macro_key_settings_repeat8',
					label: 'gaming.macroKey.details.recorded.repeatStatus.repeat8.title',
					metricitem: 'macrokey_no_repeat_8times',
					value: MacroKeyRepeat.Repeat8
				},
				{
					title: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.title',
					name: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.title',
					description: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.description',
					id: 'macro_key_settings_repeat9',
					label: 'gaming.macroKey.details.recorded.repeatStatus.repeat9.title',
					metricitem: 'macrokey_no_repeat_9times',
					value: MacroKeyRepeat.Repeat9
				},
				{
					title: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.title',
					name: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.title',
					description: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.description',
					id: 'macro_key_settings_repeat10',
					label: 'gaming.macroKey.details.recorded.repeatStatus.repeat10.title',
					metricitem: 'macrokey_no_repeat_10times',
					value: MacroKeyRepeat.Repeat10
				}
			]
		}
	];

	intervalOptions: any = [
		{
			dropOptions: [
				{
					title: 'gaming.macroKey.details.recorded.intervalStatus.keep.title',
					name: 'gaming.macroKey.details.recorded.intervalStatus.keep.title',
					description: 'gaming.macroKey.details.recorded.intervalStatus.keep.description',
					id: 'macro_key_settings_keepdelay',
					label: 'gaming.macroKey.details.recorded.intervalStatus.keep.title',
					metricitem: 'macrokey_keep_delay',
					value: MacroKeyInterval.KeepInterval
				},
				{
					title: 'gaming.macroKey.details.recorded.intervalStatus.ignore.title',
					name: 'gaming.macroKey.details.recorded.intervalStatus.ignore.title',
					description: 'gaming.macroKey.details.recorded.intervalStatus.ignore.description',
					id: 'macro_key_settings_ignoredelay',
					label: 'gaming.macroKey.details.recorded.intervalStatus.ignore.title',
					metricitem: 'macrokey_ignore_delay',
					value: MacroKeyInterval.IgnoreInterval
				}
			]
		}
	];

	repeatSelectedValue = 1;
	delaySelectedValue = 1;

	modalContent = {
		headerTitle: 'gaming.macroKey.popupContent.clearMacrokey.title',
		bodyText: '',
		metricsItemClose: 'close dialog',
		btnConfirm: true,
		popupWindowTitle: 'gaming.macroKey.popupContent.clearMacrokey.modalTitle'
	};

	constructor(private macrokeyService: MacrokeyService) { }

	ngOnInit() { }

	async recordDelete(record, i) {
		try {
			if (!this.deleteCalled) {
				this.deleteCalled = true;
				const remainingInputs = this.recordsData.inputs.filter(
					(recordItem: any) => recordItem.pairName !== record.pairName
				);
				await this.macrokeyService.setMacroKey(this.number.key, remainingInputs).then((responseStatus) => {
					this.deleteCalled = false;
					if (responseStatus) {
						this.recordsData.inputs = remainingInputs;
						if (this.number.key === '0' || this.number.key === 'M1') {
							this.macrokeyService.updateMacrokeyInitialKeyDataCache(this.recordsData.inputs);
						}
					}
				});
			}
		} catch (err) { }
	}

	clearRecords() {
		this.showModal = true;
		this.clearRecordPopup = !this.clearRecordPopup;
	}

	deleteAllMacros(canDelete) {
		if (canDelete) {
			this.macrokeyService.clearKey(this.number.key);
			if (this.number.key === '0' || this.number.key === 'M1') {
				this.macrokeyService.updateMacrokeyInitialKeyDataCache([]);
				this.recordsData.repeat = MacroKeyRepeat.Repeat1;
				this.recordsData.interval = MacroKeyInterval.KeepInterval;
				this.ignoreInterval = false;
				this.repeatSelectedValue = this.recordsData.repeat;
				this.delaySelectedValue = this.recordsData.interval;
				this.macrokeyService.updateMacrokeyInitialKeyIntervalDataCache(MacroKeyInterval.KeepInterval);
				this.macrokeyService.updateMacrokeyInitialKeyRepeatDataCache(MacroKeyRepeat.Repeat1);
			}
		}
	}

	ngOnChanges(changes) {
		if (!isUndefined(changes)) {
			if (!isUndefined(changes.recordsData)) {
				const recordsData = changes.recordsData.currentValue;
				this.recordsList = this.pairRecordingData(recordsData.inputs);
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
		if (!isUndefined(this.recordsData)) {
			if (this.recordsList !== this.recordsData.inputs) {
				this.recordsList = this.pairRecordingData(this.recordsData.inputs);
			}
			if (this.repeatSelectedValue !== this.recordsData.repeat) {
				this.repeatSelectedValue = this.recordsData.repeat;
			}
			if (this.delaySelectedValue !== this.recordsData.interval) {
				this.delaySelectedValue = this.recordsData.interval;
			}
		}
	}

	onRepeatChanged(repeatOption) {
		this.macrokeyService.setRepeat(this.number.key, repeatOption.value).then((responseStatus) => {
			if (responseStatus) {
				this.recordsData.repeat = repeatOption.value;
				this.macrokeyService.setOnRepeatStatusCache(repeatOption.value, this.number.key);
			}
		});
	}

	onIntervalChanged(intervalOption) {
		this.macrokeyService.setInterval(this.number.key, intervalOption.value).then((responseStatus) => {
			if (responseStatus) {
				this.recordsData.interval = intervalOption.value;
				this.macrokeyService.setOnIntervalStatusCache(intervalOption.value, this.number.key);
			}
		});

		if (intervalOption.value === 2) {
			this.ignoreInterval = true;
			return;
		}
		this.ignoreInterval = false;
	}

	pairRecordingData(recordingData: any = []) {
		recordingData.forEach((record) => {
			record.pairName = this.getPairName(record.key, record.status);
		});
		return recordingData;
	}

	getPairName(key, status) {
		if (key in this.pairCounter) {
			if (status === 1) {
				this.pairCounter[key] += 1;
			}
		} else {
			this.pairCounter[key] = 0;
		}
		return 'pair-' + key + '-' + this.pairCounter[key];
	}
}
