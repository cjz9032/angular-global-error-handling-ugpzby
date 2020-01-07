import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalTurnOnComponent } from './modal-turn-on.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { HttpClient } from '@angular/common/http';
const gamingAutoCloseServiceMock = jasmine.createSpyObj('GamingAutoCloseService', [
	'isShellAvailable',
	'gamingAutoClose',
	'getAppsAutoCloseRunningList'
]);
describe('ModalTurnOnComponent', () => {
	let component: ModalTurnOnComponent;
	let fixture: ComponentFixture<ModalTurnOnComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				ModalTurnOnComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceMock }
			]


		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalTurnOnComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});



	it('should check turnOnAction', () => {
		component.turnOnAction(true);
		expect(component).toBeTruthy();
	});

	it('should check keydownFn', () => {
		component.keydownFn(true);
		expect(component).toBeTruthy();
	});


	it('should check closeModal', () => {
		component.closeModal(true);
		expect(component).toBeTruthy();
	});

	it('should check notNowAction', () => {
		component.notNowAction(true);
		expect(component).toBeTruthy();
	});
	it('should check setAksAgain', () => {
		component.setAksAgain(true);
		expect(component).toBeTruthy();
	});


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

