import { Status } from './../../../data-models/widgets/status.model';
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
import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'vtr-widget-macrokey-settings',
	templateUrl: './widget-macrokey-settings.component.html',
	styleUrls: ['./widget-macrokey-settings.component.scss']
})
export class WidgetMacrokeySettingsComponent implements OnInit, OnDestroy {
	macroKeyOptions: any = [
		{
			dropOptions: [
				{
					title: 'gaming.macroKey.status.on.title',
					name: 'gaming.macroKey.status.on.title',
					description: 'gaming.macroKey.status.on.description',
					id: 'macro key settings on',
					label: 'gaming.macroKey.narrator.macrokeySettings1.option1',
					metricitem: 'macrokey_settings_on',
					show_tool_tip: false,
					value: 1
				},
				{
					title: 'gaming.macroKey.status.whileGaming.title',
					name: 'gaming.macroKey.status.whileGaming.title',
					description: 'gaming.macroKey.status.whileGaming.description',
					id: 'macro key settings enabled when gaming',
					label: 'gaming.macroKey.narrator.macrokeySettings1.option2',
					metricitem: 'macrokey_settings_enabled_when_gaming',
					show_tool_tip: true,
					value: 2
				},
				{
					title: 'gaming.macroKey.status.off.title',
					name: 'gaming.macroKey.status.off.title',
					description: 'gaming.macroKey.status.off.description',
					id: 'macro key settings off',
					label: 'gaming.macroKey.narrator.macrokeySettings1.option3',
					metricitem: 'macrokey_settings_off',
					show_tool_tip: false,
					value: 3
				}
			]
		}
	];
	tooltips_value: any = '';
	numberSelected;
	isNumpad: boolean = true;
	isRecording: boolean = false;
	recordedKeyData: any;
	gamingProperties: GamingAllCapabilities = new GamingAllCapabilities();
	macroKeyTypeStatus: MacroKeyTypeStatus = new MacroKeyTypeStatus();
	macroKeyRecordedStatus: MacroKeyRecordedChange[];
	macroKeyInputData: MacroKeyInputChange = new MacroKeyInputChange();
	macroKeyMessageData: any;
	constructor(
		private macroKeyService: MacrokeyService,
		private shellService: VantageShellService,
		private router: Router,
		private commonService: CommonService,
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private translate: TranslateService
	) { }

	ngOnInit() {
		this.gamingProperties.macroKeyFeature = this.gamingCapabilityService.getCapabilityFromCache(
			LocalStorageKey.macroKeyFeature
		);
		this.initMacroKeySubpage();
		this.commonService.notification.subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				this.gamingProperties = response.payload;
				this.initMacroKeySubpage();
			}
		});
		// Load all the cache status for Macrokey
		this.macroKeyTypeStatus = this.macroKeyService.getMacrokeyTypeStatusCache();
		this.macroKeyRecordedStatus = this.macroKeyService.getMacrokeyRecordedStatusCache();
		this.macroKeyInputData = this.macroKeyService.getMacrokeyInputChangeCache();
		if (this.macroKeyTypeStatus.MacroKeyType !== undefined) {
			if (this.macroKeyTypeStatus.MacroKeyType === 1) {
				this.isNumpad = false;
			} else {
				this.isNumpad = true;
			}
		}
		this.macroKeyInputData = this.macroKeyService.getMacrokeyInitialKeyDataCache();
		this.numberSelected = this.macroKeyRecordedStatus.filter(
			(number) => number.key === this.macroKeyInputData.key
		)[0];


		// let tipid = 2;
		// if (this.macroKeyTypeStatus.MacroKeyStatus == tipid) {
		// 	this.macroKeyOptions.dropOptions.forEach((option) => {
		// 		if (option.value == tipid) {
		// 			this.tooltips_value = this.translate.instant(option.name);
		// 		}
		// 	});
		// }
		//this.ngbtconfig.triggers = 'hover';
		//this.ngbtconfig.placement = 'right';
		if (this.macroKeyTypeStatus.MacroKeyStatus === 2) {
			this.tooltips_value = this.translate.instant('gaming.macroKey.status.whileGaming.title');
		}

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
		this.router.navigate(['/device-gaming']);
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
			this.macroKeyService.setMacrokeyInputChangeCache(this.macroKeyInputData);
			this.numberSelected = this.macroKeyRecordedStatus.filter(
				(number) => number.key === macroKeyKeyChangeEventData.key
			)[0];

			if (macroKeyKeyChangeEventData.key === '0' || macroKeyKeyChangeEventData.key === 'M1') {
				this.macroKeyService.setMacrokeyInitialKeyDataCache(this.macroKeyInputData);
			}
		}
	}

	optionChanged(option: any) {

		if (option.value == 2) {
			this.tooltips_value = this.translate.instant(option.name);
		} else {
			this.tooltips_value = '';
		}

		this.macroKeyService.setMacroKeyApplyStatus(option.value).then((responseStatus) => {
			if (responseStatus) {
				// Setting the value of macrokey status dropdown
				this.macroKeyTypeStatus.MacroKeyStatus = option.value;
				this.macroKeyService.setMacrokeyChangeStatusCache(this.macroKeyTypeStatus);
			}
		});
	}

	onNumberSelected(number) {
		this.macroKeyService.setKey(number.key);
		this.numberSelected = number;
	}

	onRecordingChanged(recordingChangeData) {
		this.isRecording = recordingChangeData.recordingStatus;
		if (this.isRecording) {
			this.macroKeyInputData.macro.inputs = [];
			this.macroKeyMessageData = '';
			this.macroKeyService.setStartRecording(this.numberSelected.key);
			this.shellService.registerEvent(
				EventTypes.gamingMacroKeyInputChageEvent,
				this.onGamingMacroKeyInputChangeEvent.bind(this)
			);
			this.shellService.registerEvent(
				EventTypes.gamingMacroKeyInputMessageEvent,
				this.onGamingMacroKeyInputMessageEvent.bind(this)
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
			this.shellService.unRegisterEvent(
				EventTypes.gamingMacroKeyInputMessageEvent,
				this.onGamingMacroKeyInputMessageEvent
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
			this.macroKeyService.setMacrokeyInputChangeCache(this.macroKeyInputData);
			this.macroKeyInputData.macro.inputs = macroKeyInputChangeData;
		}
	}

	onGamingMacroKeyInputMessageEvent(macroKeyInputMessageEventResponse: any) {
		if (macroKeyInputMessageEventResponse) {
			this.updateMacroKeyInputMessageEvent(macroKeyInputMessageEventResponse);
		}
	}

	updateMacroKeyInputMessageEvent(macroKeyInputMessageData) {
		this.macroKeyMessageData = macroKeyInputMessageData;
	}
}
