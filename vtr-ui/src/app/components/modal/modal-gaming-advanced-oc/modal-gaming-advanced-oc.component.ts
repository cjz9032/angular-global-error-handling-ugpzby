import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { GamingAdvancedOCService } from 'src/app/services/gaming/gaming-advanced-oc/gaming-advanced-oc.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';
import { AdvancedOCItemUnit } from 'src/app/data-models/gaming/advanced-overclock-unit';


@Component({
  selector: 'vtr-modal-gaming-advanced-oc',
  templateUrl: './modal-gaming-advanced-oc.component.html',
  styleUrls: ['./modal-gaming-advanced-oc.component.scss']
})
export class ModalGamingAdvancedOCComponent implements OnInit {
  public loading = true;
  public advanceCPUOCFeature:boolean;
  public advanceGPUOCFeature:boolean;
  public itemUnit:AdvancedOCItemUnit = new AdvancedOCItemUnit();
  public isChange = false;
  public advancedOCInfo:any = {
    cpuParameterList: [
        {
          tuneId: 116,
          OCValue: '41',
          defaultValue:'40',
          minValue: '28',
          maxValue: '80',
          stepValue: '1'
        },
        {
          tuneId: 117,
          OCValue: '41',
          defaultValue:'40',
          minValue: '28',
          maxValue: '80',
          stepValue: '1'
        }
    ],
    gpuParameterList: [
        {
            "tuneId":0,
            "defaultValue":"100",
            "OCValue":"100",
            "minValue":"200",
            "maxValue":"300",
            "stepValue":"1"
        },
        {
            "tuneId":1,
            "defaultValue":"100",
            "OCValue":"100",
            "minValue":"200",
            "maxValue":"300",
            "stepValue":"1"
        }
    ]
  };
  
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public commonService: CommonService,
    public gamingCapabilityService: GamingAllCapabilitiesService,
    private gamingAdvancedOCService: GamingAdvancedOCService
  ) { }

  ngOnInit() {
    this.advanceGPUOCFeature = this.gamingCapabilityService.getCapabilityFromCache( LocalStorageKey.advanceGPUOCFeature);
    this.advanceCPUOCFeature = this.gamingCapabilityService.getCapabilityFromCache( LocalStorageKey.advanceCPUOCFeature);
    console.log('advanceCPUOCFeature---:',this.advanceCPUOCFeature,'advanceGPUOCFeature---:',this.advanceGPUOCFeature)
    this.getAdvancedOCInfo();
  }
  closeModal() {
    if(this.isChange) {
      this.openSaveChangeModal();
    }else{
      this.activeModal.close('close');
    }
  }

  public getAdvancedOCInfo() {
    try {
			const advancedInfoCache = this.gamingAdvancedOCService.getAdvancedOCInfoCache();
      if(advancedInfoCache){
        this.loading = false;
        this.advancedOCInfo = advancedInfoCache;
      }
      this.gamingAdvancedOCService.getAdvancedOCInfo().then((response) => {
        console.log('getAdvancedOCInfo-------------------',response)
        if (response && (response.cpuParameterList.length > 0 || response.gpuParameterList.length > 0)) {
          this.loading = false;
          this.advancedOCInfo = response;
          this.gamingAdvancedOCService.setAdvancedOCInfoCache(response);
        }
      });
		} catch (error) {
			throw new Error('getAdvancedOCInfo ' + error.message);
		}
  }

  public setRangeValue (event,idx,type,tuneId,isAddReduceBtn) {
    try {
			console.log('value========================',event,isAddReduceBtn);
      const arr1 = [2,77,34,79,102,106];
      this.isChange = true;
      if(isAddReduceBtn){
        event = event[0];
      }
      if(type === 'cpuParameterList'){
        if(arr1.includes(tuneId)){
          this.pairwiseAssociation(tuneId,event);
        }else{
          this.advancedOCInfo[type][idx].OCValue = event;
        }
      }else{
        this.advancedOCInfo[type][idx].OCValue = event;
      }
		} catch (error) {
			throw new Error('setRangeValue ' + error.message);
		}
  }

  public pairwiseAssociation (tuneId, event) {
    try {
			if(tuneId === 2 || tuneId === 77){
        this.advancedOCInfo.cpuParameterList.filter(x => {
          if(x.tuneId === 77 || x.tuneId === 2){
            x.OCValue = event;
          }
        });
        console.log('cpuParameterList=========================================',this.advancedOCInfo.cpuParameterList)
      }else if(tuneId === 34 || tuneId === 79){
        this.advancedOCInfo.cpuParameterList.filter(x => {
          if(x.tuneId === 79 || x.tuneId === 34){
            x.OCValue = event;
          }
        });
        console.log('cpuParameterList=========================================',this.advancedOCInfo.cpuParameterList)
      }else if(tuneId === 102 || tuneId === 106){
        this.advancedOCInfo.cpuParameterList.filter(x => {
          if(x.tuneId === 106 || x.tuneId === 102){
            x.OCValue = event;
          }
        });
        console.log('cpuParameterList=========================================',this.advancedOCInfo.cpuParameterList)
      }
		} catch (error) {
			throw new Error('pairwiseAssociation ' + error.message);
		}
  }

  public openSaveChangeModal () {
    let waringModalRef = this.modalService.open(ModalGamingPromptComponent, { backdrop:'static', windowClass: 'modal-prompt',backdropClass:'backdrop-prompt' });
    waringModalRef.componentInstance.title="gaming.dashboard.device.savePromptPopup.title";
    waringModalRef.componentInstance.description = "gaming.dashboard.device.savePromptPopup.description1";
    waringModalRef.componentInstance.description2 = "gaming.dashboard.device.savePromptPopup.description2";
    waringModalRef.componentInstance.description3 = "gaming.dashboard.device.savePromptPopup.description3";
    waringModalRef.componentInstance.comfirmButton="gaming.dashboard.device.savePromptPopup.save";
    waringModalRef.componentInstance.cancelButton="gaming.dashboard.device.savePromptPopup.notSave";
    waringModalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      console.log(emmitedValue,'++++++');
      if(emmitedValue === 1) {
        this.isChange = false;
        this.activeModal.close('close');
        this.setAdvancedOCInfo(this.advancedOCInfo);
      }else if (emmitedValue === 2) {
        this.advancedOCInfo = this.gamingAdvancedOCService.getAdvancedOCInfoCache();
        this.isChange = false;
        this.activeModal.close('close');
      }
     });
  }

  public setAdvancedOCInfo (advancedOCInfo) {
    this.gamingAdvancedOCService.setAdvancedOCInfo(advancedOCInfo).then((response) => {
      console.log('setAdvancedOCInfo-------------------',advancedOCInfo,response)
			if (response) {
        this.gamingAdvancedOCService.setAdvancedOCInfoCache(advancedOCInfo);
			}else{
        const advancedInfoCache = this.gamingAdvancedOCService.getAdvancedOCInfoCache();
        if(advancedInfoCache){
          this.advancedOCInfo = advancedInfoCache;
        }
      }
		});
  }

  public openSetToDefaultModal () {
    let waringModalRef = this.modalService.open(ModalGamingPromptComponent, { backdrop:'static', windowClass: 'modal-prompt',backdropClass:'backdrop-prompt' });
    waringModalRef.componentInstance.title="gaming.dashboard.device.defaultPromptPopup.title";
    waringModalRef.componentInstance.description = "gaming.dashboard.device.defaultPromptPopup.description";
    waringModalRef.componentInstance.comfirmButton="gaming.dashboard.device.legionEdge.popup.button";
    waringModalRef.componentInstance.cancelButton="gaming.dashboard.device.legionEdge.driverPopup.link";
    waringModalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      console.log(emmitedValue,'++++++');
      if(emmitedValue === 1) {
        this.isChange = false;
        this.setToDefaultValue(this.advancedOCInfo.cpuParameterList);
        console.log('tthis.advancedOCInfo.cpuParameterList',this.advancedOCInfo.cpuParameterList);
        this.setToDefaultValue(this.advancedOCInfo.gpuParameterList);
        console.log('tthis.advancedOCInfo.gpuParameterList',this.advancedOCInfo.gpuParameterList);
        this.setAdvancedOCInfo(this.advancedOCInfo);
      }
     });
  }

  public setToDefaultValue (list) {
    try {
			if(list.length > 0){
        for(let i=0;i<=list.length-1;i++){
          list[i].OCValue = Number(list[i].defaultValue);
        }
      }
		} catch (error) {
			throw new Error('setToDefaultValue ' + error.message);
		}
  }
}
