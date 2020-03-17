import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from '@angular/platform-browser';

import { ModalIntelligentCoolingModesComponent } from "./modal-intelligent-cooling-modes.component";
import { TranslationModule } from "src/app/modules/translation.module";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateStore } from "@ngx-translate/core";

describe("ModalIntelligentCoolingModesComponent", () => {
	let component: ModalIntelligentCoolingModesComponent;
	let fixture: ComponentFixture<ModalIntelligentCoolingModesComponent>;
	let activeModal: NgbActiveModal;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [ModalIntelligentCoolingModesComponent],
			imports: [TranslationModule],
			providers: [NgbActiveModal, TranslateStore]
		});
	}));

	it("should create the app", async(() => {
		fixture = TestBed.createComponent(
			ModalIntelligentCoolingModesComponent
		);
		component = fixture.componentInstance;
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it("should call closeModal", async(() => {
		fixture = TestBed.createComponent(
			ModalIntelligentCoolingModesComponent
		);
		component = fixture.componentInstance;
		activeModal = TestBed.get(NgbActiveModal);
		const spy = spyOn(activeModal, "close");
		component.closeModal();
		expect(spy).toHaveBeenCalled();
	}));

	it("should call onKeydownHandler", async(() => {
        fixture = TestBed.createComponent(
			ModalIntelligentCoolingModesComponent
		);
        component = fixture.componentInstance;
        const spy = spyOn(component, 'closeModal')
        const event = new KeyboardEvent('keydown');
        component.onKeydownHandler(event);
        expect(spy).toHaveBeenCalled()
    }));

    it("should call onKeydownEnterHandler", async(() => {
        fixture = TestBed.createComponent(
			ModalIntelligentCoolingModesComponent
		);
        component = fixture.componentInstance;
        const spy = spyOn(component, 'closeModal')
        const event = new KeyboardEvent('keydown');
        component.onKeydownEnterHandler(event);
        expect(spy).toHaveBeenCalled()
    }));

    // it('should call onFocus', async(() => {
    //     fixture = TestBed.createComponent(
	// 		ModalIntelligentCoolingModesComponent
	// 	);
    //     component = fixture.componentInstance;
    //     // const modal = fixture.debugElement.query(By.css('.Intelligent-Cooling-Modes-Modal'));
    //     // const spy = spyOn<any>(modal, 'focus');
    //     expect(component.onFocus()).toBeTruthy()
    // }));
});
