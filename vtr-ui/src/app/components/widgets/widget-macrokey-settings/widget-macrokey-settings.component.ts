import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GamingCollapsableContainerEvent } from 'src/app/data-models/gaming/gaming-collapsable-container-event';
import { MacrokeyService } from 'src/app/services/gaming/macrokey/macrokey.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { MacroKeyTypeStatus } from 'src/app/data-models/gaming/macrokey/macrokey-type-status.model';

@Component({
	selector: 'vtr-widget-macrokey-settings',
	templateUrl: './widget-macrokey-settings.component.html',
	styleUrls: [ './widget-macrokey-settings.component.scss' ]
})
export class WidgetMacrokeySettingsComponent implements OnInit, OnDestroy {
	private macroKeyOptions: any = [
		{
			title: 'gaming.macroKey.status.on.title',
			name: 'gaming.macroKey.status.on.title',
			description: 'gaming.macroKey.status.on.description',
			value: 1
		},
		{
			title: 'gaming.macroKey.status.whileGaming.title',
			name: 'gaming.macroKey.status.whileGaming.title',
			description: 'gaming.macroKey.status.whileGaming.description',
			value: 2
		},
		{
			title: 'gaming.macroKey.status.off.title',
			name: 'gaming.macroKey.status.off.title',
			description: 'gaming.macroKey.status.off.description',
			value: 3
		}
	];

	macroKeyStatusSelectedOption = this.macroKeyOptions[0];

	numbers: any = [];

	numberPadbottons = [
		{
			title: 'gaming.macroKey.numberpad.number.one',
			value: '1',
			isMacrokeyExists: false,
			isSelected: false
		},
		{
			title: 'gaming.macroKey.numberpad.number.two',
			value: '2',
			isMacrokeyExists: false,
			isSelected: false
		},
		{
			title: 'gaming.macroKey.numberpad.number.three',
			value: '3',
			isMacrokeyExists: false,
			isSelected: false
		},
		{
			title: 'gaming.macroKey.numberpad.number.four',
			value: '4',
			isMacrokeyExists: false,
			isSelected: false
		},
		{
			title: 'gaming.macroKey.numberpad.number.five',
			value: '5',
			isMacrokeyExists: false,
			isSelected: false
		},
		{
			title: 'gaming.macroKey.numberpad.number.six',
			value: '6',
			isMacrokeyExists: false,
			isSelected: false
		},
		{
			title: 'gaming.macroKey.numberpad.number.seven',
			value: '7',
			isMacrokeyExists: false,
			isSelected: false
		},
		{
			title: 'gaming.macroKey.numberpad.number.eight',
			value: '8',
			isMacrokeyExists: false,
			isSelected: false
		},
		{
			title: 'gaming.macroKey.numberpad.number.nine',
			value: '9',
			isMacrokeyExists: false,
			isSelected: false
		},
		{
			title: 'gaming.macroKey.numberpad.number.zero',
			value: '0',
			isMacrokeyExists: true,
			isSelected: true
		}
	];

	macroButtons = [
		{
			title: 'gaming.macroKey.numberpad.macro.m1',
			value: 'M1',
			isMacrokeyExists: false,
			isSelected: true
		},
		{
			title: 'gaming.macroKey.numberpad.macro.m2',
			value: 'M2',
			isMacrokeyExists: true,
			isSelected: false
		}
	];

	numberSelected = this.numberPadbottons[0];

	@Output() optionSelected = new EventEmitter<any>();
	selectedNumber: any;
	macroKeyTypeStatus: any = new MacroKeyTypeStatus();
	isNumpad: Boolean = true;
	isRecording = false;
	recorderKeyData: any = [];

	constructor(private macroKeyService: MacrokeyService, private shellService: VantageShellService) {}

	ngOnInit() {
		this.recorderKeyData = [
			{ status: 1, key: '1', interval: 0 },
			{ status: 0, key: '1', interval: 100 },
			{ status: 0, key: '3', interval: 100 }
		];

		// TODO: Check if macrokey feature is enabled
		this.initMacroKeyEvents();
	}

	ngOnDestroy() {
		this.shellService.unRegisterEvent(
			EventTypes.gamingMacroKeyInitializeEvent,
			this.onGamingMacroKeyInitializeEvent
		);
	}

	public initMacroKeyEvents() {
		if (this.macroKeyService.isMacroKeyAvailable) {
			this.macroKeyService.gamingMacroKeyInitializeEvent();
			this.shellService.registerEvent(
				EventTypes.gamingMacroKeyInitializeEvent,
				this.onGamingMacroKeyInitializeEvent.bind(this)
			);
		}
	}

	onGamingMacroKeyInitializeEvent(status: any) {
		if (status) {
			this.onMacroKeyTypeStausChanged(status);
		}
	}

	onMacroKeyTypeStausChanged(macroKeyTypeStatus) {
		this.macroKeyTypeStatus = status;
		if (this.macroKeyTypeStatus.MacroKeyType === 1) {
			this.numbers = this.macroButtons;
			this.numberSelected = this.macroButtons[0];
			this.isNumpad = false;
		} else {
			this.numbers = this.numberPadbottons;
			this.numberSelected = this.numberPadbottons[9];
			this.isNumpad = true;
		}
	}

	optionChanged(option: any) {
		this.optionSelected.emit(option);
	}

	onNumberSelected(number) {
		this.selectedNumber = number;
	}

	onRecordingChanged(isRecording) {
		this.isRecording = isRecording;
	}
}
