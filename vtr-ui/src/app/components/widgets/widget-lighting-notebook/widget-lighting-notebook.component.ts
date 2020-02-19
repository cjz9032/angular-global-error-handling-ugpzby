import { Component, OnInit, Input, HostListener, NgZone } from '@angular/core';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { LightingDataList } from 'src/app/data-models/gaming/lighting-new-version/lighting-data-list';

@Component({
  selector: 'vtr-widget-lighting-notebook',
  templateUrl: './widget-lighting-notebook.component.html',
  styleUrls: ['./widget-lighting-notebook.component.scss']
})
export class WidgetLightingNotebookComponent implements OnInit {
  @Input() currentProfileId: number;
  public color:string;
  public isDefault:boolean;
  public isDisablled:boolean = false;
  public lightingCapabilities:any = new LightingDataList().lightingCapality;
  public lightingProfileById:any;
  public lightingEffectData:any = new LightingDataList().lightingEffectNoteData;
  public lightingEffectList:any;
  public lightingCurrentDetail:any = new LightingDataList().lightingCurrentDetailNote;
  public isProfileOff:boolean = true;
  public isColorPicker:boolean = false;
  public isShow:boolean = true;
  public lightingArea:any;
  public toggleStatus:any;
  public isSupportSpeed:boolean;
  public ledSwitchButtonFeature:boolean;
  public lightInfo:any;
  public isSetDefault:boolean;
  public isEffectChange:boolean;
  public isValChange:boolean = true;
  public showOptions:boolean;

  @HostListener('document:click', ['$event']) onClick(event) {
    this.isSetDefault =false;
  }
  
  constructor(
    private ngZone:NgZone,
    private commonService: CommonService,
    private gamingLightingService: GamingLightingService,
		public shellServices: VantageShellService,
  ) { }

  ngOnInit() {
    this.initProfileId();
    this.getCacheList();
    if(this.commonService.getLocalStorageValue(LocalStorageKey.LightingCapabilitiesNewversionNote) !== undefined){
      this.lightingCapabilities = this.commonService.getLocalStorageValue(LocalStorageKey.LightingCapabilitiesNewversionNote);
      console.log("this.lightingCapabilities----------cache---------",this.lightingCapabilities);
      this.getLightingCapabilitiesFromcache(this.lightingCapabilities);
    }
    if (this.lightingProfileById !== undefined) {
      this.getLightingProfileByIdFromcache(this.lightingProfileById); 
    }
    this.getLightingCapabilities();

    this.ledSwitchButtonFeature = this.commonService.getLocalStorageValue(LocalStorageKey.LedSwitchButtonFeature);
    console.log("ledSwitchButtonFeature------------",this.ledSwitchButtonFeature);
    if(this.ledSwitchButtonFeature){
      this.regLightingProfileIdChangeEvent();
    }
  }

  public getLightingCapabilitiesFromcache(res){
     try {
       if(res !== undefined){
           this.lightingCapabilities = res;
           this.getEffectList();
       }
     } catch (error) {}
  }

  public getLightingProfileByIdFromcache(res){
      try {
        if(res !== undefined){
          let ProfileId;
          if(res.lightInfo !== null && res.lightInfo.length > 0){
            this.ifDisabledKeyboard(res.lightInfo[0].lightEffectType);
          }
          if(this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId) !== undefined){
            ProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
            this.currentProfileId = ProfileId;
          }
          this.getLightingCurrentDetail(res);
        }
      } catch (error) {}
  }
 
 public getLightingCapabilities(){
    try {
      if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingCapabilities().then((response: any) => {
          console.log("LightingCapabilities----------------",response);
          if(response){
            this.lightingCapabilities = response;
            this.getEffectList();
            this.commonService.setLocalStorageValue(LocalStorageKey.LightingCapabilitiesNewversionNote,response);
            this.getLightingProfileById(this.currentProfileId)
          }
        });
			}
    } catch (error) {}
  }

  public getLightingProfileById(currentProfileId){
    try {
      if (currentProfileId === 0) {
        this.isProfileOff = true;
      }else{
        this.isProfileOff = false;
      }
      //if profileId is 0,no need to use interfae
      if(currentProfileId === 0) return;
      if (this.gamingLightingService.isShellAvailable) {
        this.gamingLightingService.getLightingProfileById(currentProfileId).then((response:any) => {
          console.log("getLightingProfileById------------------",response);
          this.publicProfileIdInfo(response);
        });
      }
    } catch (error) {}
  }

  public setLightingProfileId(event){
    try {
      this.isColorPicker = false;
      this.isShow = true;
      let profileId = Number(event.target.value);
      this.currentProfileId = profileId;
      if (this.currentProfileId === 0) {
        this.isProfileOff = true;
      } else {
        this.isProfileOff = false;
      }

      /* Use cache before set    start  */
      this.getCacheList();
      if(this.lightingProfileById !== undefined){
        if(this.lightingProfileById.lightInfo !== null && this.lightingProfileById.lightInfo.length > 0){
          this.ifDisabledKeyboard(this.lightingProfileById.lightInfo[0].lightEffectType);
        }
        this.getLightingCurrentDetail(this.lightingProfileById);
      }
      
      /* Use cache before set    end */

      if (this.gamingLightingService.isShellAvailable) {
        this.gamingLightingService.setLightingProfileId(1, this.currentProfileId).then((response: any) => {
          console.log("setLightingProfileId------------------",response);
          if (response.didSuccess) {
            this.publicProfileIdInfo(response);
          }else{
            this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
            if (this.currentProfileId === 0) {
              this.isProfileOff = true;
            }else{
              this.isProfileOff = false;
              this.getCacheList();
              if(this.lightingProfileById !== undefined){
                if(this.lightingProfileById.lightInfo !== null && this.lightingProfileById.lightInfo.length > 0){
                  this.ifDisabledKeyboard(this.lightingProfileById.lightInfo[0].lightEffectType);
                }
                this.getLightingCurrentDetail(this.lightingProfileById);
              }
  
            }
          }
        });
      }
    } catch (error) {}
  }

  public regLightingProfileIdChangeEvent(){
    this.gamingLightingService.regLightingProfileIdChangeEvent();
    this.shellServices.registerEvent(
      EventTypes.gamingLightingProfileIdChangeEvent,
      this.getProfileEvent.bind(this)
    );
  }

  public getProfileEvent(profileId){
    this.ngZone.run(()=> {
      console.log("profileId--------event--------",profileId);
      if(this.currentProfileId === profileId) return;
      this.isColorPicker = false;
      this.showOptions = false;
      this.isShow = true;
      this.currentProfileId = profileId;
      if(this.isSetDefault){
        this.getCacheDefaultList();
      }else{
        this.getCacheList();
      }
      if(this.lightingProfileById !== undefined){
        if(this.lightingProfileById.lightInfo !== null && this.lightingProfileById.lightInfo.length > 0){
          this.ifDisabledKeyboard(this.lightingProfileById.lightInfo[0].lightEffectType);
        }
        this.getLightingCurrentDetail(this.lightingProfileById);
        this.getLightingProfileById(this.currentProfileId);
      }else{
        this.getLightingProfileById(this.currentProfileId);
      }
    });
    
  }

  public setLightingProfileEffect(event){
    try {
      this.ifDisabledKeyboard(event.value);
      /* Use cache before set    start  */
      this.getCacheList();
      this.getLightingCurrentDetail(this.lightingProfileById);
      /* Use cache before set    end */
      let effectJson:any = {
        profileId:this.currentProfileId,
        lightPanelType:this.lightingCurrentDetail.lightPanelType,
        lightEffectType:event.value,
        lightLayoutVersion:2
      };
      console.log("effectJson------------------",effectJson);
      if (this.gamingLightingService.isShellAvailable) {
       this.gamingLightingService.setLightingProfileEffectColor(effectJson).then((response: any) => {
        console.log("setLightingProfileEffect------------------",response);
         if (response.didSuccess) {
           this.isEffectChange = true; 
           this.publicPageInfo(response);
         }else{
          this.isEffectChange = false;
          this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
          this.getCacheList();
          if(this.lightingProfileById !== undefined){
            if(this.lightingProfileById.lightInfo !== null && this.lightingProfileById.lightInfo.length > 0){
              this.ifDisabledKeyboard(this.lightingProfileById.lightInfo[0].lightEffectType);
            }
            this.getLightingCurrentDetail(this.lightingProfileById);
          }
         }
       });
     }
    } catch (error) {}
  }

  public setLightingBrightness(event){
    try {
      /* Use cache before set    start  */
      this.getCacheList();
      this.getLightingCurrentDetail(this.lightingProfileById);
      /* Use cache before set    end */

      let brightJson:any = {
        profileId:this.currentProfileId,
        lightPanelType:this.lightingCurrentDetail.lightPanelType,
        lightBrightness:event[0],
        lightLayoutVersion:2
      };
      console.log("brightJson------------------",brightJson);
      if(this.gamingLightingService.isShellAvailable){
        this.gamingLightingService.setLightingProfileEffectColor(brightJson).then((response:any) => {
          console.log("setLightingBrightness------------------",response);
          if(response.didSuccess) {
             this.publicPageInfo(response);
          }else{
            this.isValChange = false;
            this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
            this.getCacheList();
            this.getLightingCurrentDetail(this.lightingProfileById);
          }
        })
      }
    } catch (error) {}
  }

  public setLightingSpeed(event){
     try {
       /* Use cache before set    start  */
       this.getCacheList();
       this.getLightingCurrentDetail(this.lightingProfileById);
       /* Use cache before set    end */

       let speedJson:any = {
         profileId:this.currentProfileId,
         lightPanelType:this.lightingCurrentDetail.lightPanelType,
         lightSpeed:event[0],
         lightLayoutVersion:2
       };
       console.log("speedJson------------------",speedJson);
       if(this.gamingLightingService.isShellAvailable){
         this.gamingLightingService.setLightingProfileEffectColor(speedJson).then((response:any) => {
          console.log("setLightingSpeed------------------",response);
           if(response.didSuccess) {
             this.publicPageInfo(response);
           }else{
             this.isValChange = false;
             this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
             this.getCacheList();
             this.getLightingCurrentDetail(this.lightingProfileById);
           }
         })
       }
     } catch (error) {}
  }

  public setDefaultProfile(profileId){
     try {
       this.isDefault = true;
       this.isSetDefault = true;
       /* Use cache before set  start*/
       this.getCacheDefaultList();
       this.getLightingCurrentDetail(this.lightingProfileById);
       /* Use cache before set  end*/

       if(this.gamingLightingService.isShellAvailable){
        this.gamingLightingService.setLightingDefaultProfileById(profileId).then((response:any) => {
          console.log("setDefaultProfile------------------",response);
          if(response.didSuccess){
           this.publicDefaultInfo(response);
          }else{
           this.getCacheDefaultList();
           this.publicDefaultInfo(this.lightingProfileById);
          }
        })
       }
     } catch (error) {}
  }

  public changeIsDefaultFn (status) {
    this.isDefault = false;
  }

  public selectLightingArea(event){
    try {
      this.showOptions = false;
      this.lightingArea = event.area;
      this.color = event.color;
      if(this.isShow){
       this.isColorPicker = true;
       this.isShow = false;
     }else{
       this.isColorPicker = false;
       this.isShow = true;
     }
    } catch (error) {}
  }

  public isEffectListFn(event){
    this.showOptions = event;
  }

  public isToggleColorPicker(event){
    try {
        this.isColorPicker = event;
        this.isShow = true;
    } catch (error) {}
  }

  public setLightingColor(event){
    try {
      /* Use cache before set    start  */
      this.getCacheList();
      this.getLightingCurrentDetail(this.lightingProfileById);
      /* Use cache before set    end */
      this.color = event;
      let colorJson:any = {
        profileId:this.currentProfileId,
        lightPanelType:this.lightingArea,
        lightColor:event,
        lightLayoutVersion:2
      };
      console.log('colorJson--------------',colorJson);
      if(this.gamingLightingService.isShellAvailable){
        this.gamingLightingService.setLightingProfileEffectColor(colorJson).then((response:any) => {
          console.log('setLightingColor--------------',response);
          if(response.didSuccess) {
              this.publicPageInfo(response);
          }else{
            this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
            this.getCacheList();
            this.getLightingCurrentDetail(this.lightingProfileById);
          }
        })
      }
    } catch (error) {}
  }
  
  public getCurrentName(lightingPanelImage,lightPanelType){
    let nameObj = lightingPanelImage.filter((element) => {
      return element.value === lightPanelType;
    });
    console.log("nameObj--------------",nameObj);
    return nameObj;
  }

  public getLightingCurrentDetail(res){
    try {
      console.log("detaile----------------",res);
      if (this.currentProfileId === 0) {
        this.isProfileOff = true;
      }else{
        this.isProfileOff = false;
      }
      if(res !== undefined){
         if(res.lightInfo !== null && res.lightInfo.length > 0){
           this.lightingCurrentDetail = res.lightInfo[0];
           this.lightInfo = res.lightInfo;
           let currentName = this.getCurrentName(this.lightingEffectData.dropOptions,this.lightingCurrentDetail.lightEffectType);
           if(currentName.length > 0){
             this.lightingCurrentDetail.lightingEffectName = currentName[0].name;
           }
           this.lightingEffectList.curSelected = this.lightingCurrentDetail.lightEffectType;
           this.effectSupportSpeed(this.lightingCurrentDetail.lightEffectType);
           console.log("this.lightingCurrentDetail-------------",this.lightingCurrentDetail);
         }
      }
    } catch (error) {}
  }

  public getEffectList(){
    this.lightingEffectData.dropOptions = this.lightingEffectData.dropOptions.filter(
      (i) => this.lightingCapabilities.LedType_Complex.includes(i.value)
    )
    this.lightingEffectList = this.lightingEffectData;
    console.log("effectList-----------",this.lightingEffectList);
  }

  public getCacheList(){
    this.lightingProfileById = undefined;
    this.toggleStatus = this.commonService.getLocalStorageValue(LocalStorageKey.KeyboardToggleStatusLNBx50);
    console.log("toggleStatus------------------",this.toggleStatus,this.currentProfileId);
    if(this.toggleStatus !== undefined){
      if(this.currentProfileId !== 0){
        if(this.toggleStatus['profileId'+this.currentProfileId].status !== 'undefined'){
          if(this.toggleStatus['profileId'+this.currentProfileId].status){
            if(this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOn'+this.currentProfileId]) !== undefined){
              this.lightingProfileById = this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOn'+this.currentProfileId]);
            }
          }else{
            if(this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOff'+this.currentProfileId]) !== undefined){
              this.lightingProfileById = this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOff'+this.currentProfileId]);
            }
          }
        }
      }
    }
    console.log("this.lightingProfileById-----------------------",this.lightingProfileById);
  }

  public setCacheList(){
    this.toggleStatus = this.commonService.getLocalStorageValue(LocalStorageKey.KeyboardToggleStatusLNBx50);
    if(this.toggleStatus !== undefined){
      if(this.currentProfileId !== 0){
        if(this.toggleStatus['profileId'+this.currentProfileId].status !== 'undefined'){
          if(this.toggleStatus['profileId'+this.currentProfileId].status){
            this.commonService.setLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOn'+this.currentProfileId],this.lightingProfileById);
          }else{
            this.commonService.setLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOff'+this.currentProfileId],this.lightingProfileById);
          }
        }
      }
    }
  }

  public setCacheInitList(){
    if(this.currentProfileId !== 0){
      let isDiffColor = this.gamingLightingService.checkAreaColorFn(this.lightingProfileById.lightInfo);
      if(isDiffColor){
        let lightcolorList = this.getColorList(JSON.parse(JSON.stringify(this.lightingProfileById)));
        this.commonService.setLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOn'+this.currentProfileId],this.lightingProfileById);
        this.commonService.setLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOff'+this.currentProfileId],lightcolorList);
      }else{
        this.commonService.setLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOn'+this.currentProfileId],this.lightingProfileById);
        this.commonService.setLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOff'+this.currentProfileId],this.lightingProfileById);
      }
    }
  }

  public setCacheDafaultList(){ 
    let toggleOnCache:any,toggleOffCache:any;
    this.toggleStatus = this.commonService.getLocalStorageValue(LocalStorageKey.KeyboardToggleStatusLNBx50);
    if(this.toggleStatus !== undefined){
      if(this.currentProfileId !== 0){
        if(this.toggleStatus['profileId'+this.currentProfileId].status !== 'undefined'){
          this.commonService.setLocalStorageValue(LocalStorageKey['LightingProfileByIdDefault'+this.currentProfileId],this.lightingProfileById);
          this.setCacheInitList();
        }
      }
    }
  }

  public getCacheDefaultList(){
    this.lightingProfileById = undefined;
    this.toggleStatus = this.commonService.getLocalStorageValue(LocalStorageKey.KeyboardToggleStatusLNBx50);
    if(this.toggleStatus !== undefined){
      if(this.currentProfileId !== 0){
        if(this.toggleStatus['profileId'+this.currentProfileId].status !== 'undefined'){
          if(this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdDefault'+this.currentProfileId]) !== undefined){
            this.lightingProfileById = this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdDefault'+this.currentProfileId]);
          }
        }
      }
    }
  }
   
  public getColorList(colorList){
    if(colorList.lightInfo.length > 0){
      const newList =  colorList.lightInfo.map(_ => colorList.lightInfo[0])
      return {
          ...colorList,
          lightInfo: newList
      }
    }
  }

  public ifDisabledKeyboard(value) {
    if(value === 1024 || value === 32 || value === 4096 || value === 8192){
      this.isDisablled = true;
    }else{
      this.isDisablled = false;
    }
  }
 
  public effectSupportSpeed(value){
    if(value === 1 || value === 1024){
      this.isSupportSpeed = false;
    }else{
      this.isSupportSpeed = true;
    }
  }

  public initProfileId(){
    console.log("this.currentProfileId-------------init-----",this.currentProfileId);
    if(this.currentProfileId === null || this.currentProfileId === undefined){
      if (this.gamingLightingService.isShellAvailable) {
        this.gamingLightingService.getLightingProfileId().then((response: any) => {
            if (response.didSuccess) {
              this.currentProfileId = response.profileId;
              this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId,response.profileId);
              this.getLightingProfileById(this.currentProfileId);
            }
        });
      }
    }else{
      if(this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId) !== undefined){
        this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
      }
    }
    console.log("this.currentProfileId------------------",this.currentProfileId);
  }

  public publicPageInfo(response){
    this.lightingProfileById = response;
    this.currentProfileId = response.profileId;
    this.getLightingCurrentDetail(response);
    this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId, response.profileId);
    this.setCacheList();
  }

  public publicProfileIdInfo(response){
    if(response !== undefined){
      let toggleOnCache:any,toggleOffCache:any;
      this.lightingProfileById = response;
      this.currentProfileId = response.profileId;
      if(this.lightingProfileById.lightInfo !== null && this.lightingProfileById.lightInfo.length > 0){
        this.ifDisabledKeyboard(this.lightingProfileById.lightInfo[0].lightEffectType);
      }
      this.getLightingCurrentDetail(response);
      this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId, response.profileId);
      if(this.currentProfileId !== 0){
        if(this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOn'+this.currentProfileId]) !== undefined){
          toggleOnCache = this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOn'+this.currentProfileId]);
        }
        if(this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOff'+this.currentProfileId]) !== undefined){
          toggleOffCache = this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdNoteOff'+this.currentProfileId]);
        }
      }
      if(toggleOnCache !== undefined && toggleOffCache !== undefined){
        this.setCacheList();
      }else{
        this.setCacheInitList();
      }
    }
  }

  public publicDefaultInfo(response){
    if(response !== undefined){
      this.lightingProfileById = response;
      this.currentProfileId = response.profileId;
      if(this.lightingProfileById.lightInfo !== null && this.lightingProfileById.lightInfo.length > 0){
        this.ifDisabledKeyboard(this.lightingProfileById.lightInfo[0].lightEffectType);
      }
      this.getLightingCurrentDetail(response);
      this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId, response.profileId);
      this.setCacheDafaultList();
      // this.setCacheList(true);
    }
  }

}
