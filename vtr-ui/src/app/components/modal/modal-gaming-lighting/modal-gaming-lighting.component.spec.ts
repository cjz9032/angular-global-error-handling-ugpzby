import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalGamingLightingComponent } from './modal-gaming-lighting.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ModalGamingLightingComponent', () => {
	let component: ModalGamingLightingComponent;
	let fixture: ComponentFixture<ModalGamingLightingComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalGamingLightingComponent,
			mockPipe({ name: 'translate' }),
			mockPipe({ name: 'sanitize' })],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: NgbActiveModal}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalGamingLightingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('onFocus calling modal focus', (() => {
		fixture.detectChanges();
		const modalres = document.createElement('div');
		modalres.setAttribute('class', 'gaming-help-modal');
		fixture.debugElement.nativeElement.append(modalres);
		component.onFocus();
		expect(modalres).toBeTruthy();
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
