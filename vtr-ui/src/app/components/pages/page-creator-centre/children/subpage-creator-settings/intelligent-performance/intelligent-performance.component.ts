import { Component, OnDestroy, OnInit } from '@angular/core';
import { UiCircleRadioWithCheckBoxListModel } from 'src/app/components/ui/ui-circle-radio-with-checkbox-list/ui-circle-radio-with-checkbox-list.model';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';
import { PowerService } from 'src/app/services/power/power.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { IntelligentPerformanceModes } from './intelligent-performance.enum';
import { IntelligentPerformanceSettings } from './intelligent-performance.enum';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';


@Component({
	selector: 'vtr-intelligent-performance',
	templateUrl: './intelligent-performance.component.html',
	styleUrls: ['./intelligent-performance.component.scss']
})
export class IntelligentPerformanceComponent implements OnInit, OnDestroy {
	public readonly metricsParent = CommonMetricsModel.ParentDeviceSettings;
	public intelligentCoolingUIModel: Array<UiCircleRadioWithCheckBoxListModel> = [];
	private readonly batterySavingModeId = 'quiteBatterySaving';
	private readonly performanceModeId = 'radioICPerformance';
	private readonly quiteCoolModeId = 'radioICQuiteCool';
	radioPerformance = false;
	radioQuietCool = true;
	radioBatterySaving = false;
	selectModeTextFlag = '';
	isIntelligentPerformanceVisible = false;
	cache: IntelligentPerformanceSettings;

	@Output() intelligentPerformanceCapability = new EventEmitter<boolean>();

	constructor(
		public powerService: PowerService,
		public localCacheService: LocalCacheService,
		public commonService: CommonService,
		public loggerService: LoggerService
	) {}

	ngOnInit(): void {
		const machineType = this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineType);
		if(machineType !== 0) {
			this.updateIntelligentPerformanceCapability(false);
			return;
		}

		this.initDataFromCache();
		this.initIntelligentPerformanceSettings();
	}

	ngOnDestroy(): void {
		this.stopMonitorForIntelligentPerformance();
	}
	initDataFromCache() {
		this.cache = this.localCacheService.getLocalCacheValue(LocalStorageKey.IntelligentPerformanceSettings, undefined);
		if(this.cache) {
			this.isIntelligentPerformanceVisible = this.cache.isIntelligentPerformanceVisible;
			this.selectModeTextFlag = this.cache.selectModeTextFlag;
		} else {
			this.cache = new IntelligentPerformanceSettings();
		}
	}
	
	initIntelligentPerformanceSettings() {
		this.powerService.getITSModeForICIdeapad().then((response) => {
			if(!response?.available || response?.itsVersion < 4) {
				this.updateIntelligentPerformanceCapability(false);
				return;
			}
			this.updateUIDisplayStatus(response, false);
			this.startMonitorForIntelligentPerformance();
		});
	}

	updateUIDisplayStatus(response, isCallback: boolean) {
		if(!response?.available || response?.itsVersion < 4) {
			this.updateIntelligentPerformanceCapability(false);
			return;
		}
		this.updateIntelligentPerformanceCapability(true);
		if(response.currentMode) {
			switch (response.currentMode) {
				case IntelligentPerformanceModes.PERFORMANCE:
					this.radioPerformance = true;
					this.radioQuietCool = false;
					this.radioBatterySaving = false;
					this.selectModeTextFlag = 'performance'
					break;
				case IntelligentPerformanceModes.COOL:
					this.radioPerformance = false;
					this.radioQuietCool = true;
					this.radioBatterySaving = false;
					this.selectModeTextFlag = 'quiteCool';
					break;
				case IntelligentPerformanceModes.BATTERYSAVING:
					this.radioPerformance = false;
					this.radioQuietCool = false;
					this.radioBatterySaving = true;
					this.selectModeTextFlag = 'batterySaving14';
					break;
				default:
					break;
			}
		}
		if(isCallback) {
			this.updateIntelligentCoolingSelection();
		} else {
			this.updateRadioCheckBoxListModel();
		}
		this.cache.isIntelligentPerformanceVisible = this.isIntelligentPerformanceVisible;
		this.cache.selectModeTextFlag = this.selectModeTextFlag;
		this.localCacheService.setLocalCacheValue(LocalStorageKey.IntelligentPerformanceSettings, this.cache);
	}

	startMonitorForIntelligentPerformance() {
		if (this.powerService.isShellAvailable) {
			this.powerService
				.startMonitorForICIdeapad(this.callbackForStartMonitor.bind(this))
				.then((value: boolean) => { })
		}
	}
	
	stopMonitorForIntelligentPerformance() {
		if (this.powerService.isShellAvailable) {
			this.powerService
				.stopMonitorForICIdeapad()
				.then((value: boolean) => { })
		}
	}
	callbackForStartMonitor(response: any) {
		this.updateUIDisplayStatus(response, true);
	}
	updateIntelligentCoolingSelection() {
		if (this.intelligentCoolingUIModel && this.intelligentCoolingUIModel.length > 0) {
			this.intelligentCoolingUIModel.forEach((element) => {
				if (element.componentId === this.batterySavingModeId) {
					element.isChecked = this.radioBatterySaving;
				}
				if (element.componentId === this.performanceModeId) {
					element.isChecked = this.radioPerformance;
				}
				if (element.componentId === this.quiteCoolModeId) {
					element.isChecked = this.radioQuietCool;
				}
			});
		}
	}
	updateIntelligentPerformanceCapability(visible: boolean) {
		this.isIntelligentPerformanceVisible = visible;
		if(visible) {
			this.intelligentPerformanceCapability.emit(true);
		} else {
			this.intelligentPerformanceCapability.emit(false);
		}
		this.cache.isIntelligentPerformanceVisible = this.isIntelligentPerformanceVisible;
		this.localCacheService.setLocalCacheValue(LocalStorageKey.IntelligentPerformanceSettings, this.cache);
	}

	updateRadioCheckBoxListModel() {
		this.intelligentCoolingUIModel.push({
			componentId: this.performanceModeId,
			label: `device.deviceSettings.power.powerSmartSettings.intelligentCooling.options.performance14`,
			value: 'performance',
			isChecked: this.radioPerformance,
			isDisabled: false,
			processIcon: true,
			customIcon: '',
			hideIcon: false,
			processLabel: true,
			metricsItem: 'radio.power-smart-settings.performance'
		});

		this.intelligentCoolingUIModel.push({
			componentId: this.quiteCoolModeId,
			label: `device.deviceSettings.power.powerSmartSettings.intelligentCooling.options.quiteCool14`,
			value: 'intelligentCooling',
			isChecked: this.radioQuietCool,
			isDisabled: false,
			processIcon: true,
			customIcon: 'LE-IntelligentCooling2x',
			hideIcon: true,
			processLabel: true,
			metricsItem: 'radio.power-smart-settings.intelligent-cooling'
		});

		this.intelligentCoolingUIModel.push({
			componentId: this.batterySavingModeId,
			label: `device.deviceSettings.power.powerSmartSettings.intelligentCooling.options.batterySaving`,
			value: 'batterySaving',
			isChecked: this.radioBatterySaving,
			isDisabled: false,
			processIcon: true,
			customIcon: 'LE-Battery-Life-mode2x',
			hideIcon: true,
			processLabel: true,
			metricsItem: 'radio.power-smart-settings.battery-saving'
		});
	}

	onIntelligentCoolingModeChange($event: UiCircleRadioWithCheckBoxListModel) {
		// this.updateIntelligentCoolingSelection();
		switch ($event.componentId.toLowerCase()) {
			case this.performanceModeId.toLowerCase():
				this.selectModeTextFlag = 'performance';
				this.powerService.setITSModeForICIdeapad(IntelligentPerformanceModes.PERFORMANCE);
				break;
			case this.quiteCoolModeId.toLowerCase():
				this.selectModeTextFlag = 'quiteCool';
				this.powerService.setITSModeForICIdeapad(IntelligentPerformanceModes.COOL);
				break;
			case this.batterySavingModeId.toLowerCase():
				this.selectModeTextFlag = 'batterySaving14';
				this.powerService.setITSModeForICIdeapad(IntelligentPerformanceModes.BATTERYSAVING);
				break;
			default:
				break;
		}
		this.cache.selectModeTextFlag = this.selectModeTextFlag;
		this.localCacheService.setLocalCacheValue(LocalStorageKey.IntelligentPerformanceSettings, this.cache);
	}

	// updateSelectedModeText(currentMode) {
	// 	switch (currentMode) {
	// 		case this.performanceModeId.toLowerCase():
	// 			this.selectModeTextFlag = 'performance';
	// 			break;
	// 		case this.quiteCoolModeId.toLowerCase():
	// 			this.selectModeTextFlag = 'quiteCool';
	// 			break;
	// 		case this.batterySavingModeId.toLowerCase():
	// 			this.selectModeTextFlag = 'batterySaving14';
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }
}
