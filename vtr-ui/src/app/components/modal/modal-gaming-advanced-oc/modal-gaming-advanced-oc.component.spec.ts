import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ModalGamingAdvancedOCComponent } from './modal-gaming-advanced-oc.component';
import { GamingAdvancedOCService } from 'src/app/services/gaming/gaming-advanced-oc/gaming-advanced-oc.service';
import { ModalGamingPromptComponent } from './../../modal/modal-gaming-prompt/modal-gaming-prompt.component';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { Component, NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
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
	};
}
const advancedOCService = jasmine.createSpyObj('GamingAdvancedOCService', [
	'isShellAvailable',
	'getAdvancedOCInfo',
	'setAdvancedOCInfo',
	'getAdvancedOCInfoCache',
	'setAdvancedOCInfoCache',
]);

const metricService = jasmine.createSpyObj('MetricService', ['sendMetrics']);
const timerService = jasmine.createSpyObj('TimerService', ['start', 'stop']);

const gamingAllCapabilitiesService = jasmine.createSpyObj('GamingAllCapabilitiesService', [
	'getCapabilityFromCache',
]);

const advancedOCInfo: any = {
	cpuParameterList: [
		{
			tuneId: 2,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 116,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 117,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 118,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 119,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 120,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 121,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 122,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 123,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 77,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 79,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 34,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 102,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 106,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 114,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
		{
			tuneId: 76,
			OCValue: '41',
			defaultValue: '40',
			minValue: '28',
			maxValue: '80',
			stepValue: '1',
		},
	],
	gpuParameterList: [
		{
			tuneId: 0,
			defaultValue: '100',
			OCValue: '100',
			minValue: '200',
			maxValue: '300',
			stepValue: '1',
		},
		{
			tuneId: 1,
			defaultValue: '100',
			OCValue: '100',
			minValue: '200',
			maxValue: '300',
			stepValue: '1',
		},
	],
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

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ModalGamingAdvancedOCComponent, ModalGamingPromptStubComponent],
			imports: [TranslationModule, HttpClientModule],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				HttpClient,
				TranslateStore,
				NgbActiveModal,
				{ provide: GamingAllCapabilitiesService, useValue: gamingAllCapabilitiesService },
				{ provide: GamingAdvancedOCService, useValue: advancedOCService },
				{ provide: MetricService, useValue: metricService },
				{ provide: TimerService, useValue: timerService },
			],
		}).compileComponents();

		activeModalService = TestBed.inject(NgbActiveModal);
		modalService = TestBed.inject(NgbModal);
		fixture = TestBed.createComponent(ModalGamingAdvancedOCComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should show quote after component initialized', async () => {
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
		}));

		it('getAdvancedOCInfo & advancedInfoCache is false', fakeAsync(() => {
			component.loading = true;
			advancedOCService.getAdvancedOCInfoCache.and.returnValue(false);
			advancedOCService.getAdvancedOCInfo.and.returnValue(Promise.resolve(advancedOCInfo));
			component.getAdvancedOCInfo();
			tick(20);
			expect(component.loading).toBe(false);
			expect(component.advancedOCInfo).toBeTruthy();
		}));

		it('getAdvancedOCInfo & response is false', fakeAsync(() => {
			const advancedOCInfo2: any = {
				cpuParameterList: [],
				gpuParameterList: [],
			};
			component.loading = true;
			advancedOCService.getAdvancedOCInfoCache.and.returnValue(
				Promise.resolve(advancedOCInfo)
			);
			advancedOCService.getAdvancedOCInfo.and.returnValue(Promise.resolve(advancedOCInfo2));
			component.getAdvancedOCInfo();
			tick();
			expect(component.loading).toBe(false);
		}));
	});

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
	});

	describe('check setAdvancedOCInfo : ', () => {
		it('setAdvancedOCInfo & catch error', () => {
			try {
				advancedOCService.setAdvancedOCInfo.and.throwError('setAdvancedOCInfo error');
				component.setAdvancedOCInfo(advancedOCInfo);
			} catch (err) {
				expect(err).toMatch('setAdvancedOCInfo ' + 'setAdvancedOCInfo error');
			}
		});

		it('setAdvancedOCInfo response : true ', waitForAsync(() => {
			advancedOCService.setAdvancedOCInfo.and.returnValue(Promise.resolve(true));
			component.setAdvancedOCInfo(advancedOCInfo);
			expect(advancedOCService.setAdvancedOCInfoCache).toHaveBeenCalled();
		}));

		it('setAdvancedOCInfo response : false', waitForAsync(() => {
			component.advancedOCInfo = advancedOCInfo;
			advancedOCService.getAdvancedOCInfoCache.and.returnValue(advancedOCInfo);
			advancedOCService.setAdvancedOCInfo.and.returnValue(Promise.resolve(false));
			component.setAdvancedOCInfo(advancedOCInfo);
			expect(component.advancedOCInfo).toEqual(advancedOCInfo);
		}));

		it('setAdvancedOCInfo response : false & getAdvancedOCInfoCache is false', waitForAsync(() => {
			component.advancedOCInfo = advancedOCInfo;
			advancedOCService.getAdvancedOCInfoCache.and.returnValue(false);
			advancedOCService.setAdvancedOCInfo.and.returnValue(Promise.resolve(false));
			component.setAdvancedOCInfo(advancedOCInfo);
			expect(component.advancedOCInfo).toEqual(advancedOCInfo);
		}));
	});

	describe('check open save modal : ', () => {
		it('should open save modal', () => {
			const modalRef = new ModalGamingPromptStubComponent();
			component.advancedOCInfo = advancedOCInfo;
			spyOn(modalService, 'open').and.returnValue(modalRef);
			expect(modalService.open).toHaveBeenCalledTimes(0);
			modalRef.componentInstance.emitService = of(1);
			component.openSaveChangeModal();
			expect(modalService.open).toHaveBeenCalledTimes(1);
			modalRef.componentInstance.emitService = of(2);
			component.openSaveChangeModal();
			expect(modalService.open).toHaveBeenCalledTimes(2);
			modalRef.componentInstance.emitService = of(0);
			component.openSaveChangeModal();
			expect(modalService.open).toHaveBeenCalledTimes(3);
		});
	});

	describe('check open set to default modal : ', () => {
		it('should open set to default modal', () => {
			const modalRef = new ModalGamingPromptStubComponent();
			component.advancedOCInfo = advancedOCInfo;
			spyOn(modalService, 'open').and.returnValue(modalRef);
			expect(modalService.open).toHaveBeenCalledTimes(0);
			modalRef.componentInstance.emitService = of(1);
			component.openSetToDefaultModal();
			expect(modalService.open).toHaveBeenCalledTimes(1);
			modalRef.componentInstance.emitService = of(0);
			component.openSetToDefaultModal();
			expect(modalService.open).toHaveBeenCalledTimes(2);
		});
	});

	describe('check setRangeValue : ', () => {
		it('setRangeValue gpuParameterList', waitForAsync(() => {
			component.advancedOCInfo = advancedOCInfo;

			component.setRangeValue([30], 0, 'gpuParameterList', 0, true);
			expect(component.advancedOCInfo.gpuParameterList[0].OCValue).toBe(30);

			component.setRangeValue([45, 2], 1, 'gpuParameterList', 1, true);
			expect(component.advancedOCInfo.gpuParameterList[1].OCValue).toBe(45);

			component.setRangeValue(30, 0, 'gpuParameterList', 0, false);
			expect(component.advancedOCInfo.gpuParameterList[0].OCValue).toBe(30);

			component.setRangeValue(45, 1, 'gpuParameterList', 1, false);
			expect(component.advancedOCInfo.gpuParameterList[1].OCValue).toBe(45);
		}));

		it('setRangeValue cpuParameterList pairwiseAssociation', async () => {
			const arr1 = [2, 77, 34, 79, 102, 106];
			component.advancedOCInfo.cpuParameterList = [
				{
					tuneId: 116,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 117,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 118,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 119,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 120,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 121,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 122,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 123,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 114,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 76,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
			];

			for (let i = 0; i < component.advancedOCInfo.cpuParameterList.length; i++) {
				component.setRangeValue(
					40,
					i,
					'cpuParameterList',
					component.advancedOCInfo.cpuParameterList[i].tuneId,
					false
				);
				expect(arr1.includes(component.advancedOCInfo.cpuParameterList[i].tuneId)).toBe(
					false
				);
				expect(component.advancedOCInfo.cpuParameterList[i].OCValue).toBe(40);
			}

			component.advancedOCInfo.cpuParameterList = [
				{
					tuneId: 2,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 77,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 79,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 34,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 102,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 106,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
			];

			for (let i = 0; i < component.advancedOCInfo.cpuParameterList.length; i++) {
				component.setRangeValue(
					40,
					i,
					'cpuParameterList',
					component.advancedOCInfo.cpuParameterList[i].tuneId,
					false
				);
				expect(arr1.includes(component.advancedOCInfo.cpuParameterList[i].tuneId)).toBe(
					true
				);
				expect(component.advancedOCInfo.cpuParameterList[i].OCValue).toBe(40);
			}
		});

		it('setRangeValue cpuParameterList multipleAssociations', async () => {
			const arr2 = [29, 30, 31, 32, 42, 43, 96, 97, 107, 108];
			component.advancedOCInfo.cpuParameterList = [
				{
					tuneId: 2,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 116,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 117,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 118,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 119,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 120,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 121,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 122,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 123,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 77,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 79,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 34,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 102,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 106,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 114,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 76,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
			];
			for (let i = 0; i < component.advancedOCInfo.cpuParameterList.length; i++) {
				component.setRangeValue(
					40,
					i,
					'cpuParameterList',
					component.advancedOCInfo.cpuParameterList[i].tuneId,
					false
				);
				expect(arr2.includes(component.advancedOCInfo.cpuParameterList[i].tuneId)).toBe(
					false
				);
				expect(component.advancedOCInfo.cpuParameterList[i].OCValue).toBe(40);
			}
			for (let i = 0; i < component.advancedOCInfo.cpuParameterList.length; i++) {
				component.setRangeValue(
					[40, 1],
					i,
					'cpuParameterList',
					component.advancedOCInfo.cpuParameterList[i].tuneId,
					true
				);
				expect(arr2.includes(component.advancedOCInfo.cpuParameterList[i].tuneId)).toBe(
					false
				);
				expect(component.advancedOCInfo.cpuParameterList[i].OCValue).toBe(40);
			}

			component.advancedOCInfo.cpuParameterList = [
				{
					tuneId: 29,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 30,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 31,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 32,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 42,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 43,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 96,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 97,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 107,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 108,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
			];
			for (let i = 0; i < component.advancedOCInfo.cpuParameterList.length; i++) {
				component.setRangeValue(
					40,
					i,
					'cpuParameterList',
					component.advancedOCInfo.cpuParameterList[i].tuneId,
					false
				);
				expect(arr2.includes(component.advancedOCInfo.cpuParameterList[i].tuneId)).toBe(
					true
				);
				expect(component.advancedOCInfo.cpuParameterList[i].OCValue).toBe(40);
			}
			for (let i = 0; i < component.advancedOCInfo.cpuParameterList.length; i++) {
				component.setRangeValue(
					45,
					i,
					'cpuParameterList',
					component.advancedOCInfo.cpuParameterList[i].tuneId,
					false
				);
				expect(arr2.includes(component.advancedOCInfo.cpuParameterList[i].tuneId)).toBe(
					true
				);
				expect(component.advancedOCInfo.cpuParameterList[i].OCValue).toBe(45);
			}
			for (let i = 0; i < component.advancedOCInfo.cpuParameterList.length; i++) {
				component.setRangeValue(
					[40, 1],
					i,
					'cpuParameterList',
					component.advancedOCInfo.cpuParameterList[i].tuneId,
					true
				);
				expect(arr2.includes(component.advancedOCInfo.cpuParameterList[i].tuneId)).toBe(
					true
				);
				expect(component.advancedOCInfo.cpuParameterList[i].OCValue).toBe(40);
			}
			for (let i = 0; i < component.advancedOCInfo.cpuParameterList.length; i++) {
				component.setRangeValue(
					[45, 2],
					i,
					'cpuParameterList',
					component.advancedOCInfo.cpuParameterList[i].tuneId,
					true
				);
				expect(arr2.includes(component.advancedOCInfo.cpuParameterList[i].tuneId)).toBe(
					true
				);
				expect(component.advancedOCInfo.cpuParameterList[i].OCValue).toBe(45);
			}
		});
	});

	describe('check pairwiseAssociation : ', () => {
		it('pairwiseAssociation & (tuneId === 2 || tuneId === 77)', waitForAsync(() => {
			component.advancedOCInfo.cpuParameterList = [
				{
					tuneId: 2,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 77,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 79,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 34,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 102,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 106,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 76,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
			];
			component.pairwiseAssociation(2, 1);
			expect(component.advancedOCInfo.cpuParameterList[0].OCValue).toBe(1);
			expect(component.advancedOCInfo.cpuParameterList[1].OCValue).toBe(1);

			component.pairwiseAssociation(77, 10);
			expect(component.advancedOCInfo.cpuParameterList[0].OCValue).toBe(10);
			expect(component.advancedOCInfo.cpuParameterList[1].OCValue).toBe(10);

			component.pairwiseAssociation(76, 11);
			expect(component.advancedOCInfo.cpuParameterList[0].OCValue).not.toBe(11);
			expect(component.advancedOCInfo.cpuParameterList[1].OCValue).not.toBe(11);
		}));

		it('pairwiseAssociation & (tuneId === 34 || tuneId === 79)', waitForAsync(() => {
			component.advancedOCInfo.cpuParameterList = [
				{
					tuneId: 2,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 77,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 79,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 34,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 102,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 106,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 114,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
			];
			component.pairwiseAssociation(34, 10);
			expect(component.advancedOCInfo.cpuParameterList[2].OCValue).toBe(10);
			expect(component.advancedOCInfo.cpuParameterList[3].OCValue).toBe(10);

			component.pairwiseAssociation(79, 5);
			expect(component.advancedOCInfo.cpuParameterList[2].OCValue).toBe(5);
			expect(component.advancedOCInfo.cpuParameterList[3].OCValue).toBe(5);

			component.pairwiseAssociation(114, 0);
			expect(component.advancedOCInfo.cpuParameterList[2].OCValue).not.toBe(0);
			expect(component.advancedOCInfo.cpuParameterList[3].OCValue).not.toBe(0);
		}));

		it('pairwiseAssociation & (tuneId === 102 || tuneId === 106)', waitForAsync(() => {
			component.advancedOCInfo.cpuParameterList = [
				{
					tuneId: 2,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 77,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 79,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 34,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 102,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 106,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 117,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
			];
			component.pairwiseAssociation(102, 7);
			expect(component.advancedOCInfo.cpuParameterList[4].OCValue).toBe(7);
			expect(component.advancedOCInfo.cpuParameterList[5].OCValue).toBe(7);

			component.pairwiseAssociation(106, 16);
			expect(component.advancedOCInfo.cpuParameterList[4].OCValue).toBe(16);
			expect(component.advancedOCInfo.cpuParameterList[5].OCValue).toBe(16);

			component.pairwiseAssociation(117, 20);
			expect(component.advancedOCInfo.cpuParameterList[4].OCValue).not.toBe(20);
			expect(component.advancedOCInfo.cpuParameterList[5].OCValue).not.toBe(20);
		}));
	});

	describe('check multipleAssociations : ', () => {
		it('multipleAssociations add', waitForAsync(() => {
			const arr2 = [29, 30, 31, 32, 42, 43, 96, 97, 107, 108];
			component.advancedOCInfo.cpuParameterList = [
				{
					tuneId: 29,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 30,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 31,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 32,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 42,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 43,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 96,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 97,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 107,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 108,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
			];
			for (let i = 0; i < component.advancedOCInfo.cpuParameterList.length; i++) {
				component.multipleAssociations(
					arr2,
					component.advancedOCInfo.cpuParameterList[i].tuneId,
					45,
					2,
					2
				);
				for (let j = 0; j <= i; j++) {
					expect(component.advancedOCInfo.cpuParameterList[j].OCValue).toBe(45);
				}
			}
		}));

		it('multipleAssociations reduce', waitForAsync(() => {
			const arr2 = [29, 30, 31, 32, 42, 43, 96, 97, 107, 108];
			component.advancedOCInfo.cpuParameterList = [
				{
					tuneId: 29,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 30,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 31,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 32,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 42,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 43,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 96,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 97,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 107,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 108,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
			];
			for (let i = 0; i < component.advancedOCInfo.cpuParameterList.length; i++) {
				component.multipleAssociations(
					arr2,
					component.advancedOCInfo.cpuParameterList[i].tuneId,
					39,
					1,
					1
				);
				for (let j = i; j < component.advancedOCInfo.cpuParameterList.length; j++) {
					expect(component.advancedOCInfo.cpuParameterList[j].OCValue).toBe(39);
				}
			}
		}));
	});

	describe('check setToDefaultValue : ', () => {
		it('setToDefaultValue & length>0', () => {
			const cpuParameterList = [
				{
					tuneId: 2,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 116,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 117,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 118,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 119,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 120,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 121,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 122,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 123,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 77,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 79,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 34,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 102,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 106,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 114,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
				{
					tuneId: 76,
					OCValue: '41',
					defaultValue: '40',
					minValue: '28',
					maxValue: '80',
					stepValue: '1',
				},
			];
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
			const cpuParameterList = [];
			component.setToDefaultValue(cpuParameterList);
			expect(cpuParameterList.length).toBe(0);
		});
	});

	describe('check the automation id string  : ', () => {
		it('should replace empty space to underscore from a string', () => {
			const result = component.removeSpaces('automation Id');
			expect(result).toEqual('automation_id');
		});
	});
});
