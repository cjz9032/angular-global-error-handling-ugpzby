import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkboostTurnOnComponent } from './networkboost-turn-on.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';

describe('NetworkboostTurnOnComponent', () => {
	let component: NetworkboostTurnOnComponent;
	let fixture: ComponentFixture<NetworkboostTurnOnComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				NetworkboostTurnOnComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient }
							]


			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NetworkboostTurnOnComponent);
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

	it('should check setAksAgain', () => {
		component.setAksAgain();
		expect(component).toBeTruthy();
	});


	it('should check notNowAction', () => {
		component.notNowAction(true);
		expect(component).toBeTruthy();
	});

	it('should check closeModal', () => {
		component.closeModal(true);
		expect(component).toBeTruthy();
	});

	it('should check closeModal', () => {
		component.closeModal(false);
		expect(component).toBeTruthy();
	});

	it('should check keydownFn', () => {
		component.keydownFn(true);
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

