import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingThermalModeService } from 'src/app/services/gaming/gaming-thermal-mode/gaming-thermal-mode.service';
import { ModalGamingAdvancedOCComponent } from './../../modal/modal-gaming-advanced-oc/modal-gaming-advanced-oc.component';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';
import { GamingOCService } from 'src/app/services/gaming/gaming-OC/gaming-oc.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'vtr-modal-gaming-thermal-mode2',
  templateUrl: './modal-gaming-thermal-mode2.component.html',
  styleUrls: ['./modal-gaming-thermal-mode2.component.scss']
})
export class ModalGamingThermalMode2Component implements OnInit {

  public loading = false;
  public gamingCapabilities: GamingAllCapabilities = new GamingAllCapabilities();
  public thermalModeSettingStatus = 2;
  public OCsupportted = 0;
  public driverStatus = 0;
  public OCSettings = false;
  public autoSwitchStatus = false;
  public isThermalModeSetted = false;
  public isPerformancOCSetted = false;
  // @Output() thermalModeMsg = new EventEmitter<number>();
  @Output() OCSettingsMsg = new EventEmitter<number>();
  
  constructor(
    private modalService: NgbModal,
    private activeModalService: NgbActiveModal,
    private shellServices: VantageShellService,
    private commonService: CommonService,
    private gamingCapabilityService: GamingAllCapabilitiesService,
    private thermalModeService: GamingThermalModeService,
    private gamingOCService: GamingOCService,
    private logger: LoggerService
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
    if (this.OCsupportted === 3) {
      this.OCSettings = this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus) === 1 && this.commonService.getLocalStorageValue(LocalStorageKey.GpuOCStatus) === 1;
    } else if (this.OCsupportted === 2) {
      this.OCSettings = this.commonService.getLocalStorageValue(LocalStorageKey.CpuOCStatus) === 1;
    } else if (this.OCsupportted === 1) {
      this.OCSettings = this.commonService.getLocalStorageValue(LocalStorageKey.GpuOCStatus) === 1;
    }
    this.getThermalModeSettingStatus();
    this.getPerformanceOCSetting();
    this.getAutoSwitchStatus();
    this.registerThermalModeChangeEvent();
  }

  ngOnDestory() {
    this.unRegisterThermalModeChangeEvent();
  }

  renderOCSupported() {
    // oc supported status
    if (this.gamingCapabilities.cpuOCFeature) {
      if (this.gamingCapabilities.gpuOCFeature) {
        this.OCsupportted = 3;
      } else {
        this.OCsupportted = 2;
      }
    } else {
      if (this.gamingCapabilities.gpuOCFeature) {
        this.OCsupportted = 1;
      } else {
        this.OCsupportted = 0;
      }
    }
    // driver status
    if (this.gamingCapabilities.xtuService) {
      if (this.gamingCapabilities.nvDriver) {
        this.driverStatus = 3;
      } else {
        this.driverStatus = 2;
      }
    } else {
      if (this.gamingCapabilities.nvDriver) {
        this.driverStatus = 1;
      } else {
        this.driverStatus = 0;
      }
    }
  }

  closeThermalMode2Modal() {
    this.activeModalService.close();
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
          let OCStatus = res ? 1 : 3;
          if (this.gamingCapabilities.cpuOCFeature) {
            this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, OCStatus);
          }
          if (this.gamingCapabilities.gpuOCFeature) {
            this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, OCStatus);
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
    let OCStatus = this.OCSettings ? 1 : 3;
    if (this.gamingCapabilities.cpuOCFeature) {
      this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, OCStatus);
    } else if (this.gamingCapabilities.gpuOCFeature) {
      this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, OCStatus);
    }
    this.OCSettingsMsg.emit(OCStatus);
    try {
      this.gamingOCService.setPerformanceOCSetting(this.OCSettings).then(res => {
        if(res) {
          this.logger.info(`Modal-ThermalMode2-SetPerformanceOCSetting: return value: ${res}, OCSettings from ${!this.OCSettings} to ${this.OCSettings}`);
        } else {
          this.OCSettings = !this.OCSettings;
          OCStatus = this.OCSettings ? 1 : 3;
          if (this.gamingCapabilities.cpuOCFeature) {
            this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, OCStatus);
          } else if (this.gamingCapabilities.gpuOCFeature) {
            this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, OCStatus);
          }
          this.OCSettingsMsg.emit(OCStatus);
          this.logger.error(`Modal-ThermalMode2-SetPerformanceOCSetting: return value: ${res}, OCSettings unchanged`);
        }
      });
    } catch (error) {
      this.OCSettings = !this.OCSettings;
      OCStatus = this.OCSettings ? 1 : 3;
      if (this.gamingCapabilities.cpuOCFeature) {
        this.commonService.setLocalStorageValue(LocalStorageKey.CpuOCStatus, OCStatus);
      } else if (this.gamingCapabilities.gpuOCFeature) {
        this.commonService.setLocalStorageValue(LocalStorageKey.GpuOCStatus, OCStatus);
      }
      this.OCSettingsMsg.emit(OCStatus);
      this.logger.error(`Modal-ThermalMode2-SetPerformanceOCSetting: set fail; Error message: `, error.message);
      throw new Error(error.message);
    }
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
    waringModalRef.componentInstance.title="gaming.dashboard.device.warningPromptPopup.title";
    waringModalRef.componentInstance.description = "gaming.dashboard.device.warningPromptPopup.description";
    waringModalRef.componentInstance.comfirmButton="gaming.dashboard.device.warningPromptPopup.proceed";
    waringModalRef.componentInstance.cancelButton="gaming.dashboard.device.legionEdge.driverPopup.link";
    waringModalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      if(emmitedValue === 1) {
        this.openAdvancedOCModal()
      }
     });
	}
  openAdvancedOCModal(){
		this.modalService.open(ModalGamingAdvancedOCComponent, { backdrop:'static', windowClass: 'modal-fun' });
	}
  // fengxu end
}
