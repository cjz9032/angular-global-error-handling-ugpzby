import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef } from '@lenovo/material/dialog';
import { TranslateStore } from '@ngx-translate/core';

import { TranslationModule } from 'src/app/modules/translation.module';
import { ModalIntelligentCoolingModesComponent } from './modal-intelligent-cooling-modes.component';

describe('ModalIntelligentCoolingModesComponent', () => {
	let component: ModalIntelligentCoolingModesComponent;
	let fixture: ComponentFixture<ModalIntelligentCoolingModesComponent>;
	let activeModal: MatDialogRef<ModalIntelligentCoolingModesComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				schemas: [NO_ERRORS_SCHEMA],
				declarations: [ModalIntelligentCoolingModesComponent],
				imports: [TranslationModule],
				providers: [MatDialogRef, TranslateStore],
			});
		})
	);

	it(
		'should create the app',
		waitForAsync(() => {
			fixture = TestBed.createComponent(ModalIntelligentCoolingModesComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			expect(component).toBeTruthy();
		})
	);

	it(
		'should call closeModal',
		waitForAsync(() => {
			fixture = TestBed.createComponent(ModalIntelligentCoolingModesComponent);
			component = fixture.componentInstance;
			activeModal = TestBed.inject(MatDialogRef);
			const spy = spyOn(activeModal, 'close');
			component.closeModal();
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call onKeydownHandler',
		waitForAsync(() => {
			fixture = TestBed.createComponent(ModalIntelligentCoolingModesComponent);
			component = fixture.componentInstance;
			const spy = spyOn(component, 'closeModal');
			const event = new KeyboardEvent('keydown');
			component.onKeydownHandler(event);
			expect(spy).toHaveBeenCalled();
		})
	);

	it(
		'should call onKeydownEnterHandler',
		waitForAsync(() => {
			fixture = TestBed.createComponent(ModalIntelligentCoolingModesComponent);
			component = fixture.componentInstance;
			const spy = spyOn(component, 'closeModal');
			const event = new KeyboardEvent('keydown');
			component.onKeydownEnterHandler(event);
			expect(spy).toHaveBeenCalled();
		})
	);

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
