import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { ModalSmartPerformanceSubscribeComponent } from "./modal-smart-performance-subscribe.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "src/app/services/common/common.service";
import { SupportService } from "src/app/services/support/support.service";
import { LoggerService } from "src/app/services/logger/logger.service";
import { RouterTestingModule } from '@angular/router/testing';
import { DevService } from 'src/app/services/dev/dev.service';
import { PaymentPage } from 'src/app/enums/smart-performance.enum';
import { SanitizePipe } from 'src/app/pipe/sanitize.pipe';
import { By } from '@angular/platform-browser';

describe("ModalSmartPerformanceSubscribeComponent", () => {
	let component: ModalSmartPerformanceSubscribeComponent;
    let fixture: ComponentFixture<ModalSmartPerformanceSubscribeComponent>;
    let commonService: CommonService;
    let activaModal: NgbActiveModal;
    let supportService: SupportService;
    let logger: LoggerService

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [ModalSmartPerformanceSubscribeComponent, SanitizePipe],
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [
				NgbActiveModal,
				CommonService,
				SupportService,
                LoggerService,
                DevService
			],
		});
		fixture = TestBed.createComponent(
			ModalSmartPerformanceSubscribeComponent
		);
		component = fixture.componentInstance;
	}));

	it("should create Modal SmartPerformance Subscribe Component", () => {
        const machineInfo = {
            countryCode: 'en',
            serialnumber: 'PC0ZEPQ6',
            mt: ''
        }
        supportService = TestBed.get(SupportService);
        spyOn(supportService, 'getMachineInfo').and.returnValue(Promise.resolve(machineInfo))
		fixture.detectChanges();
		expect(component).toBeTruthy();
    });
    
    it('should close modal popup', () => {
        activaModal = TestBed.get(NgbActiveModal);
        const spy = spyOn(activaModal, 'close');
        component.closeModal();
        fixture.detectChanges()
        expect(spy).toHaveBeenCalledWith('close');
    });

    it('should return country code - en_US', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('en');
        expect(res).toEqual('en_US')
    });

    it('should return country code - zh_CN', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('zh-hans');
        expect(res).toEqual('zh_CN')
    });

    it('should return country code - zh_HANT', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('zh-hant');
        expect(res).toEqual('zh_HANT')
    });

    it('should return country code - da_DK', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('da');
        expect(res).toEqual('da_DK')
    });

    it('should return country code - de_DE', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('de');
        expect(res).toEqual('de_DE')
    });

    it('should return country code - fr_FR', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('fr');
        expect(res).toEqual('fr_FR')
    });

    it('should return country code - it_IT', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('it');
        expect(res).toEqual('it_IT')
    });

    it('should return country code - ja_JP', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('ja');
        expect(res).toEqual('ja_JP')
    });

    it('should return country code - ko_KR', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('ko');
        expect(res).toEqual('ko_KR')
    });

    it('should return country code - no_NO', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('nb');
        expect(res).toEqual('no_NO')
    });

    it('should return country code - nl_NL', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('nl');
        expect(res).toEqual('nl_NL')
    });

    it('should return country code - pt_BR', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('pt-br');
        expect(res).toEqual('pt_BR')
    });

    it('should return country code - fi_FI', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('fi');
        expect(res).toEqual('fi_FI')
    });

    it('should return country code - es_ES', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('es');
        expect(res).toEqual('es_ES')
    });

    it('should return country code - sv_SE', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('sv');
        expect(res).toEqual('sv_SE')
    });

    it('should return country code - ru_RU', () => {
        const res = component.getSPSubscriptionSupportedLanguageFromCountry('ru');
        expect(res).toEqual('ru_RU')
    });
});
