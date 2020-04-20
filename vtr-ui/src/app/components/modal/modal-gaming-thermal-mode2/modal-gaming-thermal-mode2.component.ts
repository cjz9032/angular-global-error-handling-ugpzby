import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingThermal2 } from 'src/app/enums/gaming-thermal2.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { ModalGamingAdvancedOCComponent } from './../../modal/modal-gaming-advanced-oc/modal-gaming-advanced-oc.component';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';
import { GamingOCService } from 'src/app/services/gaming/gaming-OC/gaming-oc.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { MetricService } from 'src/app/services/metric/metric.service';

@Component({
  selector: 'vtr-modal-gaming-thermal-mode2',
  templateUrl: './modal-gaming-thermal-mode2.component.html',
  styleUrls: ['./modal-gaming-thermal-mode2.component.scss']
})
export class ModalGamingThermalMode2Component implements OnInit {

  public loading = false;
  public gamingCapabilities: GamingAllCapabilities = new GamingAllCapabilities();
  public thermalMode2Enum = GamingThermal2;
  public thermalModeSettingStatus = this.thermalMode2Enum.balance;
  public OCsupportted = this.thermalMode2Enum.none;
  public driverStatus = this.thermalMode2Enum.none;
  public OCSettings = false;
  public autoSwitchStatus = false;
  public isThermalModeSetted = false;
  public isPerformancOCSetted = false;
  // @Output() thermalModeMsg = new EventEmitter<number>();
  @Output() OCSettingsMsg = new EventEmitter<boolean>();

  constructor(
    private modalService: NgbModal,
    private activeModalService: NgbActiveModal,
    private shellServices: VantageShellService,
    private commonService: CommonService,
    private gamingCapabilityService: GamingAllCapabilitiesService,
    private thermalModeService: GamingThermalModeService,
    private gamingOCService: GamingOCService,
    private logger: LoggerService,
    private timer: TimerService,
    private metrics: MetricService
  ) {
    // get capabilities from cache
    this.gamingCapabilities.desktopType = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.desktopType);
    this.gamingCapabilities.smartFanFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.smartFanFeature);
    this.gamingCapabilities.supporttedThermalMode = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.supporttedThermalMode);
    this.gamingCapabilities.cpuOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.cpuOCFeature);
    this.gamingCapabilities.gpuOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.gpuOCFeature);
    this.gamingCapabilities.xtuService = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.xtuService);
    this.gamingCapabilities.nvDriver = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.nvDriver);
    this.gamingCapabilities.advanceCPUOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.advanceCPUOCFeature);
    this.gamingCapabilities.advanceGPUOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.advanceGPUOCFeature);
    // get settings from cache
    this.thermalModeSettingStatus = this.commonService.getLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus);
    this.autoSwitchStatus = this.commonService.getLocalStorageValue(LocalStorageKey.autoSwitchStatus);
  }

  ngOnInit() {
    this.renderOCSupported();
    if (this.OCsupportted === this.thermalMode2Enum.cpu_gpu) {
      this.OCSettings = this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus) === 1 && this.commonService.getLocalStorageValue(LocalStorageKey.GpuOCStatus) === 1;
    } else if (this.OCsupportted === this.thermalMode2Enum.cpu) {
      this.OCSettings = this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus) === 1;
    } else if (this.OCsupportted === this.thermalMode2Enum.gpu) {
      this.OCSettings = this.commonService.getLocalStorageValue(LocalStorageKey.GpuOCStatus) === 1;
    }
    this.getThermalModeSettingStatus();
    this.getPerformanceOCSetting();
    this.getAutoSwitchStatus();
    this.registerThermalModeChangeEvent();
    this.timer.start();
  }

  ngOnDestroy() {
    this.unRegisterThermalModeChangeEvent();
  }

  renderOCSupported() {
    // oc supported status
    if (this.gamingCapabilities.cpuOCFeature) {
      if (this.gamingCapabilities.gpuOCFeature) {
        this.OCsupportted = this.thermalMode2Enum.cpu_gpu;
      } else {
        this.OCsupportted = this.thermalMode2Enum.cpu;
      }
    } else {
      if (this.gamingCapabilities.gpuOCFeature) {
        this.OCsupportted = this.thermalMode2Enum.gpu;
      } else {
        this.OCsupportted = this.thermalMode2Enum.none;
      }
    }
    // driver status
    if (this.gamingCapabilities.xtuService) {
      if (this.gamingCapabilities.nvDriver) {
        this.driverStatus = this.thermalMode2Enum.cpu_gpu;
      } else {
        this.driverStatus = this.thermalMode2Enum.cpu;
      }
    } else {
      if (this.gamingCapabilities.nvDriver) {
        this.driverStatus = this.thermalMode2Enum.gpu;
      } else {
        this.driverStatus = this.thermalMode2Enum.none;
      }
    }
  }

  closeThermalMode2Modal() {
    this.activeModalService.close();

    const pageViewMetrics = {
			ItemType: 'PageView',
			PageName: 'Gaming.ThermalMode',
			PageContext: 'ThermalMode settings page',
			PageDuration: this.timer.stop()
    };
    if (this.metrics && this.metrics.sendMetrics) {
      this.metrics.sendMetrics(pageViewMetrics);
    } else {
      this.logger.error(`Modal-ThermalMode2-CloseThermalMode2Modal: send Metrics fail, metrics is ${this.metrics}, metrics.sendMetrics is ${this.metrics.sendMetrics}`);
    }
  }

  getThermalModeSettingStatus() {
    try {
      this.thermalModeService.getThermalModeSettingStatus().then(res => {
        this.logger.info(`Modal-ThermalMode2-GetThermalModeSettingStatus: get value from ${this.thermalModeSettingStatus} to ${res}`);
        if (!this.isThermalModeSetted && res !== this.thermalModeSettingStatus && res !== undefined) {
          this.commonService.setLocalStorageValue(LocalStorageKey.PrevThermalModeStatus, this.thermalModeSettingStatus);
          this.commonService.setLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus, res);
          this.thermalModeSettingStatus = res;
        }
      });
    } catch (error) {
      this.logger.error('Modal-ThermamMode2-GetThermalModeSettingStatus: get fail; Error message: ', error.message);
      throw new Error(error.message);
    }
  }

  setThermalModeSettingStatus(value: number) {
    this.isThermalModeSetted = true;
    if (value !== this.thermalModeSettingStatus) {
      let prevThermalModeStatus = this.thermalModeSettingStatus;
      this.thermalModeSettingStatus = value;
      this.commonService.setLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus, this.thermalModeSettingStatus);
      try {
        this.thermalModeService.setThermalModeSettingStatus(value).then(res => {
          if (res) {
            this.commonService.setLocalStorageValue(LocalStorageKey.PrevThermalModeStatus, prevThermalModeStatus);
            this.logger.info(`Modal-ThermalMode2-SetThermalModeSettingStatus: return value: ${res}, thermalmode setting from ${prevThermalModeStatus} to ${this.thermalModeSettingStatus}`);
          } else {
            this.thermalModeSettingStatus = prevThermalModeStatus;
            this.commonService.setLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus, this.thermalModeSettingStatus);
            this.logger.error(`Modal-ThermalMode2-SetThermalModeSettingStatus: return value: ${res}, thermalmode setting unchanged`);
          }
        });

        this.sendFeatureClickMetrics(JSON.parse(`{"ItemName":"thermalmode_mode_change",
        "ItemValue":"${(value === 1) ? "Quiet Mode" : (value === 2) ? "Balance Mode" : "Performance Mode"}"}`));
      } catch (error) {
        this.thermalModeSettingStatus = prevThermalModeStatus;
        this.commonService.setLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus, this.thermalModeSettingStatus);
        this.logger.error(`Modal-ThermalMode2-SetThermalModeSettingStatus: set fail; Error message: `, error.message);
        throw new Error(error.message);
      }
    }
  }

  getPerformanceOCSetting() {
    try {
      this.gamingOCService.getPerformanceOCSetting().then(res => {
        this.logger.info(`Modal-ThermamMode2-GetPerformanceOCSetting: get value from ${this.OCSettings} to ${res}`);
        if (!this.isPerformancOCSetted && res !== this.OCSettings) {
          if (this.gamingCapabilities.cpuOCFeature) {
            this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, res ? 1 : 3);
          }
          if (this.gamingCapabilities.gpuOCFeature) {
            this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, res ? 1 : 3);
          }
          this.OCSettings = res;
        }
      });
    } catch (error) {
      this.logger.error('Modal-ThermamMode2-GetPerformanceOCSetting: get fail; Error message: ', error.message);
      throw new Error(error.message);
    }
  }

  setPerformanceOCSetting(event: any) {
    this.isPerformancOCSetted = true;
    this.OCSettings = !this.OCSettings;
    if (this.gamingCapabilities.cpuOCFeature) {
      this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, this.OCSettings ? 1 : 3);
    } 
    if (this.gamingCapabilities.gpuOCFeature) {
      this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, this.OCSettings ? 1 : 3);
    }
    this.OCSettingsMsg.emit(this.OCSettings);
    try {
      this.gamingOCService.setPerformanceOCSetting(this.OCSettings).then(res => {
        if(res) {
          this.logger.info(`Modal-ThermalMode2-SetPerformanceOCSetting: return value: ${res}, OCSettings from ${!this.OCSettings} to ${this.OCSettings}`);
        } else {
          this.OCSettings = !this.OCSettings;
          if (this.gamingCapabilities.cpuOCFeature) {
            this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, this.OCSettings ? 1 : 3);
          } 
          if (this.gamingCapabilities.gpuOCFeature) {
            this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, this.OCSettings ? 1 : 3);
          }
          this.OCSettingsMsg.emit(this.OCSettings);
          this.logger.error(`Modal-ThermalMode2-SetPerformanceOCSetting: return value: ${res}, OCSettings unchanged`);
        }
      });
    } catch (error) {
      this.OCSettings = !this.OCSettings;
      if (this.gamingCapabilities.cpuOCFeature) {
        this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, this.OCSettings ? 1 : 3);
      }
      if (this.gamingCapabilities.gpuOCFeature) {
        this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, this.OCSettings ? 1 : 3);
      }
      this.OCSettingsMsg.emit(this.OCSettings);
      this.logger.error(`Modal-ThermalMode2-SetPerformanceOCSetting: set fail; Error message: `, error.message);
      throw new Error(error.message);
    }

    this.sendFeatureClickMetrics(JSON.parse(`{"ItemName":"thermalmode_enableOC","ItemValue":"${this.OCSettings ? "checked" : "unchecked"}"}`));
  }

  getAutoSwitchStatus() {
    try {
      this.thermalModeService.getAutoSwitchStatus().then(res => {
        this.logger.info(`Modal-ThermamMode2-GetAutoSwitchStatus: get value from ${this.autoSwitchStatus} to ${res}`);
        if (res !== this.autoSwitchStatus) {
          this.commonService.setLocalStorageValue(LocalStorageKey.autoSwitchStatus, res);
          this.autoSwitchStatus = res;
        }
      });
    } catch (error) {
      this.logger.error('Modal-ThermamMode2-GetAutoSwitchStatus: get fail; Error message: ', error.message);
      throw new Error(error.message);
    }
  }

  setAutoSwitchStatus(value: boolean) {
    if (value !== this.autoSwitchStatus) {
      this.autoSwitchStatus = value;
      try {
        this.thermalModeService.setAutoSwitchStatus(value).then(res => {
          if (res) {
            this.commonService.setLocalStorageValue(LocalStorageKey.autoSwitchStatus, value);
            this.logger.info(`Modal-ThermalMode2-SetAutoSwitchStatus: return value: ${res}, autoSwitchStatus from ${!this.autoSwitchStatus} to ${value}`);
          } else {
            this.autoSwitchStatus = !value;
            this.logger.error(`Modal-ThermalMode2-SetAutoSwitchStatus: return value: ${res}, autoSwitchStatus unchanged`);
          }
        });
      } catch (error) {
        this.autoSwitchStatus = !value;
        this.logger.error(`Modal-ThermalMode2-SetAutoSwitchStatus: set fail; Error message: `, error.message);
        throw new Error(error.message);
      }
    }
  }

  public registerThermalModeChangeEvent() {
		if (this.gamingCapabilities.smartFanFeature) {
      try {
        this.thermalModeService.regThermalModeChangeEvent();
        this.shellServices.registerEvent(
          EventTypes.gamingThermalModeChangeEvent,
          this.onRegThermalModeChangeEvent.bind(this)
        );
        this.logger.info('Modal-ThermalMode2-RegisterThermalModeChangeEvent: register success');
      } catch (error) {
        this.logger.error('Modal-ThermalMode2-RegisterThermalModeChangeEvent: register fail; Error message: ', error.message);
        throw new Error(error.message);
      }
		}
  }

  public onRegThermalModeChangeEvent(currentSettingStatus: any) {
    this.logger.info(`Modal-ThermalMode2-OnRegThermalModeChangeEvent: call back from ${this.thermalModeSettingStatus} to ${currentSettingStatus}`);
		if (currentSettingStatus !== undefined) {
			this.commonService.setLocalStorageValue(LocalStorageKey.PrevThermalModeStatus, this.thermalModeSettingStatus);
      this.commonService.setLocalStorageValue(LocalStorageKey.CurrentThermalModeStatus, currentSettingStatus);
      this.thermalModeSettingStatus = currentSettingStatus;
		}
	}

  public unRegisterThermalModeChangeEvent() {
		this.shellServices.unRegisterEvent(
			EventTypes.gamingThermalModeChangeEvent,
			this.onRegThermalModeChangeEvent.bind(this)
		);
	}

  // fengxu start
  openWaringModal(){
    this.closeThermalMode2Modal();
    let waringModalRef = this.modalService.open(ModalGamingPromptComponent, { backdrop:'static',windowClass: 'modal-prompt' });
    waringModalRef.componentInstance.info = {
        title : "gaming.dashboard.device.warningPromptPopup.title",
        description : "gaming.dashboard.device.warningPromptPopup.description",
        comfirmButton : "gaming.dashboard.device.warningPromptPopup.proceed",
        cancelButton : "gaming.dashboard.device.legionEdge.driverPopup.link",
        comfirmButtonAriaLabel : "PROCEED",
        cancelButtonAriaLabel : "CANCEL",
    };
    waringModalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      if(emmitedValue === 1) {
        this.openAdvancedOCModal()
      }

      this.sendFeatureClickMetrics(JSON.parse(`{"ItemParent":"Gaming.OCWarningModal","ItemName":"ocwarningmodal_btn",
      "ItemValue":"${emmitedValue === 1 ? "proceed" : emmitedValue === 2 ? "cancle" : "close"}"}`));
     });

    this.sendFeatureClickMetrics(JSON.parse(`{"ItemName":"thermalmode_advacedoc_warningmodal"}`));
	}
  openAdvancedOCModal(){
		this.modalService.open(ModalGamingAdvancedOCComponent, { backdrop:'static', windowClass: 'modal-fun' });
	}
  // fengxu end

  /**
   * metrics collection for thermalmode feature
   * @param metricsdata 
   */
  public sendFeatureClickMetrics(metricsdata:any) {
    try{
      const metricData = {
        ItemType: Object.prototype.hasOwnProperty.call(metricsdata, 'ItmeType') ? metricsdata.ItemType : 'FeatureClick',
        ItemParent: Object.prototype.hasOwnProperty.call(metricsdata, 'ItemParent') ? metricsdata.ItemParent : 'Gaming.ThermalMode'
      };
      Object.keys(metricsdata).forEach((key) => {
        if(metricsdata[key]) {
          metricData[key] = metricsdata[key];
        }
      });
      if (this.metrics && this.metrics.sendMetrics) {
        this.metrics.sendMetrics(metricData);
      } else {
        this.logger.error(`Modal-ThermalMode2-sendFeatureClickMetrics: send Metrics undefined, metrics is ${this.metrics}, metrics.sendMetrics is ${this.metrics.sendMetrics}`);
      }
    } catch (error) {
      this.logger.error('Modal-ThermalMode2-sendFeatureClickMetrics: sendFeatureClickMetrics fail; Error message: ', error.message);
    }
  }
}
