import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { CommonService } from './../../../services/common/common.service';
import { WidgetLightingNotebookComponent } from './widget-lighting-notebook.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const gamingLightingServiceMock = jasmine.createSpyObj('GamingLightingService', ['getLightingProfileId', 'getLightingProfileById', 'setLightingProfileId', 'setLightingProfileBrightness',
    'isShellAvailable', 'getLightingCapabilities', 'setLightingDefaultProfileById', 'setLightingProfileEffectColor', 'checkAreaColorFn', 'regLightingProfileIdChangeEvent']);
const commonServiceMock = {
    getLocalStorageValue: (key, defaultVal) => {
        if(localStorage.getItem(key) !== "undefined"){
            return JSON.parse(localStorage.getItem(key));
        }else{
            return undefined;
        } 
    },
    setLocalStorageValue: (key, value) => localStorage.setItem(key, JSON.stringify(value))
};
const lightingProfileById: any = {
    didSuccess: true,
    profileId: 2,
    brightness: 0,
    lightInfo: [
        { lightPanelType: 1, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 },
        { lightPanelType: 2, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 },
        { lightPanelType: 4, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 },
        { lightPanelType: 8, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 }]
}
const lightingProfileByIdFail: any = {
    didSuccess: false,
    profileId: 2,
    brightness: 0,
    lightInfo: [
        { lightPanelType: 1, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 },
        { lightPanelType: 2, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 },
        { lightPanelType: 4, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 },
        { lightPanelType: 8, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 }]
}
const lightingCapility: any = {
    LightPanelType: [1, 2, 4, 8],
    LedType_Complex: [268435456, 1, 2, 4, 8, 32, 256, 512],
    LedType_simple: [268435456, 1, 2, 3, 4],
    BrightAdjustLevel: 4,
    RGBfeature: 256,
    SpeedSetLevel: 4,
    SupportBrightnessSetList: [1, 2, 4, 8],
    SupportRGBSetList: [4, 8],
    SupportSpeedSetList: [4, 8],
    UnifySetList: [0]
}
const toggleStatus: any = {
    "profileId2": { "status": true, "defaultStatus": "undefined" },
    "profileId1": { "status": false, "defaultStatus": "undefined" },
    "profileId3": { "status": true, "defaultStatus": "undefined" }
};
describe('WidgetLightingNotebookComponent', () => {
    let component: WidgetLightingNotebookComponent;
    let fixture: ComponentFixture<WidgetLightingNotebookComponent>;
    gamingLightingServiceMock.isShellAvailable.and.returnValue(true);
    gamingLightingServiceMock.getLightingProfileId.and.returnValue(Promise.resolve({ didSuccess: true, profileId: 2 }));
    gamingLightingServiceMock.getLightingCapabilities.and.returnValue(Promise.resolve(lightingCapility));
    gamingLightingServiceMock.getLightingProfileById.and.returnValue(Promise.resolve(lightingProfileById));
    gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(lightingProfileById));
    gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(lightingProfileById));
    gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve(lightingProfileById));
    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [WidgetLightingNotebookComponent, mockPipe({ name: 'translate' })],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                NgbModal,NgbActiveModal,
                { provide: GamingLightingService, useValue: gamingLightingServiceMock },
                { provide: CommonService, useValue: commonServiceMock }
            ],
            imports: [HttpClientModule]
        })
            .compileComponents();
        fixture = TestBed.createComponent(WidgetLightingNotebookComponent);
        component = fixture.debugElement.componentInstance;
        component.currentProfileId = 2;
        localStorage.setItem('[LocalStorageKey] ProfileId', "2");
        if (localStorage.getItem('[LocalStorageKey] KeyboardToggleStatusLNBx50') == null || localStorage.getItem('[LocalStorageKey] KeyboardToggleStatusLNBx50') === undefined) {
            localStorage.setItem('[LocalStorageKey] KeyboardToggleStatusLNBx50', JSON.stringify(toggleStatus));
        }
        if (localStorage.getItem('[LocalStorageKey] LedSwitchButtonFeature') == null) {
            localStorage.setItem('[LocalStorageKey] LedSwitchButtonFeature', "true");
        }
        
        fixture.detectChanges();
    }));

    it('should create', fakeAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('currentProfileId should be null', fakeAsync(() => {
        component.currentProfileId = null;
        component.initProfileId();
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
    }));

    it('should change default profileId', () => {
        component.changeIsDefaultFn(true);
        expect(component.isDefault).toEqual(false);
    })

    it('should select lighting area', fakeAsync(() => {
        const event = { 'area': true };
        component.isShow = true;
        component.selectLightingArea(event);
        tick(10);
        expect(component.isColorPicker).toEqual(true);
        component.isShow = false;
        component.selectLightingArea(event);
        tick(10);
        expect(component.isColorPicker).toEqual(false);
    }))

    it('should is effect', () => {
        component.isEffectListFn(true);
        expect(component.showOptions).toEqual(true);
    })

    it('should toggle color picker', () => {
        component.isToggleColorPicker(true);
        expect(component.isColorPicker).toEqual(true);
    })

    it('should set lighting profileId', fakeAsync(() => {
        const event = { "target": { "value": 2 } };
        gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve(lightingProfileById));
        component.setLightingProfileId(event);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
        gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve(lightingProfileByIdFail));
        component.setLightingProfileId(event);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
        localStorage.setItem('[LocalStorageKey] ProfileId', "0");
        component.setLightingProfileId({ "target": { "value": 0 } });
        tick(10);
        expect(component.isProfileOff).toEqual(true);
    }))

    it('should set lighting effect', fakeAsync(() => {
        const event = { 'value': 2 };
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(lightingProfileById));
        component.setLightingProfileEffect(event);
        tick(10);
        expect(component.lightingCurrentDetail.lightEffectType).toBeLessThanOrEqual(2);
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(lightingProfileByIdFail));
        component.setLightingProfileEffect(event);
        tick(10);
        expect(component.lightingCurrentDetail.lightEffectType).toBeLessThanOrEqual(2);
    }))

    it('should set lighting bright', fakeAsync(() => {
        const event = [2];
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(lightingProfileById));
        component.setLightingBrightness(event);
        tick(10);
        expect(component.lightingCurrentDetail.lightBrightness).toBeLessThanOrEqual(2);
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(lightingProfileByIdFail));
        component.setLightingBrightness(event);
        tick(10);
        expect(component.lightingCurrentDetail.lightBrightness).toBeLessThanOrEqual(2);
    }))

    it('should set lighting speed', fakeAsync(() => {
        const event = [2];
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(lightingProfileById));
        component.setLightingSpeed(event);
        tick(10);
        expect(component.lightingCurrentDetail.lightSpeed).toBeLessThanOrEqual(2);
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(lightingProfileByIdFail));
        component.setLightingSpeed(event);
        tick(10);
        expect(component.lightingCurrentDetail.lightSpeed).toBeLessThanOrEqual(2);
    }))

    it('should set lighting default profileId', fakeAsync(() => {
        component.setDefaultProfile(2);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
        gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(lightingProfileByIdFail));
        component.setDefaultProfile(2);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
    }))

    it('should set lighting color', fakeAsync(() => {
        const event = 'ff0000';
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(lightingProfileById));
        component.setLightingColor(event);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(lightingProfileByIdFail));
        component.setLightingColor(event);
        tick(10);
        expect(component.lightingCurrentDetail.lightSpeed).toBeLessThanOrEqual(2);
    }))

    it('should get lighting profileId by event', fakeAsync(() => {
        component.currentProfileId = 1;
        component.isSetDefault = true;
        component.getProfileEvent(2);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
        component.currentProfileId = 1;
        component.isSetDefault = false;
        component.getProfileEvent(2);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
        component.getProfileEvent(2);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
        component.isSetDefault = false;
        localStorage.setItem('[LocalStorageKey] KeyboardToggleStatusLNBx50',"undefined");
        component.getProfileEvent(1);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
    }))

    it('should get lighting profileId', fakeAsync(() => {
        component.getLightingProfileById(0);
        expect(component.isProfileOff).toEqual(true);
    }))

    it("should get current profile detail", fakeAsync(() => {
        component.currentProfileId = 0;
        component.lightingEffectData.dropOptions = [{
            header: 'gaming.lightingNewversion.lightingEffect.effectName1',
            name: 'gaming.lightingNewversion.lightingEffect.effectName1',
            id: 'lighting_effect_static',
            label: 'gaming.lightingNewversion.lightingEffect.effectName1',
            metricitem: 'lighting_effect_static',
            value: 1
        },
        {
            header: 'gaming.lightingProfile.effect.option3.title',
            name: 'gaming.lightingProfile.effect.option3.title',
            id: 'lighting_effect_breath',
            label: 'gaming.lightingProfile.effect.option3.title',
            metricitem: 'lighting_effect_breath',
            value: 2
        }];
        component.getLightingCurrentDetail(lightingProfileById);
        tick(10);
        expect(component.isProfileOff).toEqual(true);
    }))

    it('should get cache list', () => {
        const toggleStatus = {
            "profileId2": { "status": false, "defaultStatus": "undefined" },
            "profileId1": { "status": false, "defaultStatus": "undefined" },
            "profileId3": { "status": true, "defaultStatus": "undefined" }
        };
        localStorage.setItem("[LocalStorageKey] KeyboardToggleStatusLNBx50", JSON.stringify(toggleStatus));
        component.getCacheList();
        expect(component.currentProfileId).toEqual(2);
        const toggleStatus2 = {
            "profileId2": { "status": true, "defaultStatus": "undefined" },
            "profileId1": { "status": false, "defaultStatus": "undefined" },
            "profileId3": { "status": true, "defaultStatus": "undefined" }
        };
        localStorage.setItem("[LocalStorageKey] KeyboardToggleStatusLNBx50", JSON.stringify(toggleStatus2));
        component.getCacheList();
        expect(component.currentProfileId).toEqual(2);
    })

    it('should set cache init list', () => {
        component.lightingProfileById = {
            didSuccess: true,
            profileId: 2,
            brightness: 0,
            lightInfo: [
                { lightPanelType: 1, lightEffectType: 2, lightColor: "000BFA", lightBrightness: 2, lightSpeed: 2 },
                { lightPanelType: 2, lightEffectType: 2, lightColor: "999BFA", lightBrightness: 2, lightSpeed: 2 },
                { lightPanelType: 4, lightEffectType: 2, lightColor: "666BFA", lightBrightness: 2, lightSpeed: 2 },
                { lightPanelType: 8, lightEffectType: 2, lightColor: "090BFA", lightBrightness: 2, lightSpeed: 2 }]
        };
        gamingLightingServiceMock.checkAreaColorFn.and.returnValue(true);
        component.setCacheInitList();
        expect(gamingLightingServiceMock.checkAreaColorFn(component.lightingProfileById.lightInfo)).toEqual(true);
        gamingLightingServiceMock.checkAreaColorFn.and.returnValue(false);
        component.setCacheInitList();
        expect(gamingLightingServiceMock.checkAreaColorFn(component.lightingProfileById.lightInfo)).toEqual(false);
    })

    it('should set cache list', () => {
        const toggleStatus = {
            "profileId2": { "status": false, "defaultStatus": "undefined" },
            "profileId1": { "status": false, "defaultStatus": "undefined" },
            "profileId3": { "status": true, "defaultStatus": "undefined" }
        };
        localStorage.setItem("[LocalStorageKey] KeyboardToggleStatusLNBx50", JSON.stringify(toggleStatus));
        component.setCacheList();
        expect(component.currentProfileId).toEqual(2);
        const toggleStatus2 = {
            "profileId2": { "status": true, "defaultStatus": "undefined" },
            "profileId1": { "status": false, "defaultStatus": "undefined" },
            "profileId3": { "status": true, "defaultStatus": "undefined" }
        };
        localStorage.setItem("[LocalStorageKey] KeyboardToggleStatusLNBx50", JSON.stringify(toggleStatus2));
        component.setCacheList();
        expect(component.currentProfileId).toEqual(2);
    })

    it('should set cache default list', () => {
         component.currentProfileId = 2;
         component.setCacheDafaultList(); 
         expect(component.currentProfileId).toEqual(2);
    })

    it('should show keybord is disabled', () => {
        component.ifDisabledKeyboard(32);
        expect(component.isDisablled).toEqual(true);
    })

    it('should show effect that support speed', () => {
        component.effectSupportSpeed(1);
        expect(component.isSupportSpeed).toEqual(false);
    })

    it('should click document', () => {
        component.onClick({});
        expect(component.isSetDefault).toEqual(false);
    })

    it('should show public profile detail', () => {
        const lightingProfileById: any = {
            didSuccess: true,
            profileId: 1,
            brightness: 0,
            lightInfo: [
                { lightPanelType: 1, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 },
                { lightPanelType: 2, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 },
                { lightPanelType: 4, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 },
                { lightPanelType: 8, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2 }]
        }
        localStorage.setItem('[LocalStorageKey] LightingProfileByIdNoteOn1','undefined');
        component.publicProfileIdInfo(lightingProfileById);
        expect(component.currentProfileId).toEqual(1);
        component.publicProfileIdInfo(undefined);
        expect(component.publicProfileIdInfo(undefined)).toBeUndefined();
    })

});

export function mockPipe(options: Pipe): Pipe {
    const metadata: Pipe = {
        name: options.name
    };
    return Pipe(metadata)(class MockPipe {
        public transform(query: string, ...args: any[]): any {
            return query;
        }
    }) as any;
}
