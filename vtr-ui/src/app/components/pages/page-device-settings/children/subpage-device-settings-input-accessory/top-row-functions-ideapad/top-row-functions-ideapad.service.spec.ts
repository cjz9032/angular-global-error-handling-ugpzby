import { async, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { TopRowFunctionsIdeapadService } from "./top-row-functions-ideapad.service";
import { VantageShellService } from "../../../../../../services/vantage-shell/vantage-shell.service";

import {
	CapabilityTemp,
	FnLockStatus,
	PrimaryKeySetting,
	TopRowFunctionsIdeapad,
	KeyType,
	GetCapabilityResponse,
    GetFnLockStatusResponse,
    GetPrimaryKeyResponse
} from "./top-row-functions-ideapad.interface";
import { of } from "rxjs";
import { StringBoolean, CommonResponse } from "src/app/data-models/common/common.interface";

describe("TopRowFunctionsIdeapadService", () => {
	let topRowFuncIdeaService: TopRowFunctionsIdeapadService;
	let shellService: VantageShellService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [VantageShellService]
		});

		topRowFuncIdeaService = TestBed.get(TopRowFunctionsIdeapadService);
		shellService = TestBed.get(VantageShellService);
	}));

	it("should call capability", () => {
		let spy = spyOn(
			topRowFuncIdeaService,
			"requestCapability"
		).and.returnValue(of([{ key: "Item1", value: "True" }]));
		topRowFuncIdeaService["capability"];
		expect(spy).toHaveBeenCalled();
    });

    it('should call requestCapability', () => {
	    spyOn<any>(topRowFuncIdeaService, 'topRowFunctionsIdeaPadFeature').and.returnValue(of([{key: 'Item1', value: 'True'}]))
        let res = topRowFuncIdeaService.requestCapability()
        expect(res).toBeTruthy()
	});

	it("should call primaryKey", () => {
		let primaryKey: PrimaryKeySetting = {
			key: "item1",
			value: KeyType.HOTKEY,
			enabled: 1,
			errorCode: 0
		};
		let spy = spyOn(
			topRowFuncIdeaService,
			"requestPrimaryKey"
		).and.returnValue(of(primaryKey));
		topRowFuncIdeaService["primaryKey"];
		expect(spy).toHaveBeenCalled();
    });
    
    it('should call requestPrimaryKey', () => {
        let primaryKey: PrimaryKeySetting = {
			key: "item1",
			value: KeyType.HOTKEY,
			enabled: 1,
			errorCode: 0
		};
	    spyOn<any>(topRowFuncIdeaService, 'topRowFunctionsIdeaPadFeature').and.returnValue(of(primaryKey))
        let res = topRowFuncIdeaService.requestPrimaryKey()
        expect(res).toBeTruthy()
	});

	it("should call fnLockStatus", () => {
		let fnkey: FnLockStatus = {
			key: "item1",
			value: "True",
			enabled: 1,
			errorCode: 0
		};
		let spy = spyOn<any>(
			topRowFuncIdeaService,
			"requestFnLockStatus"
		).and.returnValue(of(fnkey));
		topRowFuncIdeaService["fnLockStatus"];
		expect(spy).toHaveBeenCalled();
    });
    
    it('should call requestFnLockStatus', () => {
        let fnkey: FnLockStatus = {
			key: "item1",
			value: "True",
			enabled: 1,
			errorCode: 0
		};
	    spyOn<any>(topRowFuncIdeaService, 'topRowFunctionsIdeaPadFeature').and.returnValue(of(fnkey))
        let res = topRowFuncIdeaService.requestFnLockStatus()
        expect(res).toBeTruthy()
	});

	it("should call setFnLockStatus", () => {
		topRowFuncIdeaService.topRowFunctionsIdeaPadFeature = {
			getCapability() {
				let data: GetCapabilityResponse = {
					errorCode: 0,
					capabilityList: { Items: [{ key: "Item1", value: "True" }] }
				};
				return Promise.resolve(data);
            },
            getFnLockStatus() {
                let data: GetFnLockStatusResponse = {
                    settingList: {
                        setting: [{
                            key: "item1",
                            value: "True",
                            enabled: 1,
                            errorCode: 0
                        }]
                    }
                }
                return Promise.resolve(data)
            },
            setFnLockStatus(fnLockStatus: StringBoolean) {
                return Promise.resolve(null)
            },
            getPrimaryKey() {
                let data: GetPrimaryKeyResponse = {
                    settingList: {
                        setting: [{
                            key: "item1",
                            value: KeyType.HOTKEY,
                            enabled: 1,
                            errorCode: 0
                        }]
                    }
                }
                return Promise.resolve(data)
            }
        };
		topRowFuncIdeaService.setFnLockStatus("True");
		expect(topRowFuncIdeaService["fnLockStatus$"]).toEqual(null);
	});
});
