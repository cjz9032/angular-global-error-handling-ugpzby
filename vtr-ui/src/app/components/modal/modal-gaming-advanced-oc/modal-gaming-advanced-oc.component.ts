import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAdvancedOCService } from 'src/app/services/gaming/gaming-advanced-oc/gaming-advanced-oc.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';
import { AdvancedOCItemUnit } from 'src/app/data-models/gaming/advanced-overclock-unit';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TimerService } from 'src/app/services/timer/timer.service';

@Component({
	selector: 'vtr-modal-gaming-advanced-oc',
	templateUrl: './modal-gaming-advanced-oc.component.html',
	styleUrls: ['./modal-gaming-advanced-oc.component.scss']
})
export class ModalGamingAdvancedOCComponent implements OnInit {
	public loading = true;
	public advanceCPUOCFeature: boolean;
	public advanceGPUOCFeature: boolean;
	public itemUnit: AdvancedOCItemUnit = new AdvancedOCItemUnit();
	public isChange = false;
	public advancedOCInfo: any = {
		cpuParameterList: [
			{
				tuneId: 116,
				OCValue: '41',
				defaultValue: '40',
				minValue: '28',
				maxValue: '80',
				stepValue: '1'
			},
			{
				tuneId: 117,
				OCValue: '41',
				defaultValue: '40',
				minValue: '28',
				maxValue: '80',
				stepValue: '1'
			}
		],
		gpuParameterList: [
			{
				tuneId: 0,
				defaultValue: '100',
				OCValue: '100',
				minValue: '200',
				maxValue: '300',
				stepValue: '1'
			},
			{
				tuneId: 1,
				defaultValue: '100',
				OCValue: '100',
				minValue: '200',
				maxValue: '300',
				stepValue: '1'
			}
		]
	};

  modalAutomationId: any = {
	section: 'save_change_dialog',
	headerText: 'save_change_dialog_header_text',
	description: 'save_change_dialog_oc_recovery_description',
	description2: 'save_change_dialog_oc_recovery_pressing_power_button',
	closeButton : 'save_change_dialog_close_button',
	cancelButton: 'save_change_dialog_do_not_save_button',
	okButton: 'save_change_dialog_save_button'
	}

  defaultModalAutomationId: any = {
		section: 'set_to_default_dialog',
		headerText : 'set_to_default_header_text',
		description : 'set_to_default_description',
		closeButton : 'set_to_default_close_button',
		cancelButton: 'set_to_default_cancel_button',
		okButton: 'set_to_default_ok_button'
	}

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
		public commonService: CommonService,
		public gamingCapabilityService: GamingAllCapabilitiesService,
		private gamingAdvancedOCService: GamingAdvancedOCService,
		private logger: LoggerService,
		private metrics: MetricService,
		private timer: TimerService
	) { }

	ngOnInit() {
		this.advanceGPUOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.advanceGPUOCFeature);
		this.advanceCPUOCFeature = this.gamingCapabilityService.getCapabilityFromCache(LocalStorageKey.advanceCPUOCFeature);
		this.logger.info('advanceCPUOCFeature init cache:' + this.advanceCPUOCFeature + ';  advanceGPUOCFeature init cache:' + this.advanceGPUOCFeature + ' ;');
		this.getAdvancedOCInfo();
		this.timer.start();
	}
	closeModal() {
		if (this.isChange) {
			this.openSaveChangeModal();
		} else {
			this.activeModal.close('close');

			this.sendPageViewMetricsData();
		}

		this.sendFeatureClickMetrics(JSON.parse(`{"ItemName":"advancedoc_close"}`));
	}

	public getAdvancedOCInfo() {
		const advancedInfoCache = this.gamingAdvancedOCService.getAdvancedOCInfoCache();
		if (advancedInfoCache) {
			this.loading = false;
			this.advancedOCInfo = advancedInfoCache;
		}
		this.gamingAdvancedOCService.getAdvancedOCInfo().then((response) => {
			this.logger.info('getAdvancedOCInfo response', response)
			if (response && (response.cpuParameterList.length > 0 || response.gpuParameterList.length > 0)) {
				this.loading = false;
				this.advancedOCInfo = response;
				this.gamingAdvancedOCService.setAdvancedOCInfoCache(response);
			}
		});
	}

	public setRangeValue(event, idx, type, tuneId, isAddReduceBtn) {
		this.logger.info(`setRangeValue event: ${event} ; isAddReduceBtn: ${isAddReduceBtn}`);
		const arr1 = [2, 77, 34, 79, 102, 106];
      	const arr2 = [29,30,31,32,42,43,96,97,107,108];
      	let btnType = 0;
		this.isChange = true;
		if (isAddReduceBtn) {
        	btnType = event[1];
			event = event[0];
		}
		if (type === 'cpuParameterList') {
			if (arr1.includes(tuneId)) {
				this.pairwiseAssociation(tuneId, event);
			}else if(arr2.includes(tuneId)) {
				let isPlusSlider = 0;
				if(this.advancedOCInfo[type][idx].OCValue > event){
					isPlusSlider = 1;
				}else if(this.advancedOCInfo[type][idx].OCValue < event){
					isPlusSlider = 2;
				}
				this.multipleAssociations(arr2,tuneId,event,btnType,isPlusSlider);
			} else {
				this.advancedOCInfo[type][idx].OCValue = event;
			}
		} else {
			this.advancedOCInfo[type][idx].OCValue = event;
		}
	}

	public multipleAssociations (arr, tuneId, event, btnType,isPlusSlider) {
		let index = arr.indexOf(tuneId);
		if(btnType === 2 || isPlusSlider === 2) {
			for (let i = 0; i<=index; i++) {
				this.advancedOCInfo.cpuParameterList.filter(x => {
					if(x.tuneId === arr[i]){
						if(Number(event) > Number(x.OCValue)){
							x.OCValue = event;
						}
					}
				});
			}
		}
		if (btnType === 1 || isPlusSlider === 1) {
			for (let j = index; j<arr.length; j++) {
				this.advancedOCInfo.cpuParameterList.filter(x => {
					if(x.tuneId === arr[j]){
						if(Number(event) < Number(x.OCValue)){
							x.OCValue = event;
						}
					}
				});
			}
		}
	}
	public pairwiseAssociation(tuneId, event) {
		if (tuneId === 2 || tuneId === 77) {
			this.advancedOCInfo.cpuParameterList.filter(x => {
				if (x.tuneId === 77 || x.tuneId === 2) {
					x.OCValue = event;
				}
			});
			this.logger.info('pairwiseAssociation cpuParameterList 1', this.advancedOCInfo.cpuParameterList);
		} else if (tuneId === 34 || tuneId === 79) {
			this.advancedOCInfo.cpuParameterList.filter(x => {
				if (x.tuneId === 79 || x.tuneId === 34) {
					x.OCValue = event;
				}
			});
			this.logger.info('pairwiseAssociation cpuParameterList 2', this.advancedOCInfo.cpuParameterList);
		} else if (tuneId === 102 || tuneId === 106) {
			this.advancedOCInfo.cpuParameterList.filter(x => {
				if (x.tuneId === 106 || x.tuneId === 102) {
					x.OCValue = event;
				}
			});
			this.logger.info('pairwiseAssociation cpuParameterList 3', this.advancedOCInfo.cpuParameterList);
		}
	}

	public openSaveChangeModal() {
		const waringModalRef = this.modalService.open(ModalGamingPromptComponent, { backdrop: 'static', windowClass: 'modal-prompt', backdropClass: 'backdrop-prompt' });
		waringModalRef.componentInstance.info = {
			title: 'gaming.dashboard.device.savePromptPopup.title',
			description: 'gaming.dashboard.device.savePromptPopup.description1',
			description2: 'gaming.dashboard.device.savePromptPopup.description2',
			description3: 'gaming.dashboard.device.savePromptPopup.description3',
			comfirmButton: 'gaming.dashboard.device.savePromptPopup.save',
			cancelButton: 'gaming.dashboard.device.savePromptPopup.notSave',
			comfirmButtonAriaLabel: 'SAVE',
			cancelButtonAriaLabel: 'DON\'T SAVE',
			confirmMetricEnabled : false,
			confirmMetricsItemId : '',
			cancelMetricEnabled : false,
			cancelMetricsItemId : '',
			id: this.modalAutomationId
		};
		waringModalRef.componentInstance.emitService.subscribe((emmitedValue) => {
			this.logger.info('openSaveChangeModal emmitedValue', emmitedValue);
			if (emmitedValue === 1) {
				this.isChange = false;
				this.activeModal.close('close');
				this.setAdvancedOCInfo(this.advancedOCInfo);
			} else if (emmitedValue === 2) {
				this.advancedOCInfo = this.gamingAdvancedOCService.getAdvancedOCInfoCache();
				this.isChange = false;
				this.activeModal.close('close');
			}

			this.sendOCChangedMetricsData(emmitedValue);
		});

		this.sendFeatureClickMetrics(JSON.parse(`{"ItemName":"advancedoc_savechange_warningmodal"}`));
	}

	public setAdvancedOCInfo(advancedOCInfo) {
		try {
			this.gamingAdvancedOCService.setAdvancedOCInfo(advancedOCInfo).then((response) => {
				this.logger.info(`setAdvancedOCInfo response: ${response} ; advancedOCInfo: ${JSON.stringify(advancedOCInfo)}`);
				if (response) {
					this.gamingAdvancedOCService.setAdvancedOCInfoCache(advancedOCInfo);
				} else {
					const advancedInfoCache = this.gamingAdvancedOCService.getAdvancedOCInfoCache();
					if (advancedInfoCache) {
						this.advancedOCInfo = advancedInfoCache;
					}
				}
			});
		} catch (error) {
			throw new Error('setAdvancedOCInfo ' + error.message);
		}

	}

  public openSetToDefaultModal () {
	const waringModalRef = this.modalService.open(ModalGamingPromptComponent, { backdrop:'static', windowClass: 'modal-prompt',backdropClass:'backdrop-prompt' });
	waringModalRef.componentInstance.info = {
		title : 'gaming.dashboard.device.defaultPromptPopup.title',
		description : 'gaming.dashboard.device.defaultPromptPopup.description',
		comfirmButton : 'gaming.dashboard.device.legionEdge.popup.button',
		cancelButton : 'gaming.dashboard.device.legionEdge.driverPopup.link',
		comfirmButtonAriaLabel : 'OK',
		cancelButtonAriaLabel : 'CANCEL',
		confirmMetricEnabled : false,
		confirmMetricsItemId : '',
		cancelMetricEnabled : false,
		cancelMetricsItemId : '',
		id : this.defaultModalAutomationId
	};
	waringModalRef.componentInstance.emitService.subscribe((emmitedValue) => {
		this.logger.info('openSetToDefaultModal emmitedValue',emmitedValue);
		if(emmitedValue === 1) {
		this.isChange = false;
		this.setToDefaultValue(this.advancedOCInfo.cpuParameterList);
		this.setToDefaultValue(this.advancedOCInfo.gpuParameterList);
		this.setAdvancedOCInfo(this.advancedOCInfo);
		}

			this.sendFeatureClickMetrics(JSON.parse(`{"ItemParent":"Gaming.AdvancedOC.SetToDefaultWarningModal",
      "ItemName":"advancedoc_settodefaultwarningmodal_btn",
      "ItemValue":"${emmitedValue === 1 ? 'ok' : emmitedValue === 2 ? 'cancel' : 'close'}"}`));
		});

		this.sendFeatureClickMetrics(JSON.parse(`{"ItemName":"advancedoc_settodefault_warningmodal"}`));
	}

	public setToDefaultValue(list) {
		if (list.length > 0) {
			for (let i = 0; i <= list.length - 1; i++) {
				list[i].OCValue = Number(list[i].defaultValue);
			}
		}
	}

	/**
	* metrics collection for advancedoc feature
	* @param metricsdata
	*/
	public sendFeatureClickMetrics(metricsdata: any) {
		try {
			const metricData = {
				ItemType: Object.prototype.hasOwnProperty.call(metricsdata, 'ItmeType') ? metricsdata.ItemType : 'FeatureClick',
				ItemParent: Object.prototype.hasOwnProperty.call(metricsdata, 'ItemParent') ? metricsdata.ItemParent : 'Gaming.AdvancedOC'
			};
			Object.keys(metricsdata).forEach((key) => {
				if (metricsdata[key]) {
					metricData[key] = metricsdata[key];
				}
			});
			if (this.metrics && this.metrics.sendMetrics) {
				this.metrics.sendMetrics(metricData);
			}
		} catch (error) { }
	}
	/**
	 * metrics collection of OC parameter changed
	 * @param occhangedinfo
	 */
	public sendOCChangedMetricsData(occhangedinfo: any) {
		try {
			const parameterValue = {};
			if (occhangedinfo === 1) {
				if (Object.prototype.hasOwnProperty.call(this.advancedOCInfo, 'cpuParameterList')) {
					for (let i = 0; i < this.advancedOCInfo.cpuParameterList.length; i += 1) {
						parameterValue[this.itemUnit.cpuOCNames['cpuOCName' + this.advancedOCInfo.cpuParameterList[i].tuneId]] = this.advancedOCInfo.cpuParameterList[i].OCValue;
					}
				}
				if (Object.prototype.hasOwnProperty.call(this.advancedOCInfo, 'gpuParameterList')) {
					for (let i = 0; i < this.advancedOCInfo.gpuParameterList.length; i += 1) {
						parameterValue[this.itemUnit.gpuOCNames['gpuOCName' + this.advancedOCInfo.gpuParameterList[i].tuneId]] = this.advancedOCInfo.gpuParameterList[i].OCValue;
					}
				}
			}

			this.sendFeatureClickMetrics(JSON.parse(`{"ItemParent":"Gaming.AdvancedOC.SaveChangeWarningModal","ItemName":"advancedoc_savechangewarningmodal_btn",
        "ItemValue":"${occhangedinfo === 1 ? 'save' : occhangedinfo === 2 ? 'don\'t save' : 'close'}",
        "ItemParam":${(occhangedinfo === 1 && Object.keys(parameterValue).length !== 0) ? JSON.stringify(parameterValue) : null}}`));

			if (occhangedinfo === 1 || occhangedinfo === 2) {
				this.sendPageViewMetricsData();
			}
		} catch (error) { }
	}
	/**
	 * page view metrics collection for advanced oc feature
	 */
	public sendPageViewMetricsData() {
		try {
			const pageViewMetrics = {
				ItemType: 'PageView',
				PageName: 'Gaming.AdvancedOC',
				PageContext: 'AdvancedOC settings page',
				PageDuration: this.timer.stop()
			};
			if (this.metrics && this.metrics.sendMetrics) {
				this.metrics.sendMetrics(pageViewMetrics);
			}
		} catch (error) { }
	}

	public removeSpaces(str: any) {
		if (str) {
			return str.replace(/ /g,'_').toLowerCase();
		}
  }
}
