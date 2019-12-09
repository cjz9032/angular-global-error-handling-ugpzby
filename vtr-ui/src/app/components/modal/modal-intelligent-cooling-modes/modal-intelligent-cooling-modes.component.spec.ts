import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntelligentCoolingModesComponent } from './modal-intelligent-cooling-modes.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from 'src/app/modules/translation.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateStore } from '@ngx-translate/core';

describe('ModalIntelligentCoolingModesComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalIntelligentCoolingModesComponent],
			imports: [FontAwesomeModule, TranslationModule],
			providers: [NgbActiveModal, TranslateStore]
		}).compileComponents();
	}));

	describe(':', () => {

		function setup() {
			const fixture = TestBed.createComponent(ModalIntelligentCoolingModesComponent);
			const component = fixture.debugElement.componentInstance;
			return { fixture, component };
		}

		it('should create the app', (() => {
            const { component } = setup();
            expect(component).toBeTruthy();
		}));
		
		it('closeModal calling activeModal close', async(() => {
            const { fixture, component } = setup();
            spyOn(component.activeModal, 'close').and.returnValue(Promise.resolve('close'));

            fixture.detectChanges();//ngOnInit
            component.closeModal();

            expect(component.activeModal.close).toHaveBeenCalled();
		}));
		
		it('onKeydownHandler calling activeModal close', async(() => {
            const { fixture, component } = setup();
            spyOn(component, 'closeModal');

            fixture.detectChanges();//ngOnInit
            component.onKeydownHandler(KeyboardEvent);

            expect(component.closeModal).toHaveBeenCalled();
		}));

		it('onKeydownEnterHandler calling activeModal close', async(() => {
            const { fixture, component } = setup();
            spyOn(component, 'closeModal');

            fixture.detectChanges();//ngOnInit
            component.onKeydownEnterHandler(KeyboardEvent);

            expect(component.closeModal).toHaveBeenCalled();
		}));

		it('onFocus calling modal focus', (() => {
            const { fixture, component } = setup();

            fixture.detectChanges();//ngOnInit

            let modal = document.createElement('div');
            modal.setAttribute('class','Intelligent-Cooling-Modes-Modal');
            fixture.debugElement.nativeElement.append(modal);
            component.onFocus();

            expect(modal).toBeTruthy();
        }));
		



	});
});
