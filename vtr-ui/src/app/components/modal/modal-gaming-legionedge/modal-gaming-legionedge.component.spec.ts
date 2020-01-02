import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalGamingLegionedgeComponent } from './modal-gaming-legionedge.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ModalGamingLegionedgeComponent', () => {
	let component: ModalGamingLegionedgeComponent;
	let fixture: ComponentFixture<ModalGamingLegionedgeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				ModalGamingLegionedgeComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [NgbActiveModal, HttpClient]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalGamingLegionedgeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should check closeModal', () => {
		component.closeModal();
		expect(component).toBeTruthy();
	});

	it('onFocus calling modal focus', (() => {
		fixture.detectChanges();
		const modal = document.createElement('div');
		modal.setAttribute('class', 'gaming-help-modal');
		fixture.debugElement.nativeElement.append(modal);
		component.onFocus();
		expect(modal).toBeTruthy();
	}));

});


export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}
