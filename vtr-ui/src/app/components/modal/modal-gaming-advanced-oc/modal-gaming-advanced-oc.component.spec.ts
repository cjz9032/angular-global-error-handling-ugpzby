import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ModalGamingAdvancedOCComponent } from './modal-gaming-advanced-oc.component';
import { GamingAdvancedOCService } from 'src/app/services/gaming/gaming-advanced-oc/gaming-advanced-oc.service';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { Component, NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { Gaming } from './../../../enums/gaming.enum';
import { of } from 'rxjs';

@Component({ selector: 'vtr-modal-gaming-prompt', template: '' })
export class ModalGamingPromptStubComponent {
    componentInstance = {
        title: undefined,
        description: undefined,
        description2: undefined,
        description3: undefined,
        comfirmButton: undefined,
        cancelButton: undefined,
        emitService: of(1),
    }
 }
const advancedOCService = jasmine.createSpyObj('GamingAdvancedOCService', [
	'isShellAvailable',
	'getAdvancedOCInfo',
	'setAdvancedOCInfo',
	'getAdvancedOCInfoCache',
	'setAdvancedOCInfoCache'
]);

const metricService = jasmine.createSpyObj('MetricService', [
	'sendMetrics',
]);
const timerService = jasmine.createSpyObj('TimerService', [
    'start',
    'stop'
]);

const gamingAllCapabilitiesService = jasmine.createSpyObj('GamingAllCapabilitiesService', [
	'getCapabilityFromCache'
]);

let advancedOCInfo:any = {
    cpuParameterList: [
        { tuneId: 2, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
        { tuneId: 116, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
        { tuneId: 117, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
        { tuneId: 118, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
        { tuneId: 119, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
        { tuneId: 120, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
        { tuneId: 121, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
        { tuneId: 122, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
        { tuneId: 123, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
        { tuneId: 77, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
        { tuneId: 79, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
        { tuneId: 34, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
        { tuneId: 102, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
        { tuneId: 106, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
        { tuneId: 114, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
        { tuneId: 76, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
    ],
    gpuParameterList: [
        { "tuneId":0,"defaultValue":"100","OCValue":"100","minValue":"200","maxValue":"300","stepValue":"1"},
        {"tuneId":1,"defaultValue":"100","OCValue":"100","minValue":"200","maxValue":"300","stepValue":"1"}
    ]
};

describe('ModalGamingAdvancedOCComponent : ', () => {
    let component: ModalGamingAdvancedOCComponent;
    let fixture: ComponentFixture<ModalGamingAdvancedOCComponent>;

    let activeModalService: any;
    let modalService: any;

    advancedOCService.isShellAvailable.and.returnValue(true);
	advancedOCService.getAdvancedOCInfo.and.returnValue(Promise.resolve(advancedOCInfo));
	advancedOCService.setAdvancedOCInfo.and.returnValue(Promise.resolve(true));
	advancedOCService.getAdvancedOCInfoCache.and.returnValue(advancedOCInfo);
    advancedOCService.setAdvancedOCInfoCache.and.returnValue(true);
    metricService.sendMetrics.and.returnValue(true);
    timerService.stop.and.returnValue(2);
    // gamingAllCapabilitiesService.getCapabilityFromCache.and.returnValue(true);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ModalGamingAdvancedOCComponent, ModalGamingPromptStubComponent],
            imports: [ TranslationModule, HttpClientModule ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                HttpClient,
                TranslateStore,
                NgbActiveModal,
                { provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesService },
                { provide: GamingAdvancedOCService, useValue: advancedOCService},
                { provide: MetricService, useValue: metricService},
                { provide: TimerService, useValue: timerService},
            ]
        })
        .compileComponents();

        activeModalService = TestBed.inject(NgbActiveModal);
        modalService = TestBed.inject(NgbModal);
        fixture = TestBed.createComponent(ModalGamingAdvancedOCComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should show quote after component initialized', async() => {
        expect(component).toBeTruthy();
    });

    describe('getAdvancedOCInfo : ', () => {

        it('getAdvancedOCInfo & advancedInfoCache is true', fakeAsync(() => {
            component.loading = true;
            advancedOCService.getAdvancedOCInfoCache.and.returnValue(advancedOCInfo);
            advancedOCService.getAdvancedOCInfo.and.returnValue(Promise.resolve(advancedOCInfo));
            component.getAdvancedOCInfo();
            expect(component.loading).toBe(false);
            expect(component.advancedOCInfo).toBeTruthy();
        }))

        it('getAdvancedOCInfo & advancedInfoCache is false', fakeAsync(() => {
            component.loading = true;
            advancedOCService.getAdvancedOCInfoCache.and.returnValue(false);
            advancedOCService.getAdvancedOCInfo.and.returnValue(Promise.resolve(advancedOCInfo));
            component.getAdvancedOCInfo();
            tick(20)
            expect(component.loading).toBe(false);
            expect(component.advancedOCInfo).toBeTruthy();
        }))

        it('getAdvancedOCInfo & response is false', fakeAsync(() => {
            let advancedOCInfo2:any = {
                cpuParameterList: [],
                gpuParameterList: []
            };
            component.loading = true;
            advancedOCService.getAdvancedOCInfoCache.and.returnValue(Promise.resolve(advancedOCInfo));
            advancedOCService.getAdvancedOCInfo.and.returnValue(Promise.resolve(advancedOCInfo2));
            component.getAdvancedOCInfo();
            tick();
            expect(component.loading).toBe(false);
        }))
    })

    describe('close modal : ', () => {
        it('should check closeModal', () => {
            spyOn(component, 'openSaveChangeModal').and.returnValue();
            spyOn(activeModalService, 'close').and.callThrough();
            expect(activeModalService.close).toHaveBeenCalledTimes(0);
            component.closeModal();
            expect(activeModalService.close).toHaveBeenCalledTimes(1);
            component.isChange = true;
            component.closeModal();
            expect(activeModalService.close).toHaveBeenCalledTimes(1);
        });
    })

    describe('check  setAdvancedOCInfo : ', () => {
        it('setAdvancedOCInfo & catch error', () => {
            try{
                advancedOCService.setAdvancedOCInfo.and.throwError('setAdvancedOCInfo error');
                component.setAdvancedOCInfo(advancedOCInfo);
            }catch(err){
                expect(err).toMatch("setAdvancedOCInfo error");
            }
        })

        it('setAdvancedOCInfo response : true ', async(() => {
            advancedOCService.setAdvancedOCInfo.and.returnValue(Promise.resolve(true));
            component.setAdvancedOCInfo(advancedOCInfo);
            expect(advancedOCService.setAdvancedOCInfoCache).toHaveBeenCalled();
        }));

        it('setAdvancedOCInfo response : false', async(() => {
            component.advancedOCInfo = advancedOCInfo;
            advancedOCService.getAdvancedOCInfoCache.and.returnValue(advancedOCInfo);
            advancedOCService.setAdvancedOCInfo.and.returnValue(Promise.resolve(false));
            component.setAdvancedOCInfo(advancedOCInfo);
            expect(component.advancedOCInfo).toEqual(advancedOCInfo);
        }));

        it('setAdvancedOCInfo response : false & getAdvancedOCInfoCache is false', async(() => {
            component.advancedOCInfo = advancedOCInfo;
            advancedOCService.getAdvancedOCInfoCache.and.returnValue(false);
            advancedOCService.setAdvancedOCInfo.and.returnValue(Promise.resolve(false));
            component.setAdvancedOCInfo(advancedOCInfo);
            expect(component.advancedOCInfo).toEqual(advancedOCInfo);
        }));
    })

    describe('check open save modal : ', () => {
        it('should open save modal', () => {
            let modalRef = new ModalGamingPromptStubComponent();
            component.advancedOCInfo = advancedOCInfo;
            spyOn(modalService, 'open').and.returnValue(modalRef);
            expect(modalService.open).toHaveBeenCalledTimes(0);
            modalRef.componentInstance.emitService = of(1)
            component.openSaveChangeModal();
            expect(modalService.open).toHaveBeenCalledTimes(1);
            modalRef.componentInstance.emitService = of(2)
            component.openSaveChangeModal();
            expect(modalService.open).toHaveBeenCalledTimes(2);
            modalRef.componentInstance.emitService = of(0)
            component.openSaveChangeModal();
            expect(modalService.open).toHaveBeenCalledTimes(3);
        });
    })

    describe('check open set to default modal : ', () => {
        it('should open set to default modal', () => {
            let modalRef = new ModalGamingPromptStubComponent();
            component.advancedOCInfo = advancedOCInfo;
            spyOn(modalService, 'open').and.returnValue(modalRef);
            expect(modalService.open).toHaveBeenCalledTimes(0);
            modalRef.componentInstance.emitService = of(1)
            component.openSetToDefaultModal();
            expect(modalService.open).toHaveBeenCalledTimes(1);
            modalRef.componentInstance.emitService = of(0)
            component.openSetToDefaultModal();
            expect(modalService.open).toHaveBeenCalledTimes(2);
        });
    })

    describe('check setRangeValue : ', () => {
        it('setRangeValue gpuParameterList', async(() => {
            component.advancedOCInfo = advancedOCInfo;

            component.setRangeValue([30],0,'gpuParameterList',0,true);
            expect(component.advancedOCInfo.gpuParameterList[0].OCValue).toBe(30);

            component.setRangeValue([45],1,'gpuParameterList',1,true);
            expect(component.advancedOCInfo.gpuParameterList[1].OCValue).toBe(45);

            component.setRangeValue(30,0,'gpuParameterList',0,false);
            expect(component.advancedOCInfo.gpuParameterList[0].OCValue).toBe(30);

            component.setRangeValue(45,1,'gpuParameterList',1,false);
            expect(component.advancedOCInfo.gpuParameterList[1].OCValue).toBe(45);
        }));


        it('setRangeValue cpuParameterList', async() => {
            const arr1 = [2, 77, 34, 79, 102, 106];
            component.advancedOCInfo = advancedOCInfo;

            component.setRangeValue(40,1,'cpuParameterList',116,false);
            expect(arr1.includes(116)).toBe(false);
            expect(component.advancedOCInfo.cpuParameterList[1].OCValue).toBe(40);

            component.setRangeValue(40,2,'cpuParameterList',117,false);
            expect(arr1.includes(117)).toBe(false);
            expect(component.advancedOCInfo.cpuParameterList[2].OCValue).toBe(40);

            component.setRangeValue(40,3,'cpuParameterList',118,false);
            expect(arr1.includes(118)).toBe(false);
            expect(component.advancedOCInfo.cpuParameterList[3].OCValue).toBe(40);

            component.setRangeValue(40,4,'cpuParameterList',119,false);
            expect(arr1.includes(119)).toBe(false);
            expect(component.advancedOCInfo.cpuParameterList[4].OCValue).toBe(40);

            component.setRangeValue(40,5,'cpuParameterList',120,false);
            expect(arr1.includes(120)).toBe(false);
            expect(component.advancedOCInfo.cpuParameterList[5].OCValue).toBe(40);

            component.setRangeValue(40,6,'cpuParameterList',121,false);
            expect(arr1.includes(121)).toBe(false);
            expect(component.advancedOCInfo.cpuParameterList[6].OCValue).toBe(40);

            component.setRangeValue(40,7,'cpuParameterList',122,false);
            expect(arr1.includes(122)).toBe(false);
            expect(component.advancedOCInfo.cpuParameterList[7].OCValue).toBe(40);

            component.setRangeValue(40,8,'cpuParameterList',123,false);
            expect(arr1.includes(123)).toBe(false);
            expect(component.advancedOCInfo.cpuParameterList[8].OCValue).toBe(40);

            component.setRangeValue([40],14,'cpuParameterList',114,true);
            expect(arr1.includes(114)).toBe(false);
            expect(component.advancedOCInfo.cpuParameterList[14].OCValue).toBe(40);

            component.setRangeValue([40],15,'cpuParameterList',76,true);
            expect(arr1.includes(123)).toBe(false);
            expect(component.advancedOCInfo.cpuParameterList[15].OCValue).toBe(40);

            component.setRangeValue(1,0,'cpuParameterList',2,false);
            expect(arr1.includes(2)).toBe(true);

            component.setRangeValue([40],1,'cpuParameterList',116,true);
            expect(arr1.includes(116)).toBe(false);
            expect(component.advancedOCInfo.cpuParameterList[1].OCValue).toBe(40);

            component.setRangeValue([1],0,'cpuParameterList',2,true);
            expect(arr1.includes(2)).toBe(true);

            component.setRangeValue([1],9,'cpuParameterList',77,true);
            expect(arr1.includes(77)).toBe(true);

            component.setRangeValue([1],11,'cpuParameterList',34,true);
            expect(arr1.includes(34)).toBe(true);

            component.setRangeValue([1],10,'cpuParameterList',79,true);
            expect(arr1.includes(79)).toBe(true);

            component.setRangeValue([1],12,'cpuParameterList',102,true);
            expect(arr1.includes(102)).toBe(true);

            component.setRangeValue([1],13,'cpuParameterList',106,true);
            expect(arr1.includes(106)).toBe(true);
        });
    })

    describe('check pairwiseAssociation : ', () => {
        it('pairwiseAssociation & (tuneId === 2 || tuneId === 77)', async(() => {
            component.advancedOCInfo = advancedOCInfo;
            component.pairwiseAssociation(2, 1);
            expect(component.advancedOCInfo.cpuParameterList[0].OCValue).toBe(1);
            expect(component.advancedOCInfo.cpuParameterList[9].OCValue).toBe(1);

            component.advancedOCInfo = advancedOCInfo;
            component.pairwiseAssociation(77, 10);
            expect(component.advancedOCInfo.cpuParameterList[0].OCValue).toBe(10);
            expect(component.advancedOCInfo.cpuParameterList[9].OCValue).toBe(10);

            component.advancedOCInfo = advancedOCInfo;
            component.pairwiseAssociation(76, 11);
            expect(component.advancedOCInfo.cpuParameterList[0].OCValue).not.toBe(11);
            expect(component.advancedOCInfo.cpuParameterList[9].OCValue).not.toBe(11);
        }));

        it('pairwiseAssociation & (tuneId === 34 || tuneId === 79)', async(() => {
            component.advancedOCInfo = advancedOCInfo;
            component.pairwiseAssociation(34, 10);
            expect(component.advancedOCInfo.cpuParameterList[11].OCValue).toBe(10);
            expect(component.advancedOCInfo.cpuParameterList[10].OCValue).toBe(10);

            component.advancedOCInfo = advancedOCInfo;
            component.pairwiseAssociation(79, 5);
            expect(component.advancedOCInfo.cpuParameterList[11].OCValue).toBe(5);
            expect(component.advancedOCInfo.cpuParameterList[10].OCValue).toBe(5);

            component.advancedOCInfo = advancedOCInfo;
            component.pairwiseAssociation(116, 0);
            expect(component.advancedOCInfo.cpuParameterList[11].OCValue).not.toBe(0);
            expect(component.advancedOCInfo.cpuParameterList[10].OCValue).not.toBe(0);
        }));

        it('pairwiseAssociation & (tuneId === 102 || tuneId === 106)', async(() => {
            component.advancedOCInfo = advancedOCInfo;
            component.pairwiseAssociation(102, 7);
            expect(component.advancedOCInfo.cpuParameterList[12].OCValue).toBe(7);
            expect(component.advancedOCInfo.cpuParameterList[13].OCValue).toBe(7);

            component.advancedOCInfo = advancedOCInfo;
            component.pairwiseAssociation(106, 16);
            expect(component.advancedOCInfo.cpuParameterList[12].OCValue).toBe(16);
            expect(component.advancedOCInfo.cpuParameterList[13].OCValue).toBe(16);

            component.advancedOCInfo = advancedOCInfo;
            component.pairwiseAssociation(117, 20);
            expect(component.advancedOCInfo.cpuParameterList[12].OCValue).not.toBe(20);
            expect(component.advancedOCInfo.cpuParameterList[13].OCValue).not.toBe(20);
        }));
    })

    describe('check  setToDefaultValue : ', () => {
        it('setToDefaultValue & length>0', () => {
            let cpuParameterList = [
                { tuneId: 2, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
                { tuneId: 116, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
                { tuneId: 117, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
                { tuneId: 118, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
                { tuneId: 119, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
                { tuneId: 120, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
                { tuneId: 121, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
                { tuneId: 122, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
                { tuneId: 123, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
                { tuneId: 77, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
                { tuneId: 79, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
                { tuneId: 34, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
                { tuneId: 102, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
                { tuneId: 106, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1' },
                { tuneId: 114, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
                { tuneId: 76, OCValue: '41', defaultValue:'40', minValue: '28', maxValue: '80', stepValue: '1'},
            ]
            component.advancedOCInfo.cpuParameterList = cpuParameterList;
            component.setToDefaultValue(component.advancedOCInfo.cpuParameterList);

            expect(component.advancedOCInfo.cpuParameterList[0].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[1].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[2].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[3].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[4].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[5].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[6].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[7].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[8].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[9].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[10].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[11].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[12].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[13].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[14].OCValue).toBe(40);
            expect(component.advancedOCInfo.cpuParameterList[15].OCValue).toBe(40);
        });

        it('setToDefaultValue & length=0', () => {
            let cpuParameterList = [];
            component.setToDefaultValue(cpuParameterList);
            expect(cpuParameterList.length).toBe(0);
        });
    })

});

