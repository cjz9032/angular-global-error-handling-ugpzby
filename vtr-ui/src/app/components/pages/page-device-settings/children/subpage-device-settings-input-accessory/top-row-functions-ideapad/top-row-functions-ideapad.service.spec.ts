// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { TestBed, waitForAsync } from '@angular/core/testing';
// import { of } from 'rxjs';
// import { StringBoolean } from 'src/app/data-models/common/common.interface';
// import { VantageShellService } from '../../../../../../services/vantage-shell/vantage-shell.service';
// import {
// 	FnLockStatus,
// 	GetCapabilityResponse,
// 	GetFnLockStatusResponse,
// 	GetPrimaryKeyResponse,
// 	KeyType,
// 	PrimaryKeySetting,
// } from './top-row-functions-ideapad.interface';
// import { TopRowFunctionsIdeapadService } from './top-row-functions-ideapad.service';
//
// describe('TopRowFunctionsIdeapadService', () => {
// 	let topRowFuncIdeaService: TopRowFunctionsIdeapadService;
// 	let shellService: VantageShellService;
//
// 	beforeEach(waitForAsync(() => {
// 		TestBed.configureTestingModule({
// 			imports: [HttpClientTestingModule],
// 			providers: [VantageShellService],
// 		});
//
// 		topRowFuncIdeaService = TestBed.inject(TopRowFunctionsIdeapadService);
// 		shellService = TestBed.inject(VantageShellService);
// 	}));
//
// 	it('should call capability', () => {
// 		const spy = spyOn(topRowFuncIdeaService, 'requestCapability').and.returnValue(
// 			of([{ key: 'Item1', value: 'True' }])
// 		);
// 		topRowFuncIdeaService['capability'];
// 		expect(spy).toHaveBeenCalled();
// 	});
//
// 	it('should call requestCapability', () => {
// 		spyOn<any>(topRowFuncIdeaService, 'topRowFunctionsIdeaPadFeature').and.returnValue(
// 			of([{ key: 'Item1', value: 'True' }])
// 		);
// 		const res = topRowFuncIdeaService.requestCapability();
// 		expect(res).toBeTruthy();
// 	});
//
// 	it('should call primaryKey', () => {
// 		const primaryKey: PrimaryKeySetting = {
// 			key: 'item1',
// 			value: KeyType.HOTKEY,
// 			enabled: 1,
// 			errorCode: 0,
// 		};
// 		const spy = spyOn(topRowFuncIdeaService, 'requestPrimaryKey').and.returnValue(
// 			of(primaryKey)
// 		);
// 		topRowFuncIdeaService['primaryKey'];
// 		expect(spy).toHaveBeenCalled();
// 	});
//
// 	it('should call requestPrimaryKey', () => {
// 		const primaryKey: PrimaryKeySetting = {
// 			key: 'item1',
// 			value: KeyType.HOTKEY,
// 			enabled: 1,
// 			errorCode: 0,
// 		};
// 		spyOn<any>(topRowFuncIdeaService, 'topRowFunctionsIdeaPadFeature').and.returnValue(
// 			of(primaryKey)
// 		);
// 		const res = topRowFuncIdeaService.requestPrimaryKey();
// 		expect(res).toBeTruthy();
// 	});
//
// 	it('should call fnLockStatus', () => {
// 		const fnkey: FnLockStatus = {
// 			key: 'item1',
// 			value: 'True',
// 			enabled: 1,
// 			errorCode: 0,
// 		};
// 		const spy = spyOn<any>(topRowFuncIdeaService, 'requestFnLockStatus').and.returnValue(
// 			of(fnkey)
// 		);
// 		topRowFuncIdeaService['fnLockStatus'];
// 		expect(spy).toHaveBeenCalled();
// 	});
//
// 	it('should call requestFnLockStatus', () => {
// 		const fnkey: FnLockStatus = {
// 			key: 'item1',
// 			value: 'True',
// 			enabled: 1,
// 			errorCode: 0,
// 		};
// 		spyOn<any>(topRowFuncIdeaService, 'topRowFunctionsIdeaPadFeature').and.returnValue(
// 			of(fnkey)
// 		);
// 		const res = topRowFuncIdeaService.requestFnLockStatus();
// 		expect(res).toBeTruthy();
// 	});
//
// 	it('should call setFnLockStatus', () => {
// 		topRowFuncIdeaService.topRowFunctionsIdeaPadFeature = {
// 			getCapability() {
// 				const data: GetCapabilityResponse = {
// 					errorCode: 0,
// 					capabilityList: { Items: [{ key: 'Item1', value: 'True' }] },
// 				};
// 				return Promise.resolve(data);
// 			},
// 			getFnLockStatus() {
// 				const data: GetFnLockStatusResponse = {
// 					settingList: {
// 						setting: [
// 							{
// 								key: 'item1',
// 								value: 'True',
// 								enabled: 1,
// 								errorCode: 0,
// 							},
// 						],
// 					},
// 				};
// 				return Promise.resolve(data);
// 			},
// 			setFnLockStatus(fnLockStatus: StringBoolean) {
// 				return Promise.resolve(null);
// 			},
// 			getPrimaryKey() {
// 				const data: GetPrimaryKeyResponse = {
// 					settingList: {
// 						setting: [
// 							{
// 								key: 'item1',
// 								value: KeyType.HOTKEY,
// 								enabled: 1,
// 								errorCode: 0,
// 							},
// 						],
// 					},
// 				};
// 				return Promise.resolve(data);
// 			},
// 		};
// 		topRowFuncIdeaService.setFnLockStatus('True');
// 		expect(topRowFuncIdeaService['fnLockStatus$']).toEqual(null);
// 	});
// });
