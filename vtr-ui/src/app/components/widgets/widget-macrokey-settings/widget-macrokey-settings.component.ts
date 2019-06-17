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
import { MacroKeyRecordedChange } from 'src/app/data-models/gaming/macrokey/macrokey-recorded-change.model';
import { MacroKeyInputChange } from 'src/app/data-models/gaming/macrokey/macrokey-input-change.model';

@Component({
	selector: 'vtr-widget-macrokey-settings',
	templateUrl: './widget-macrokey-settings.component.html',
	styleUrls: [ './widget-macrokey-settings.component.scss' ]
})
export class WidgetMacrokeySettingsComponent implements OnInit, OnDestroy {
	macroKeyOptions: any = [
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

	numberSelected;
	isNumpad: Boolean = true;
	isRecording: Boolean = false;
	recordedKeyData: any;
	gamingProperties: GamingAllCapabilities = new GamingAllCapabilities();
	macroKeyTypeStatus: MacroKeyTypeStatus = new MacroKeyTypeStatus();
	macroKeyRecordedStatus: MacroKeyRecordedChange[];
	macroKeyInputData: MacroKeyInputChange = new MacroKeyInputChange();
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
		// Load all the cache status for Macrokey
		this.macroKeyTypeStatus = this.macroKeyService.getMacrokeyTypeStatusCache();
		this.macroKeyRecordedStatus = this.macroKeyService.getMacrokeyRecordedStatusCache();
		// this.macroKeyInputData = this.macroKeyService.getMacrokeyInputChangeCache();
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
		if (this.isRecording) {
			this.macroKeyService.setStopRecording(this.numberSelected.key, false, true);
			this.shellService.unRegisterEvent(
				EventTypes.gamingMacroKeyKeyChangeEvent,
				this.onGamingMacroKeyInputChangeEvent
			);
		}
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
		// TODO: Update cache for macrokey type
		this.macroKeyTypeStatus = macroKeyTypeEventStatus;
		this.macroKeyService.setMacrokeyTypeStatusCache(this.macroKeyTypeStatus);
		if (this.macroKeyTypeStatus.MacroKeyType === 1) {
			this.isNumpad = false;
		} else {
			this.isNumpad = true;
		}
	}

	onGamingMacroKeyRecordedChangeEvent(macroKeyRecordedChangeEventResponse: any) {
		if (macroKeyRecordedChangeEventResponse) {
			this.updateMacroKeyRecordedStatusDetails(macroKeyRecordedChangeEventResponse);
		}
	}

	updateMacroKeyRecordedStatusDetails(macroKeyRecordedChangeEventStatus) {
		this.macroKeyRecordedStatus = macroKeyRecordedChangeEventStatus;
		// TODO: Update cache for macrokey
		this.macroKeyService.setMacrokeyRecordedStatusCache(this.macroKeyRecordedStatus);
		if (!isUndefined(this.numberSelected)) {
			this.numberSelected = this.macroKeyRecordedStatus.filter(
				(number) => number.key === this.numberSelected.key
			)[0];
		}
	}

	onGamingMacroKeyKeyChangeEvent(macroKeyKeyChangeEventResponse: any) {
		if (macroKeyKeyChangeEventResponse) {
			this.updateMacroKeyKeyChangeDetails(macroKeyKeyChangeEventResponse);
		}
	}

	updateMacroKeyKeyChangeDetails(macroKeyKeyChangeEventData) {
		if (macroKeyKeyChangeEventData) {
			this.macroKeyInputData = macroKeyKeyChangeEventData;
			// Setting the value from cache
			// this.macroKeyService.setMacrokeyInputChangeCache(this.macroKeyInputData);
			this.numberSelected = this.macroKeyRecordedStatus.filter(
				(number) => number.key === macroKeyKeyChangeEventData.key
			)[0];
		}
	}

	optionChanged(option: any) {
		this.macroKeyService.setMacroKeyApplyStatus(option.value).then((responseStatus) => {
			if (responseStatus) {
				// // Setting the value of macrokey status dropdown
				this.macroKeyTypeStatus.MacroKeyStatus = option.value;
				this.macroKeyService.setMacrokeyChangeStatusCache(this.macroKeyTypeStatus);
			}
		});
	}

	onNumberSelected(number) {
		console.log('########################### key selected', number.key);
		this.macroKeyService.setKey(number.key);
		this.numberSelected = number;
	}

	onRecordingChanged(recordingChangeData) {
		this.isRecording = recordingChangeData.recordingStatus;
		if (this.isRecording) {
			this.macroKeyService.setStartRecording(this.numberSelected.key);
			this.shellService.registerEvent(
				EventTypes.gamingMacroKeyInputChageEvent,
				this.onGamingMacroKeyInputChangeEvent.bind(this)
			);
		} else {
			this.macroKeyService.setStopRecording(
				this.numberSelected.key,
				!recordingChangeData.stopType,
				recordingChangeData.stopType
			);
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
			console.log(macroKeyInputChangeData);
			// TODO: Update cache for macrokey type
			// this.macroKeyService.setMacrokeyInputChangeCache(this.macroKeyInputData);
			this.macroKeyInputData.macro.inputs = macroKeyInputChangeData;
		}
	}
}
