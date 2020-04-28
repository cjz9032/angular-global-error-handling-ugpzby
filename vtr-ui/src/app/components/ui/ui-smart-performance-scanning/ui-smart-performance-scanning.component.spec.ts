import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UiSmartPerformanceScanningComponent } from "./ui-smart-performance-scanning.component";
import { VantageShellService } from "src/app/services/vantage-shell/vantage-shell.service";
import { SmartPerformanceService } from "src/app/services/smart-performance/smart-performance.service";
import { LoggerService } from "src/app/services/logger/logger.service";
import { SPCategory, SPSubCategory } from 'src/app/enums/smart-performance.enum';

import { TranslationModule } from "src/app/modules/translation.module";
import { TranslateStore } from "@ngx-translate/core";

import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";

const responseData = {
    type: '1',
    percentage: '0',
    errorcode: '0',
    errordesc: null,
    payload: {
        status: { category: '100', subcategory: '101', final: 'Running' },
        result: { tune: '0', boost: '0', secure: '0' },
        rating: '0',
        percentage: '100'
    }
}

xdescribe("UiSmartPerformanceScanningComponent", () => {
	let component: UiSmartPerformanceScanningComponent;
	let fixture: ComponentFixture<UiSmartPerformanceScanningComponent>;
	let shellService: VantageShellService;
	let smartPerformanceService: SmartPerformanceService;
	let logger: LoggerService;
	let modalService: NgbModal;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [UiSmartPerformanceScanningComponent],
			providers: [
				TranslateStore,
				SmartPerformanceService,
				VantageShellService,
				LoggerService,
				NgbModal
			],
			imports: [TranslationModule, NgbModule]
		});
	}));

	it("should create", () => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
		component = fixture.componentInstance;
		shellService = TestBed.get(VantageShellService);
		spyOn(component, "GetCurrentScanninRollingTexts");
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it("should call updateScanResponse -category - 100 & subcategory -101", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '100';
        event.payload.status.subcategory = '101';
        component.updateScanResponse(event);
        expect(component.activegroup).toEqual('Tune up performance')
    }));

    it("should call updateScanResponse -category - 100 & subcategory -102", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '100';
        event.payload.status.subcategory = '102';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));

    it("should call updateScanResponse -category - 100 & subcategory -103", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '100';
        event.payload.status.subcategory = '103';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));

    it("should call updateScanResponse -category - 100 & subcategory -104", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '100';
        event.payload.status.subcategory = '104';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));

    it("should call updateScanResponse -category - 100 & subcategory -105", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '100';
        event.payload.status.subcategory = '105';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));
    
    it("should call updateScanResponse -category - 200 & subcategory - 201", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '200';
        event.payload.status.subcategory = '201';
        component.updateScanResponse(event);
        expect(component.activegroup).toEqual('Internet performance')
    }));

    it("should call updateScanResponse -category - 200 & subcategory - 202", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '200';
        event.payload.status.subcategory = '202';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));

    it("should call updateScanResponse -category - 200 & subcategory - 203", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '200';
        event.payload.status.subcategory = '203';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));

    it("should call updateScanResponse -category - 200 & subcategory - 204", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '200';
        event.payload.status.subcategory = '204';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));

    it("should call updateScanResponse -category - 200 & subcategory - 205", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '200';
        event.payload.status.subcategory = '205';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));
    
    it("should call updateScanResponse -category - 300 -& subcategory - 301", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '300';
        event.payload.status.subcategory = '301';
        component.updateScanResponse(event);
        expect(component.activegroup).toEqual('Malware & Security')
    }));
    
    it("should call updateScanResponse -category - 300 & subcategory - 302", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '300';
        event.payload.status.subcategory = '302';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));

    it("should call updateScanResponse -category - 300 & subcategory - 303", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '300';
        event.payload.status.subcategory = '303';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));

    it("should call updateScanResponse -category - 300 & subcategory - 304", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '300';
        event.payload.status.subcategory = '304';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));

    it("should call updateScanResponse -category - 300 & subcategory - 305", async(() => {
		fixture = TestBed.createComponent(UiSmartPerformanceScanningComponent);
        component = fixture.componentInstance;
        component.spSubCategoryenum = SPSubCategory;
        component.spCategoryenum = SPCategory;
        const spy = spyOn(component, "GetCurrentScanninRollingTexts");
        spyOn(component, 'toggle')
        const event = {...responseData};
        event.payload.status.category = '300';
        event.payload.status.subcategory = '305';
        component.updateScanResponse(event);
        expect(spy).toHaveBeenCalled()
    }));
});
