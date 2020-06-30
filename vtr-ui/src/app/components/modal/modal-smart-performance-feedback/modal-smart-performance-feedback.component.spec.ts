import { async, ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";

import { ModalSmartPerformanceFeedbackComponent } from "./modal-smart-performance-feedback.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateModule } from "@ngx-translate/core";
import { CommonService } from "src/app/services/common/common.service";
import { VantageShellService } from "src/app/services/vantage-shell/vantage-shell.service";
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

describe("ModalSmartPerformanceFeedbackComponent", () => {
	let component: ModalSmartPerformanceFeedbackComponent;
	let fixture: ComponentFixture<ModalSmartPerformanceFeedbackComponent>;
	let activeModal: NgbActiveModal;
	let commonService: CommonService;
	let shellService: VantageShellService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalSmartPerformanceFeedbackComponent],
			imports: [HttpClientTestingModule, TranslateModule.forRoot(), ReactiveFormsModule],
			providers: [NgbActiveModal, CommonService, VantageShellService],
		});
		fixture = TestBed.createComponent(
			ModalSmartPerformanceFeedbackComponent
		);
		component = fixture.componentInstance;
	}));

	it("should create", () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should submit form values - subscribed user', fakeAsync(() => {
		component.feedbackForm = new FormGroup({
			fbQ1: new FormControl(4),
			fbQ2: new FormControl(4),
			fbQ3: new FormControl(4),
			fbQ4: new FormControl(4),
			fbQ5: new FormControl(4),
			fbQ6: new FormControl(4),
			fbQ7: new FormControl(4),
			fbQ8: new FormControl(4),
			fbComment: new FormControl('Satisfied'),
		})
		commonService = TestBed.get(CommonService);
		component.isSubscribed = true;
		component.leftTime = 3;
		const spy = spyOn(component.feedbackForm, 'reset')
		component.onFeedBackSubmit();
		tick(5000);
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should submit form values - non-subscribed user', fakeAsync(() => {
		component.feedbackForm = new FormGroup({
			fbQ1: new FormControl(4),
			fbQ2: new FormControl(4),
			fbQ3: new FormControl(4),
			fbQ4: new FormControl(4),
			fbQ5: new FormControl(4),
			fbQ6: new FormControl(4),
			fbQ7: new FormControl(4),
			fbQ8: new FormControl(4),
			fbComment: new FormControl('Satisfied'),
		})
		commonService = TestBed.get(CommonService);
		component.isSubscribed = false;
		component.leftTime = 0;
		const spy = spyOn(component.feedbackForm, 'reset')
		component.onFeedBackSubmit();
		tick(1000);
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled()
	}));

	it('should close feedback modal', () => {
		activeModal = TestBed.get(NgbActiveModal);
		const spy = spyOn(activeModal, 'close');
		component.closeModal()
		expect(spy).toHaveBeenCalledWith('close')
	});
});
