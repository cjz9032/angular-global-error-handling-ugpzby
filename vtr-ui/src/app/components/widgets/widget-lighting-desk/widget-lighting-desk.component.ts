import { Component, OnInit, Input,OnChanges } from '@angular/core';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { LightingDataList } from 'src/app/data-models/gaming/lighting-new-version/lighting-data-list';

@Component({
  selector: 'vtr-widget-lighting-desk',
  templateUrl: './widget-lighting-desk.component.html',
  styleUrls: ['./widget-lighting-desk.component.scss']
})
export class WidgetLightingDeskComponent implements OnInit,OnChanges {
  @Input() currentProfileId: number;
  public countObj:any = {count1:0,count2:0,count3:0};
  public isDisabledlef:any = [true,true,true];
  public isDisabledrig:any = [false,false,false];
  public isProfileOff:boolean = false;
  public lightingProfileCurrentDetail:any = new LightingDataList().lightingCurrentDetailDesk;
  public lightingEffectList:any;
  public isColorPicker:boolean = false;
  public isShow:boolean = true;
  public supportSpeed:boolean = true;
  public supportBrightness:boolean = true;
  public supportColor:boolean = true;
  public lightingCapabilities:any = new LightingDataList().lightingCapality;
  public lightingProfileById:any;
  public lightingPanelImage:any = new LightingDataList().lightingPanelImage;
  public lightingEffectRgbData:any = new LightingDataList().lightingEffectRgbData;
  public lightingEffectSingleData:any = new LightingDataList().lightingEffectSingleData;
  public isEffectChange:boolean;
  public isValChange:boolean = true;

  constructor(
    private commonService: CommonService,
    private gamingLightingService: GamingLightingService,
  ) { }

  ngOnInit() {
    this.initProfileId();
    this.getCacheList();
    if(this.commonService.getLocalStorageValue(LocalStorageKey.LightingCapabilitiesNewversionDesk) !== undefined){
      this.lightingCapabilities = this.commonService.getLocalStorageValue(LocalStorageKey.LightingCapabilitiesNewversionDesk);
      console.log("cache-------capality----------111111111111111------------111111111111111",this.lightingCapabilities);
      this.imgDefaultOff();  
			this.getLightingCapabilitiesFromcache(this.lightingCapabilities); 
    }
    console.log("cache------profile-----------111111111111111------------111111111111111",this.lightingProfileById);
    if (this.lightingProfileById !== undefined) {
      console.log("cache-----------------222222222222------------222222222222222",this.lightingProfileById);
      this.getLightingProfileByIdFromcache(this.lightingProfileById,this.lightingCapabilities);
    }
    this.getLightingCapabilities();
    if (this.currentProfileId === 0) {
			this.isProfileOff = true;
		}
  }

  ngOnChanges (changes) {
    console.log("changes----------------",changes)
  }

  public getLightingCapabilitiesFromcache(lightingCapabilitiesRes){
    try {
      console.log("cache-----capability------------------->11111111",lightingCapabilitiesRes);
      if (lightingCapabilitiesRes !== undefined) {
        this.lightingCapabilities = lightingCapabilitiesRes;
      }
    } catch (error){
      console.log(error);
    }
  }

  public getLightingProfileByIdFromcache(lightingProfileByIdRes,lightingCapabilitiesRes){
    try {
      console.log("cache-----getProfileId------------------->222222222222",lightingProfileByIdRes);
      if(lightingProfileByIdRes !== undefined){
        let ProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
        if (ProfileId !== 'undefined') {
          this.currentProfileId = ProfileId;
        };
        if(lightingProfileByIdRes.lightInfo !== null){
          this.isShowpageInfo(lightingProfileByIdRes);
          this.lightingProfileDetail(lightingProfileByIdRes,this.countObj['count'+this.currentProfileId],lightingCapabilitiesRes);
        }
      }
    } catch (error){
      console.log(error);
    }   
  }

  public getLightingCapabilities(){
    try {
      if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingCapabilities().then((response: any) => {
          console.log("response--------capility------>3333333333",response);
          if(response){
            this.lightingCapabilities = response;
            this.commonService.setLocalStorageValue(LocalStorageKey.LightingCapabilitiesNewversionDesk,response);
            this.imgDefaultOff();  
            this.getLightingProfileById(this.currentProfileId);
          }
				});
			}
    } catch (error){
      console.log(error);
    } 
  }

  public getLightingProfileById(currProfileId){
    try { 
        //if profileId is 0,no need to use interfae
        if(currProfileId === 0) return;
        if(this.gamingLightingService.isShellAvailable){
          this.gamingLightingService.getLightingProfileById(currProfileId).then((response:any) => {
              console.log("response------getProfileId--------->4444444",response);
              if(response.didSuccess){
                this.publicPageInfo(response,1);
              }
          })
         }
    } catch (error){
      console.log(error);
    } 
  }

  public setLightingProfileId(event){
    console.log("event--------------------------------------------->",event.target.value);
      try {
          this.isColorPicker = false;
          this.isShow = true;
          let profileId = Number(event.target.value);
          this.currentProfileId = profileId;
          this.imgDefaultOff();  
          if (this.currentProfileId === 0) {
            this.isProfileOff = true;
          } else {
            this.isProfileOff = false;
            /* Use cache before set    start  */
            this.getCacheList();
            this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
            /* Use cache before set    end */
          }
          if (this.gamingLightingService.isShellAvailable) {
            this.gamingLightingService.setLightingProfileId(1, this.currentProfileId).then((response: any) => {
              console.log("setLightingProfileId--------------------------->",response,this.countObj['count'+this.currentProfileId]);
              if (response.didSuccess) {
                this.publicPageInfo(response,1);
              }else{
                this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
                if(this.currentProfileId === 0){
                  this.isProfileOff = true;
                }else{
                  this.isProfileOff = false;
                  this.getCacheList();
                  this.isShowpageInfo(this.lightingProfileById);
                  this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
                }
              }
            });
          }
      } catch (error) {
        console.log(error);
      }
  } 
  
  public colorPickerFun(){
    try {
        if(this.isShow){
          this.isColorPicker = true;
          this.isShow = false;
        }else{
          this.isColorPicker = false;
          this.isShow = true;
        }
    } catch (error){
      console.log(error);
    }
  }

  public isToggleColorPicker(event){
    try {
        this.isColorPicker = event;
        this.isShow = true;
    } catch (error) {
      console.log(error);
    }
  }

  public setLightingColor(event){
    try {
       console.log("event--color------------------>",event);
       this.lightingProfileCurrentDetail.lightColor = "#" + event;
      /* Use cache before set    start  */
      this.getCacheList();
      this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
      /* Use cache before set    end */
      let colorJson:any = {
        profileId:this.currentProfileId,
        lightPanelType:this.lightingProfileCurrentDetail.lightPanelType,
        lightColor:event,
        lightLayoutVersion:3
      };
      if(this.gamingLightingService.isShellAvailable){
        this.gamingLightingService.setLightingProfileEffectColor(colorJson).then((response:any) => {
          console.log("response--------color---------11111--------->",response);
          if(response.didSuccess) {
            this.publicPageInfo(response,2);
          }else{
            this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
            this.getCacheList();
            this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
          }
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  public setLightingProfileEffect(event){
    try {
      console.log("event------effect------------------->",event);
      this.supportBrightFn(event.value);
      this.supportSpeedFn(event.value);
      this.supportColorFn(event.value);
      /* Use cache before set    start  */
      this.getCacheList();
      this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
      /* Use cache before set    end */
      let effectJson:any = {
         profileId:this.currentProfileId,
         lightPanelType:this.lightingProfileCurrentDetail.lightPanelType,
         lightEffectType:event.value,
         lightLayoutVersion:3
       };
       console.log("effectJson-------------->",effectJson)
       if (this.gamingLightingService.isShellAvailable) {
        this.gamingLightingService
          .setLightingProfileEffectColor(effectJson)
          .then((response: any) => {
            console.log("response---------effect--------------->",response);
            if (response.didSuccess) {
              this.isEffectChange = true;
              this.publicPageInfo(response,2);
            }else{
              this.isEffectChange = false;
              console.log("false--------------11111111111111111")
              this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
              this.getCacheList();
              console.log("false--------------222222222222222",this.lightingProfileById);
              this.isShowpageInfo(this.lightingProfileById);
              this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
            }
          });
      }
    } catch (error) {
       console.log(error);
    }
  }

  public setLightingBrightness(event){
    try {
        console.log("event------brightness------------------>",event[0]);
        /* Use cache before set    start  */
        this.getCacheList();
        this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
        /* Use cache before set    end */
        let brightJson:any = {
          profileId:this.currentProfileId,
          lightPanelType:this.lightingProfileCurrentDetail.lightPanelType,
          lightBrightness:event[0],
          lightLayoutVersion:3
        };
        if(this.gamingLightingService.isShellAvailable){
          this.gamingLightingService.setLightingProfileEffectColor(brightJson).then((response:any) => {
            console.log("response---------brightness------------->",response);
            if(response.didSuccess) {
              this.publicPageInfo(response,2);
            }else{
              // this.getCacheList();
              // this.publicPageInfo(this.lightingProfileById,2);
              this.isValChange = false;
              this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
              this.getCacheList();
              this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
            }
          })
        }
    } catch (error) {
        console.log(error);
    }
  } 
  
  public setLightingSpeed(event){
    try {
        console.log("event------speed------------------>",event[0]);
        this.lightingProfileCurrentDetail.lightSpeed = event[0];
        /* Use cache before set    start  */
        this.getCacheList();
        this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
        /* Use cache before set    end */
        let speedJson:any = {
          profileId:this.currentProfileId,
          lightPanelType:this.lightingProfileCurrentDetail.lightPanelType,
          lightSpeed:event[0],
          lightLayoutVersion:3
        };
        if(this.gamingLightingService.isShellAvailable){
          this.gamingLightingService.setLightingProfileEffectColor(speedJson).then((response:any) => {
            console.log("response---------speed------------->",response);
            if(response.didSuccess) {
               this.publicPageInfo(response,2);
            }else{
              // this.getCacheList();
              // this.publicPageInfo(this.lightingProfileById,2);
              this.isValChange = false;
              this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
              this.getCacheList();
              this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
            }
          })
        }
    } catch (error) {
        console.log(error);
    }
  } 

  public setDefaultProfile(profileId){
     try {
        console.log("defaultId------------------>",profileId);   
        this.isColorPicker = false;
        this.isShow = true;
        /* Use cache before set    start  */
        this.getCacheDefaultList();
        this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
        /* Use cache before set    end */
        if(this.gamingLightingService.isShellAvailable){
          this.gamingLightingService.setLightingDefaultProfileById(profileId).then((response: any) => {
            console.log("response--------default----------------->",response);
             if(response.didSuccess){
               this.publicDefaultInfo(response);
             }else{
               this.getCacheDefaultList();
               this.publicDefaultInfo(this.lightingProfileById);
             }
          })
        }   
     } catch (error) {
       console.log(error);
     }
  }

  public panelSwitchLef(){
    this.isColorPicker = false;
    this.isShow = true;
    if(this.countObj['count'+this.currentProfileId]>0){
      this.countObj['count'+this.currentProfileId]--;
      this.isDisabledlef[this.currentProfileId-1] = false;
      this.isDisabledrig[this.currentProfileId-1] = false;

      this.isShowpageInfo(this.lightingProfileById);
      this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
    }
    if(this.countObj['count'+this.currentProfileId]<=0){
      this.isDisabledlef[this.currentProfileId-1] = true;
    }
  }

  public panelSwitchRig(){
    this.isColorPicker = false;
    this.isShow = true;
    if(this.countObj['count'+this.currentProfileId] < this.lightingCapabilities.LightPanelType.length-1){
      this.countObj['count'+this.currentProfileId]++;
      this.isDisabledlef[this.currentProfileId-1] = false;
      this.isDisabledrig[this.currentProfileId-1] = false;
      this.isShowpageInfo(this.lightingProfileById);
      this.lightingProfileDetail(this.lightingProfileById,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
    }
    if(this.countObj['count'+this.currentProfileId] >= this.lightingCapabilities.LightPanelType.length-1){
      this.isDisabledrig[this.currentProfileId-1] = true;
    }
    
  }

  public getCurrentName(lightingPanelImage,lightPanelType){
    let nameObj = lightingPanelImage.filter((element) => {
      return element.value === lightPanelType;
    });
    return nameObj;
  }

  public lightingProfileDetail(lightingProfileByIdRes,count,lightingCapabilitiesRes){
    try{
      if(lightingProfileByIdRes !== undefined){
        if(lightingProfileByIdRes.lightInfo !== null && lightingProfileByIdRes.lightInfo.length>0){
          //show panelImg and panelName
          let currentNameImg;   
          let currentEffectName:any;
          this.lightingProfileCurrentDetail = lightingProfileByIdRes.lightInfo[count];
          currentNameImg = this.getCurrentName(this.lightingPanelImage,this.lightingProfileCurrentDetail.lightPanelType);
          if(currentNameImg.length > 0){
            this.lightingProfileCurrentDetail.panelName = currentNameImg[0].panelName;
            this.lightingProfileCurrentDetail.pathUrl = currentNameImg[0].pathUrl;
            // this.lightingProfileCurrentDetail.panelImage = currentNameImg[0].panelImage;
            this.lightingProfileCurrentDetail.panelImageType = currentNameImg[0].panelImageType;
            this.lightingProfileCurrentDetail.length = lightingProfileByIdRes.lightInfo.length;
            if(lightingCapabilitiesRes.LightPanelType.indexOf(16)>-1){
              this.lightingProfileCurrentDetail.panelImage = './../../../../assets/images/gaming/lighting/lighting-ui-new/T550_water_cold.png';
            }else{
              this.lightingProfileCurrentDetail.panelImage = currentNameImg[0].panelImage;
            }
          }
          //Gets the returned list of effects
          if(lightingCapabilitiesRes.SupportRGBSetList.indexOf(this.lightingProfileCurrentDetail.lightPanelType) > -1){ //Rgb effect list
            this.lightingEffectRgbData.dropOptions = this.lightingEffectRgbData.dropOptions.filter(
                  (i) => lightingCapabilitiesRes.LedType_Complex.includes(i.value)
            )
            this.lightingEffectList = this.lightingEffectRgbData;
            currentEffectName = this.getCurrentName(this.lightingEffectRgbData.dropOptions,this.lightingProfileCurrentDetail.lightEffectType);
          }else{  //single effect list
            this.lightingEffectSingleData.dropOptions = this.lightingEffectSingleData.dropOptions.filter(
                (i) => lightingCapabilitiesRes.LedType_simple.includes(i.value)
            )
            this.lightingEffectList = this.lightingEffectSingleData;
            currentEffectName = this.getCurrentName(this.lightingEffectSingleData.dropOptions,this.lightingProfileCurrentDetail.lightEffectType);
          }
          this.lightingEffectList.curSelected  = this.lightingProfileCurrentDetail.lightEffectType;
          if(currentEffectName.length > 0){
            this.lightingProfileCurrentDetail.currentEffectName = currentEffectName[0].name;
          }
          console.log("lightingProfileCurrentDetail--------------------->",this.lightingProfileCurrentDetail);
        }
      }
    }catch(error){
      console.log(error)
    }
    
    
  }
 
  public supportBrightFn(val){
    if(this.lightingCapabilities.SupportBrightnessSetList.indexOf(this.lightingProfileCurrentDetail.lightPanelType) > -1){   //support bright of panel
      if(this.lightingCapabilities.SupportRGBSetList.indexOf(this.lightingProfileCurrentDetail.lightPanelType) > -1){ //Rgb color
          console.log("rgb---------------bright----1111111111111");
          if(val === 268435456){
            console.log("rgb---------------bright----off----off");
            this.supportBrightness = false;
          }else{
            this.supportBrightness = true;
          }
        }else{  //single color
          console.log("single---------------bright----2222222222");
          if(val === 1){
            console.log("single---------------bright----on");
            this.supportBrightness = true;
          }else{
            this.supportBrightness = false;
         } 
         if(this.lightingCapabilities.SupportBrightnessSetList.indexOf(128) > -1){  //T550G
            this.supportBrightness = false;
         }
       }
    }else{
      this.supportBrightness = false;
    }
  }

  public supportSpeedFn(val){
    if(this.lightingCapabilities.SupportSpeedSetList.indexOf(this.lightingProfileCurrentDetail.lightPanelType) > -1){   //support speed of panel
      if(this.lightingCapabilities.SupportRGBSetList.indexOf(this.lightingProfileCurrentDetail.lightPanelType) > -1){ //Rgb color
        if(val === 1 || val === 64 || val === 268435456){
            this.supportSpeed = false;
          }else{
            this.supportSpeed = true;
          }
      }
    }else{
      this.supportSpeed = false;
    }
  }

  public supportColorFn(val){
    if(this.lightingCapabilities.SupportRGBSetList.indexOf(this.lightingProfileCurrentDetail.lightPanelType) > -1){  //rgb color
      if(val === 1 || val === 2 || val === 4 || val === 32){ 
        this.supportColor = true;
      }else{
        this.supportColor = false;
      }
    }else{
      this.supportColor = false;
    }
  }

  public isShowpageInfo(res){
    if(res.lightInfo !== null && res.lightInfo.length > 0){
      this.lightingProfileCurrentDetail = res.lightInfo[this.countObj['count'+this.currentProfileId]];
    }
    this.supportBrightFn(this.lightingProfileCurrentDetail.lightEffectType);
    this.supportSpeedFn(this.lightingProfileCurrentDetail.lightEffectType);
    this.supportColorFn(this.lightingProfileCurrentDetail.lightEffectType);
  }

  public getCacheList(){
    if(this.currentProfileId !== 0){
      if(this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdDesk'+this.currentProfileId]) !== undefined){
        this.lightingProfileById = this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdDesk'+this.currentProfileId]);
      }
    }
  }

  public setCacheList(){
    if(this.currentProfileId !== 0){
      this.commonService.setLocalStorageValue(LocalStorageKey['LightingProfileByIdDesk'+this.currentProfileId],this.lightingProfileById);
    }
  }

  public getCacheDefaultList(){ 
    if(this.currentProfileId !== 0){
      if(this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileDeskDefault'+this.currentProfileId]) !== undefined){
        this.lightingProfileById = this.commonService.getLocalStorageValue(LocalStorageKey['LightingProfileByIdDesk'+this.currentProfileId]);
      }
    }
  }

  public setCacheDefaultList(){
    if(this.currentProfileId !== 0){
      this.commonService.setLocalStorageValue(LocalStorageKey['LightingProfileDeskDefault'+this.currentProfileId],this.lightingProfileById);
      this.commonService.setLocalStorageValue(LocalStorageKey['LightingProfileByIdDesk'+this.currentProfileId],this.lightingProfileById);
    }
  }

  public imgDefaultOff(){
     if(this.currentProfileId === 0){
        if(this.lightingCapabilities.LightPanelType.indexOf(4)>-1){
          this.lightingProfileCurrentDetail.panelImage = "./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_wind_cold.png";
        }else if(this.lightingCapabilities.LightPanelType.indexOf(16)>-1){
          this.lightingProfileCurrentDetail.panelImage = "./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_water_cold.png";
        }else if(this.lightingCapabilities.LightPanelType.indexOf(64)>-1){
          this.lightingProfileCurrentDetail.panelImage = "./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_big_y.png";  
        }else if(this.lightingCapabilities.LightPanelType.indexOf(128)>-1){
          this.lightingProfileCurrentDetail.panelImage = "./../../../../assets/images/gaming/lighting/lighting-ui-new/T550G_front_line.png";  
        }else if(this.lightingCapabilities.LightPanelType.indexOf(256)>-1){
          this.lightingProfileCurrentDetail.panelImage = "./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_front.png";  
        }
     }
  }

  public publicPageInfo(response,key){
    this.lightingProfileById = response;
    this.currentProfileId = response.profileId;
    if(key === 1){
      console.log("init-------------------##############")
      this.isShowpageInfo(this.lightingProfileById);
    };
    this.lightingProfileDetail(response,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
    this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId,response.profileId);
    this.setCacheList();
  }

  public initProfileId(){
    if(this.currentProfileId === null || this.currentProfileId === undefined){
      if(this.gamingLightingService.isShellAvailable){
        this.gamingLightingService.getLightingProfileId().then((response: any) => {
            if (response.didSuccess) {
              console.log("response-----------profile------------->",response);
              this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId,response.profileId);
              this.currentProfileId = response.profileId;
              this.getLightingProfileById(this.currentProfileId);
            }
        });
      }
    }else{
      if(this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId) !== undefined){
        this.currentProfileId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId);
        console.log("current------------cache---------",this.currentProfileId);
      }
    }
  }

  public publicDefaultInfo(response){
    this.lightingProfileById = response;
    this.currentProfileId = response.profileId;
    this.countObj['count'+this.currentProfileId] = 0;
    this.isDisabledrig[this.currentProfileId-1] = false;
    this.isDisabledlef[this.currentProfileId-1] = true;
    this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId, response.profileId);
    this.isShowpageInfo(this.lightingProfileById);
    this.lightingProfileDetail(response,this.countObj['count'+this.currentProfileId],this.lightingCapabilities);
    this.setCacheDefaultList();
  }

}
