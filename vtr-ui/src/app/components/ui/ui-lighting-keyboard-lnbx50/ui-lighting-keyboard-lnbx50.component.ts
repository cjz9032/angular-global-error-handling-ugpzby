import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../../services/common/common.service';
import { KeyboardToggleStatusLNBx50 } from 'src/app/data-models/gaming/lighting-keyboard/keyboard-toggle-status-LNBx50';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
  selector: 'vtr-ui-lighting-keyboard-lnbx50',
  templateUrl: './ui-lighting-keyboard-lnbx50.component.html',
  styleUrls: ['./ui-lighting-keyboard-lnbx50.component.scss']
})
export class UiLightingKeyboardLNBx50Component implements OnInit, OnChanges{

  @Input() listInfo:any;
  @Input() isDefault:boolean;
  @Input() profileId;
  @Input() isColorPicker;
  @Input() isDisabled:boolean;

  @Output() areaSetting: EventEmitter<any> = new EventEmitter();
  @Output() changeIsDefault: EventEmitter<any> = new EventEmitter();

  public toggleStatusLNBx50:KeyboardToggleStatusLNBx50 = new KeyboardToggleStatusLNBx50();

  public isDivideArea:boolean;
  public selectPanel = 0;
  public selectedArea = 0;
  public keyboardInfo = [
      {
          id: 1,
          color: '#1ca77e',
          area: [
            [
                { id:1, width:'5%', height:'4.1%', color:'#1ca77e' },
                { id:1, width:'5%', height:'4.1%', color:'#1ca77e' },
                { id:1, width:'5%', height:'4.1%', color:'#1ca77e' },
                { id:1, width:'5%', height:'4.1%', color:'#1ca77e' },
                { id:1, width:'5%', height:'4.1%', color:'#1ca77e' }
            ],
            [
                { id:1, width:'4.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' }
            ],
            [
                { id:1, width:'8.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' }
            ],
            [
                { id:1, width:'11%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' }
            ],
            [
                { id:1, width:'13.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' }
            ],
            [
                { id:1, width:'8%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' },
                { id:1, width:'5.5%', height:'5.7%', color:'#1ca77e' }
            ]
        ],
      },
      {
        id: 2,
        color: '#c88f24',
        area: [
            [
                { id:2, width:'5%', height:'4.1%', color:'#c88f24' },
                { id:2, width:'5%', height:'4.1%', color:'#c88f24' },
                { id:2, width:'5%', height:'4.1%', color:'#c88f24' },
                { id:2, width:'5%', height:'4.1%', color:'#c88f24' },
                { id:2, width:'5%', height:'4.1%', color:'#c88f24' },
                { id:2, width:'5%', height:'4.1%', color:'#c88f24' }
            ],
            [
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' }
            ],
            [
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' }
            ],
            [
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' }
            ],
            [
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' }
            ],
            [
                { id:2, width:'27.5%', height:'5.7%', color:'#c88f24' },
                { id:2, width:'5.5%', height:'5.7%', color:'#c88f24' }
            ]
        ]
      },
      {
        id: 4,
        color: '#0a6ada',
        area: [
            [
                { id:4, width:'5%', height:'4.1%', color:'#0a6ada' },
                { id:4, width:'5%', height:'4.1%', color:'#0a6ada' },
                { id:4, width:'5%', height:'4.1%', color:'#0a6ada' },
                { id:4, width:'5%', height:'4.1%', color:'#0a6ada' },
                { id:4, width:'5%', height:'4.1%', color:'#0a6ada' }
            ],
            [
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'9.5%', height:'5.7%', color:'#0a6ada' }
            ],
            [
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' }
            ],
            [
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'8.5%', height:'5.7%', color:'#0a6ada' }
            ],
            [
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'11.5%', height:'5.7%', color:'#0a6ada' },
            ],
            [
                { id:4, width:'5.5%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.67%', height:'5.7%', color:'transparent', empty:true },
                { id:4, width:'5.66%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.67%', height:'5.7%', color:'transparent', empty:true }
            ],
            [
                { id:4, width:'5.67%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.66%', height:'5.7%', color:'#0a6ada' },
                { id:4, width:'5.67%', height:'5.7%', color:'#0a6ada' }
            ]
        ]
      },
      {
        id: 8,
        color: '#c44146',
        area: [
            [
                { id:8, width:'5%', height:'4.1%', color:'#c44146' },
                { id:8, width:'5%', height:'4.1%', color:'#c44146' },
                { id:8, width:'5%', height:'4.1%', color:'#c44146' },
                { id:8, width:'5%', height:'4.1%', color:'#c44146' }
            ],
            [
                { id:8, width:'5%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'5.7%', color:'#c44146' }
            ],
            [
                { id:8, width:'5%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'11.4%', color:'#c44146' }
            ],
            [
                { id:8, width:'5%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'5.7%', color:'#c44146' }
            ],
            [
                { id:8, width:'5%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'11.4%', color:'#c44146' }
            ],
            [
                { id:8, width:'10%', height:'5.7%', color:'#c44146' },
                { id:8, width:'5%', height:'5.7%', color:'#c44146' }
            ]
        ]
      }

  ];

  constructor(
	private commonService: CommonService,
	private localCacheService: LocalCacheService,
    private gamingLightingService: GamingLightingService,
  ) {
    if(this.localCacheService.getLocalCacheValue(LocalStorageKey.KeyboardToggleStatusLNBx50) === undefined){
        this.localCacheService.setLocalCacheValue(LocalStorageKey.KeyboardToggleStatusLNBx50,this.toggleStatusLNBx50);
    }
  }

  ngOnInit() {

  }

  ngOnChanges(changes) {
      if(changes.listInfo){
          this.setToggleStatusCache();
      }
      if(changes.isColorPicker && !this.isColorPicker){
          this.selectPanel = 0;
          this.selectedArea = 0;
      }
  }

  public selectAreaFn(area,color) {
      this.selectedArea = area;
      this.selectPanel = area;
      if(this.isDivideArea){
          this.areaSetting.emit({
              area:area,
              color:color
          });
      }else{
          this.areaSetting.emit({
              area:[1,2,4,8],
              color:color
          });
      }
  }

  public mouseoverFn (event,panel,color) {
    if(this.selectedArea === 0){
        this.selectPanel = panel;
    }
  }

  public mouseoutFn (event,panel) {
      if(this.selectedArea === 0){
        this.selectPanel = 0;
      }else{
        this.selectPanel = this.selectedArea;
      }
  }

  public getProfileInfoCache(event) {
    try {
        if(event){
            let response = this.localCacheService.getLocalCacheValue(LocalStorageKey['LightingProfileByIdNoteOn'+this.profileId]);
            this.listInfo = response.lightInfo;
        }else{
            let response = this.localCacheService.getLocalCacheValue(LocalStorageKey['LightingProfileByIdNoteOff'+this.profileId]);
            this.listInfo = response.lightInfo;
        }
    } catch (error) {
        throw new Error('getProfileInfoCache ' + error.message);
    }
  }

  public onToggleOnOff (event) {
    try {
        this.isDivideArea = event;
        this.toggleStatusLNBx50 = this.localCacheService.getLocalCacheValue(LocalStorageKey.KeyboardToggleStatusLNBx50);
        this.toggleStatusLNBx50['profileId'+this.profileId].status = this.isDivideArea;
        this.localCacheService.setLocalCacheValue(LocalStorageKey.KeyboardToggleStatusLNBx50,this.toggleStatusLNBx50);
        this.getProfileInfoCache(event);
        const colorJson:any = {
            profileId: this.profileId,
            lightPanelType: [1,2,4,8],
            lightColor: this.listInfo.map(o => o.lightColor)
        };
        if(this.gamingLightingService.isShellAvailable){
          this.gamingLightingService.setLightingProfileEffectColor(colorJson).then((response:any) => {
            if(response.didSuccess) {}else{
                this.isDivideArea = !this.isDivideArea;
                this.getProfileInfoCache(this.isDivideArea);
            }
          })
        }
    } catch (error) {
        throw new Error("onToggleOnOff " + error.message);
      }
  }

  public setToggleStatusCache() {
    try {
        if(this.listInfo && this.profileId != 0){
            this.toggleStatusLNBx50 = this.localCacheService.getLocalCacheValue(LocalStorageKey.KeyboardToggleStatusLNBx50);
            if(this.isDefault){
                if(this.toggleStatusLNBx50['profileId'+this.profileId].defaultStatus === 'undefined') {
                    this.isDivideArea = this.gamingLightingService.checkAreaColorFn(this.listInfo);
                    this.toggleStatusLNBx50['profileId'+this.profileId].defaultStatus = this.isDivideArea;
                    this.toggleStatusLNBx50['profileId'+this.profileId].status = this.isDivideArea;
                    this.localCacheService.setLocalCacheValue(LocalStorageKey.KeyboardToggleStatusLNBx50,this.toggleStatusLNBx50);
                }else{
                    this.isDivideArea = this.toggleStatusLNBx50['profileId'+this.profileId].defaultStatus;
                    this.toggleStatusLNBx50['profileId'+this.profileId].status = this.isDivideArea;
                    this.localCacheService.setLocalCacheValue(LocalStorageKey.KeyboardToggleStatusLNBx50,this.toggleStatusLNBx50);
                }
                setTimeout(()=>{
                    this.changeIsDefault.emit(false);
                },100)
            }else{
                if(this.toggleStatusLNBx50['profileId'+this.profileId].status === 'undefined') {
                    this.isDivideArea = this.gamingLightingService.checkAreaColorFn(this.listInfo);
                    this.toggleStatusLNBx50['profileId'+this.profileId].status = this.isDivideArea;
                    this.localCacheService.setLocalCacheValue(LocalStorageKey.KeyboardToggleStatusLNBx50,this.toggleStatusLNBx50);
                }else{
                    this.isDivideArea = this.toggleStatusLNBx50['profileId'+this.profileId].status;
                }
            }
        }
    } catch (error) {
        throw new Error("setToggleStatusCache " + error.message);
    }
  }

  public hideColordisk(){
    this.selectPanel = 0;
    this.selectedArea = 0;
  }

}
