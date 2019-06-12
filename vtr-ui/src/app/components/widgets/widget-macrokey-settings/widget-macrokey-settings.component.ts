import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GamingCollapsableContainerEvent } from 'src/app/data-models/gaming/gaming-collapsable-container-event';
import { MacrokeyService } from 'src/app/services/gaming/macrokey/macrokey.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { MacroKeyTypeStatus } from 'src/app/data-models/gaming/macrokey/macrokey-type-status.model';
import { Router } from '@angular/router';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Gaming } from 'src/app/enums/gaming.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { isUndefined } from 'util';

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

	macroKeyStatusSelectedValue = 1;

	numberPadbottons = [
		{
			key: '7',
			status: false
		},
		{
			key: '8',
			status: false
		},
		{
			key: '9',
			status: false
		},
		{
			key: '4',
			status: false
		},
		{
			key: '5',
			status: false
		},
		{
			key: '6',
			status: false
		},
		{
			key: '1',
			status: false
		},
		{
			key: '2',
			status: false
		},
		{
			key: '3',
			status: false
		},
		{
			key: '0',
			status: false
		}
	];
	numbers = this.numberPadbottons;
	numberSelected;

	macroKeyTypeStatus: any = new MacroKeyTypeStatus();
	isNumpad: Boolean = true;
	isRecording: Boolean = false;
	recordedKeyData: any;
	public gamingProperties: any = new GamingAllCapabilities();

	constructor(
		private macroKeyService: MacrokeyService,
		private shellService: VantageShellService,
		private router: Router,
		private commonService: CommonService,
		private gamingCapabilityService: GamingAllCapabilitiesService
	) {}

	ngOnInit() {
		this.gamingProperties.macroKeyFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.macroKeyFeature
		);

		this.initMacroKeySubpage();
		this.commonService.notification.subscribe((response) => {
			if (response.type === Gaming.GamingCapablities) {
				this.gamingProperties = response.payload;
				this.initMacroKeySubpage();
			}
		});
	}

	initMacroKeySubpage() {
		if (this.gamingProperties.macroKeyFeature) {
			this.initMacroKeyEvents();
		} else {
			this.redirectBack();
		}
	}

	ngOnDestroy() {
		this.shellService.unRegisterEvent(
			EventTypes.gamingMacroKeyInitializeEvent,
			this.onGamingMacroKeyInitializeEvent
		);
		this.shellService.unRegisterEvent(
			EventTypes.gamingMacroKeyRecordedChangeEvent,
			this.onGamingMacroKeyRecordedChangeEvent
		);
		this.shellService.unRegisterEvent(EventTypes.gamingMacroKeyKeyChangeEvent, this.onGamingMacroKeyKeyChangeEvent);
	}

	public initMacroKeyEvents() {
		if (this.macroKeyService.isMacroKeyAvailable) {
			this.macroKeyService.gamingMacroKeyInitializeEvent().then((macroKeyInitStatus) => {
				if (!macroKeyInitStatus) {
					this.redirectBack();
				}
			});
			this.shellService.registerEvent(
				EventTypes.gamingMacroKeyInitializeEvent,
				this.onGamingMacroKeyInitializeEvent.bind(this)
			);
			this.shellService.registerEvent(
				EventTypes.gamingMacroKeyRecordedChangeEvent,
				this.onGamingMacroKeyRecordedChangeEvent.bind(this)
			);
			this.shellService.registerEvent(
				EventTypes.gamingMacroKeyKeyChangeEvent,
				this.onGamingMacroKeyKeyChangeEvent.bind(this)
			);
		}
	}

	redirectBack() {
		this.router.navigate([ 'dashboard' ]);
	}

	onGamingMacroKeyInitializeEvent(macroKeyTypeEventResponse: any) {
		if (macroKeyTypeEventResponse) {
			this.updateMacroKeyTypeStatusDetails(macroKeyTypeEventResponse);
		}
	}

	updateMacroKeyTypeStatusDetails(macroKeyTypeEventStatus) {
		// TODO: Update cache for macrokeytypestatus
		this.macroKeyTypeStatus = macroKeyTypeEventStatus;
		if (this.macroKeyTypeStatus.MacroKeyType === 1) {
			this.isNumpad = false;
		} else {
			this.isNumpad = true;
		}
		this.macroKeyStatusSelectedValue = this.macroKeyTypeStatus.MacroKeyStatus;
	}

	onGamingMacroKeyRecordedChangeEvent(macroKeyRecordedChangeEventResponse: any) {
		if (macroKeyRecordedChangeEventResponse) {
			this.updateMacroKeyRecordedStatusDetails(macroKeyRecordedChangeEventResponse);
		}
	}

	updateMacroKeyRecordedStatusDetails(macroKeyRecordedChangeEventStatus) {
		this.numbers = macroKeyRecordedChangeEventStatus;
	}

	onGamingMacroKeyKeyChangeEvent(macroKeyKeyChangeEventResponse: any) {
		if (macroKeyKeyChangeEventResponse) {
			this.updateMacroKeyKeyChangeDetails(macroKeyKeyChangeEventResponse);
		}
	}

	updateMacroKeyKeyChangeDetails(macroKeyKeyChangeEventData) {
		if (macroKeyKeyChangeEventData) {
			this.numberSelected = this.numbers.filter((number) => number.key === macroKeyKeyChangeEventData.key)[0];
			this.recordedKeyData = macroKeyKeyChangeEventData.macro;
		}
	}

	optionChanged(option: any) {}

	onNumberSelected(number) {
		this.macroKeyService.setKey(number.key);
		this.numberSelected = number;
	}

	onRecordingChanged(isRecording) {
		this.isRecording = isRecording;
		if (this.isRecording) {
			this.macroKeyService.setStartRecording(this.numberSelected.key);
			this.shellService.registerEvent(
				EventTypes.gamingMacroKeyInputChageEvent,
				this.onGamingMacroKeyInputChangeEvent.bind(this)
			);
		} else {
			this.macroKeyService.setStopRecording(this.numberSelected.key, true, 'normal');
			this.shellService.unRegisterEvent(
				EventTypes.gamingMacroKeyKeyChangeEvent,
				this.onGamingMacroKeyInputChangeEvent
			);
		}
	}

	onGamingMacroKeyInputChangeEvent(macroKeyInputChangeEventResponse: any) {
		if (macroKeyInputChangeEventResponse) {
			this.updateMacroKeyInputDetails(macroKeyInputChangeEventResponse);
		}
	}

	updateMacroKeyInputDetails(macroKeyInputChangeData) {
		if (macroKeyInputChangeData) {
			this.recordedKeyData = macroKeyInputChangeData;
		}
	}
}
