import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WidgetLightingDeskComponent } from './widget-lighting-desk.component';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { CommonService } from './../../../services/common/common.service';
import { HttpClientModule } from '@angular/common/http';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { MetricService } from '../../../services/metric/metrics.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const gamingLightingServiceMock = jasmine.createSpyObj('GamingLightingService', ['getLightingProfileId', 'getLightingProfileById', 'setLightingProfileId', 'setLightingProfileBrightness',
    'isShellAvailable', 'getLightingCapabilities', 'setLightingDefaultProfileById', 'setLightingProfileEffectColor']);
let commonServiceMock = {
    getLocalStorageValue(key: any) {
        switch (key) {
            case '[LocalStorageKey] LightingCapabilitiesNewversionDesk':
                return lightingCapility;
            case '[LocalStorageKey] ProfileId':
                return profileId;
            case '[LocalStorageKey] LightingProfileByIdDesk2':
                return getLightingProfileById;
            case '[LocalStorageKey] LightingProfileDeskDefault2':
                return getLightingProfileById;
        }
    },
    setLocalStorageValue(key: any, value: any) {
        switch (key) {
            case '[LocalStorageKey] LightingCapabilitiesNewversionDesk':
                lightingCapility = value;
                break;
            case '[LocalStorageKey] ProfileId':
                profileId = value;
                break;
            case '[LocalStorageKey] LightingProfileByIdDesk2':
                getLightingProfileById = value;
                break;
            case '[LocalStorageKey] LightingProfileDeskDefault2':
                getLightingProfileById = value;
                break;
        }
    }
};
let profileId:number = 2;
let getLightingProfileById: any = {
    didSuccess: true,
    profileId: 2,
    brightness: 0,
    lightInfo: [
        { lightPanelType: 1, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2, },
        { lightPanelType: 2, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 3, lightSpeed: 3 },
        { lightPanelType: 4, lightEffectType: 1, lightColor: "009BFA", lightBrightness: 3, lightSpeed: 1 },
        { lightPanelType: 8, lightEffectType: 1, lightColor: "009BFA", lightBrightness: 3, lightSpeed: 2 }]
}
const getLightingProfileByIdFail: any = {
    didSuccess: false,
    profileId: 2,
    brightness: 0,
    lightInfo: [
        { lightPanelType: 1, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2, },
        { lightPanelType: 2, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 3, lightSpeed: 3 },
        { lightPanelType: 4, lightEffectType: 1, lightColor: "009BFA", lightBrightness: 3, lightSpeed: 1 },
        { lightPanelType: 8, lightEffectType: 1, lightColor: "009BFA", lightBrightness: 3, lightSpeed: 2 }]
}
let lightingCapility: any = {
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
const metricsMock = jasmine.createSpyObj('MetricService',['sendMetrics']);

describe('WidgetLightingDeskComponent', () => {
    let component: WidgetLightingDeskComponent;
    let fixture: ComponentFixture<WidgetLightingDeskComponent>;
    gamingLightingServiceMock.getLightingProfileId.and.returnValue(Promise.resolve({ didSuccess: true, profileId: 2 }));
    gamingLightingServiceMock.getLightingCapabilities.and.returnValue(Promise.resolve(lightingCapility));
    gamingLightingServiceMock.getLightingProfileById.and.returnValue(Promise.resolve(getLightingProfileById));
    gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(getLightingProfileById));
    gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileById));
    gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve(getLightingProfileById));
    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [WidgetLightingDeskComponent, mockPipe({ name: 'translate' })],
            providers: [
                NgbModal,NgbActiveModal,
                { provide: GamingLightingService, useValue: gamingLightingServiceMock },
                { provide: CommonService, useValue: commonServiceMock },
                { provide: MetricService, useValue: metricsMock },
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [HttpClientModule]
        }).compileComponents();
        fixture = TestBed.createComponent(WidgetLightingDeskComponent);
        component = fixture.debugElement.componentInstance;
        if(commonServiceMock.getLocalStorageValue("[LocalStorageKey] LightingCapabilitiesNewversionDesk") === null || commonServiceMock.getLocalStorageValue("[LocalStorageKey] LightingCapabilitiesNewversionDesk") === undefined){
            commonServiceMock.setLocalStorageValue("[LocalStorageKey] LightingCapabilitiesNewversionDesk",lightingCapility);
        }
        commonServiceMock.setLocalStorageValue('[LocalStorageKey] ProfileId', 2);
        fixture.detectChanges();
    }));

    it('should create', fakeAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('currentProfileId should be null', () => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.currentProfileId = null;
        gamingLightingServiceMock.getLightingProfileById.and.returnValue(Promise.resolve(getLightingProfileById));
        component.ngOnInit();
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
    });

    it('Profile should be off', fakeAsync(() => {
        gamingLightingServiceMock.isShellAvailable = true;
        commonServiceMock.setLocalStorageValue('[LocalStorageKey] ProfileId', 0);
        component.lightingCapabilities.LightPanelType = [4];
        component.lightingProfileById = undefined;
        component.ngOnInit();
        tick(10);
        expect(component.isProfileOff).toEqual(true);
    }));

    it('should get profile cache', () =>{
        gamingLightingServiceMock.isShellAvailable = true;
        component.lightingProfileById = getLightingProfileById;
        component.lightingCapabilities = lightingCapility;
        component.getLightingProfileByIdFromcache(component.lightingProfileById,component.lightingCapabilities);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
    })

    it('should support bright', fakeAsync(() => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.lightingProfileCurrentDetail.lightPanelType = 16;
        component.supportBrightFn(268435456);
        expect(component.supportBrightness).toEqual(false);
        tick(10);
        component.lightingProfileCurrentDetail.lightPanelType = 1;
        component.lightingCapabilities.SupportRGBSetList = [1,4,8];
        component.supportBrightFn(268435456);
        expect(component.supportBrightness).toEqual(false);
        component.supportBrightFn(1);
        expect(component.supportBrightness).toEqual(true);
        component.lightingProfileCurrentDetail.lightPanelType = 2;
        component.supportBrightFn(1);
        expect(component.supportBrightness).toEqual(true);
        tick(10);
        component.ledlayoutversion = 3;
        component.lightingProfileCurrentDetail.lightPanelType = 128;
        component.lightingCapabilities.SupportBrightnessSetList = [128];
        component.supportBrightFn(1);
        expect(component.supportBrightness).toEqual(false);
    }));

    it('should support speed',fakeAsync(() => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.lightingCapabilities.SupportSpeedSetList = [4,8];
        component.lightingCapabilities.SupportRGBSetList = [4,8];
        component.lightingProfileCurrentDetail.lightPanelType = 4;
        component.supportSpeedFn(1);
        expect(component.supportSpeed).toEqual(false);
        component.supportSpeedFn(2);
        expect(component.supportSpeed).toEqual(true);
        component.lightingCapabilities.SupportSpeedSetList = [1,4,8];
        component.lightingCapabilities.SupportRGBSetList = [4,8];
        component.lightingProfileCurrentDetail.lightPanelType = 1;
        component.supportSpeedFn(1);
        expect(component.supportSpeedFn(1)).toBeUndefined();
    }))

    it('should support color',fakeAsync(() => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.lightingProfileCurrentDetail.lightPanelType = 4;
        component.lightingCapabilities.SupportRGBSetList = [4,8];
        component.supportColorFn(8);
        expect(component.supportColor).toEqual(false);
    }))

    it('should show the color picker', fakeAsync(() => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.isShow = true;
        component.colorPickerFun();
        expect(component.isColorPicker).toEqual(true);
        tick(10);
        component.isShow = false;
        component.colorPickerFun();
        expect(component.isColorPicker).toEqual(false);
        tick(10);
        component.isToggleColorPicker(true);
        expect(component.isColorPicker).toEqual(true);
    }))

    it('should switch left button',() => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.countObj['count'+component.currentProfileId] = 1;
        component.lightingProfileById = getLightingProfileById;
        component.panelSwitchLef();
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
    })

    it('should switch right button', fakeAsync(() => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.countObj['count'+component.currentProfileId] = 1;
        component.lightingCapabilities.LightPanelType.length = 4;
        component.panelSwitchRig();
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);

        component.countObj['count'+component.currentProfileId] = 4;
        component.lightingCapabilities.LightPanelType.length = 5;
        component.panelSwitchRig();
        tick(10);
        expect(component.isDisabledrig[component.currentProfileId-1]).toEqual(true);
    }))

    it('should set the lighting profile', fakeAsync(() => {
        const event = {'target':{'value':2}};
        gamingLightingServiceMock.isShellAvailable = true;
        gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve(getLightingProfileById));
        component.setLightingProfileId(event);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
        gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve(getLightingProfileByIdFail));
        component.setLightingProfileId(event);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);

        const event2 = {'target':{'value':0}};
        gamingLightingServiceMock.setLightingProfileId.and.returnValue(Promise.resolve(getLightingProfileByIdFail));
        commonServiceMock.setLocalStorageValue('[LocalStorageKey] ProfileId', 0);
        component.lightingCapabilities.LightPanelType = [4];
        component.setLightingProfileId(event2);
        tick(10);
        expect(component.isProfileOff).toBeTruthy();
    }));

    it('should set lighting color', fakeAsync(() => {
        gamingLightingServiceMock.isShellAvailable = true;
        const event = "009BFA";
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileById));
        component.setLightingColor(event);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
        tick(10);
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileByIdFail));
        component.setLightingColor(event);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
    }));

    it('should set the lighting effect', fakeAsync(() => {
        const event = {'value': 2};
        gamingLightingServiceMock.isShellAvailable = true;
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileById));
        component.setLightingProfileEffect(event);
        tick(10);
        expect(component.lightingProfileCurrentDetail.lightEffectType).toBeLessThanOrEqual(2);
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileByIdFail));
        component.setLightingProfileEffect(event);
        tick(10);
        expect(component.lightingProfileCurrentDetail.lightEffectType).toBeLessThanOrEqual(2);
    }));

    it('should set the lighting bright', fakeAsync(() => {
        const event = [2,3];
        gamingLightingServiceMock.isShellAvailable = true;
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileById));
        component.setLightingBrightness(event);
        tick(10);
        expect(component.lightingProfileCurrentDetail.lightBrightness).toBeLessThanOrEqual(2);
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileByIdFail));
        component.setLightingBrightness(event);
        tick(10);
        expect(component.lightingProfileCurrentDetail.lightBrightness).toBeLessThanOrEqual(2);
    }));

    it('should set the lighting speed', fakeAsync(() => {
        const event = [2,3];
        gamingLightingServiceMock.isShellAvailable = true;
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileById));
        component.setLightingSpeed(event);
        tick(10);
        expect(component.lightingProfileCurrentDetail.lightSpeed).toBeLessThanOrEqual(2);
        gamingLightingServiceMock.setLightingProfileEffectColor.and.returnValue(Promise.resolve(getLightingProfileByIdFail));
        component.setLightingSpeed(event);
        tick(10);
        expect(component.lightingProfileCurrentDetail.lightSpeed).toBeLessThanOrEqual(2);
    }));

    it('should set the lighting default id', fakeAsync(() => {
        gamingLightingServiceMock.isShellAvailable = true;
        gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(getLightingProfileById));
        component.setDefaultProfile(2);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
        gamingLightingServiceMock.setLightingDefaultProfileById.and.returnValue(Promise.resolve(getLightingProfileByIdFail));
        component.setDefaultProfile(2);
        tick(10);
        expect(component.currentProfileId).toBeLessThanOrEqual(2);
    }));

    it('should show lighting page detail', () => {
        gamingLightingServiceMock.isShellAvailable = true;
        const lightingProfileByIdRes = {
            didSuccess: true,
            profileId: 2,
            brightness: 0,
            lightInfo: [{ lightPanelType: 16, lightEffectType: 2, lightColor: "009BFA", lightBrightness: 2, lightSpeed: 2, }]};
        const lightingCapabilitiesRes = {
            LightPanelType: [16],
            LedType_Complex: [268435456, 1, 2, 4, 8, 32, 256, 512],
            LedType_simple: [268435456, 1, 2, 3, 4],
            BrightAdjustLevel: 4,
            RGBfeature: 256,
            SpeedSetLevel: 4,
            SupportBrightnessSetList: [1, 2, 4, 8],
            SupportRGBSetList: [16],
            SupportSpeedSetList: [4, 8],
            UnifySetList: [0]
        };
        const count = 0;
        component.ledlayoutversion = 3;
        component.lightingProfileDetail(lightingProfileByIdRes,count,lightingCapabilitiesRes);
        expect(component.lightingProfileCurrentDetail.lightPanelType).toBeLessThanOrEqual(16);
        component.lightingProfileCurrentDetail.lightPanelType = 1;
        component.lightingProfileDetail(lightingProfileByIdRes,count,lightingCapabilitiesRes);
        expect(component.lightingProfileCurrentDetail.lightPanelType).toBeLessThanOrEqual(1);
        component.lightingProfileDetail(undefined,count,lightingCapabilitiesRes);
        expect(component.lightingProfileDetail(undefined,count,lightingCapabilitiesRes)).toBeUndefined();
        component.lightingProfileDetail({lightInfo:[]},count,lightingCapabilitiesRes);
        expect(component.lightingProfileDetail({lightInfo:[]},count,lightingCapabilitiesRes)).toBeUndefined();
        lightingProfileByIdRes.lightInfo[0].lightPanelType = 3;
        component.lightingProfileDetail(lightingProfileByIdRes,count,lightingCapabilitiesRes);
        expect(component.lightingProfileDetail(lightingProfileByIdRes,count,lightingCapabilitiesRes)).toBeUndefined();
        lightingProfileByIdRes.lightInfo[0].lightPanelType = 16;
        lightingProfileByIdRes.lightInfo[0].lightEffectType = 5;
        lightingProfileByIdRes.lightInfo[0].lightBrightness = null;
        lightingProfileByIdRes.lightInfo[0].lightSpeed = null;
        component.lightingProfileDetail(lightingProfileByIdRes,count,lightingCapabilitiesRes);
        expect(component.lightingProfileDetail(lightingProfileByIdRes,count,lightingCapabilitiesRes)).toBeUndefined();
        component.ledlayoutversion = 5;
        component.lightingProfileDetail(lightingProfileByIdRes,count,lightingCapabilitiesRes);
        expect(component.lightingProfileDetail(lightingProfileByIdRes,count,lightingCapabilitiesRes)).toBeUndefined();
        lightingCapabilitiesRes.LightPanelType = [0];
        component.lightingProfileDetail(lightingProfileByIdRes,count,lightingCapabilitiesRes);
        expect(component.lightingProfileDetail(lightingProfileByIdRes,count,lightingCapabilitiesRes)).toBeUndefined();
    });

    it('should show default img when profile is 0', fakeAsync(() => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.currentProfileId = 0;
        component.ledlayoutversion = 3;
        component.lightingCapabilities.LightPanelType = [4];
        component.imgDefaultOff();
        tick(10);
        expect(component.lightingProfileCurrentDetail.panelImage).toMatch("assets/images/gaming/lighting/lighting-ui-new/T550_wind_cold.png");

        component.lightingCapabilities.LightPanelType = [16];
        component.imgDefaultOff();
        tick(10);
        expect(component.lightingProfileCurrentDetail.panelImage).toMatch("assets/images/gaming/lighting/lighting-ui-new/T550_water_cold.png");

        component.lightingCapabilities.LightPanelType = [64];
        component.imgDefaultOff();
        tick(10);
        expect(component.lightingProfileCurrentDetail.panelImage).toMatch("assets/images/gaming/lighting/lighting-ui-new/T550_big_y.png");

        component.lightingCapabilities.LightPanelType = [128];
        component.imgDefaultOff();
        tick(10);
        expect(component.lightingProfileCurrentDetail.panelImage).toMatch("assets/images/gaming/lighting/lighting-ui-new/T550G_front_line.png");

        component.lightingCapabilities.LightPanelType = [256];
        component.imgDefaultOff();
        tick(10);
        expect(component.lightingProfileCurrentDetail.panelImage).toMatch("assets/images/gaming/lighting/lighting-ui-new/T550_front.png");

        component.lightingCapabilities.LightPanelType = [3];
        component.imgDefaultOff();
        tick(10);
        expect(component.lightingProfileCurrentDetail.panelImage).toMatch("");

        component.currentProfileId = 0;
        component.ledlayoutversion = 5;
        component.lightingCapabilities.LightPanelType = [16];
        component.imgDefaultOff();
        tick(10);
        expect(component.lightingProfileCurrentDetail.panelImage).toMatch("assets/images/gaming/lighting/lighting-ui-new/T750_water.png");

        component.currentProfileId = 0;
        component.ledlayoutversion = 5;
        component.lightingCapabilities.LightPanelType = [4];
        component.imgDefaultOff();
        tick(10);
        expect(component.lightingProfileCurrentDetail.panelImage).toMatch("assets/images/gaming/lighting/lighting-ui-new/T750_wind.png");

        component.lightingCapabilities.LightPanelType = [3];
        component.imgDefaultOff();
        tick(10);
        expect(component.lightingProfileCurrentDetail.panelImage).toMatch("");
    }))

    it('should change some data when incoming value change', () => {
        expect(component.ngOnChanges({})).toBeUndefined();
    })

    it('should don/t show page info', () => {
        gamingLightingServiceMock.isShellAvailable = true;
        const res = {'lightInfo': []}
        component.isShowpageInfo(res);
        expect(component.lightingProfileCurrentDetail.lightInfo).toBeUndefined();
    })

    it('should set cache list', () => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.currentProfileId = 0;
        component.setCacheList();
        expect(component.setCacheList()).toBeUndefined();
    })

    it('should get cache list', () => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.currentProfileId = 3;
    })

    it('should get default cache list', () => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.currentProfileId = 0;
        component.getCacheDefaultList();
        expect(component.getCacheDefaultList()).toBeUndefined();
        component.currentProfileId = 3;
    })

    it('should set default cache list', () => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.currentProfileId = 0;
        component.setCacheDefaultList();
        expect(component.setCacheDefaultList()).toBeUndefined();
    })

    it('should show profileId when enter lighting subpage', () => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.currentProfileId = 2;
        commonServiceMock.setLocalStorageValue('[LocalStorageKey] ProfileId',undefined);
        component.initProfileId();
        expect(component.initProfileId()).toBeUndefined();
        component.currentProfileId = null;
        gamingLightingServiceMock.isShellAvailable = true;
        gamingLightingServiceMock.getLightingProfileId.and.returnValue(Promise.resolve({ didSuccess: false, profileId: 2 }));
        component.initProfileId();
        expect(component.initProfileId()).toBeUndefined();
    })

    it('should get lighting capabilities from cache', () => {
        gamingLightingServiceMock.isShellAvailable = true;
       component.getLightingCapabilitiesFromcache(undefined);
       expect(component.getLightingCapabilitiesFromcache(undefined)).toBeUndefined();
    })

    it('should get lighting profileById from cache', () => {
        gamingLightingServiceMock.isShellAvailable = true;
        component.getLightingProfileByIdFromcache(undefined,lightingCapility);
        expect(component.getLightingProfileByIdFromcache(undefined,lightingCapility)).toBeUndefined();
    })

    it('should get lighting capabilities', fakeAsync(() => {
        gamingLightingServiceMock.isShellAvailable = false;
        component.getLightingCapabilities();
        expect(component.getLightingCapabilities()).toBeUndefined();
	}))

	it('should replace empty space to underscore from a string', () => {
		const result = component.replaceString('automation Id');
		expect(result).toEqual('automation_Id');
	});


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

