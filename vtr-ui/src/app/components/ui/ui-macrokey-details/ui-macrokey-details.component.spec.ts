import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMacrokeyDetailsComponent } from './ui-macrokey-details.component';
import { Component, Pipe, NO_ERRORS_SCHEMA } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

@Component({ selector: 'vtr-modal-gaming-prompt', template: '' })
export class ModalGamingPromptStubComponent {
	componentInstance = {
		title: undefined,
		description: undefined,
		description2: undefined,
		description3: undefined,
		comfirmButton: undefined,
		cancelButton: undefined,
		emitService: of(1),
	};
}

describe('UiMacrokeyDetailsComponent', () => {
	let component: UiMacrokeyDetailsComponent;
	let fixture: ComponentFixture<UiMacrokeyDetailsComponent>;

	const dummyElement = document.createElement('div');
	dummyElement.id = 'gaming_macrokey_startrecording';
	document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				UiMacrokeyDetailsComponent,
				ModalGamingPromptStubComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' }),
			],
			imports: [],
			providers: [NgbModal],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	}));

	let modalService: any;

	beforeEach(() => {
		modalService = TestBed.inject(NgbModal);
		fixture = TestBed.createComponent(UiMacrokeyDetailsComponent);
		component = fixture.componentInstance;
		component.recording = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should start recording', async () => {
		try {
			await component.toggleRecording();
		} catch (e) {}
		expect(component.recording).toEqual(true);
	});

	it('should delete records', async () => {
		const result = await component.recordsDelete([1]);
		expect(result).toEqual(undefined);
	});

	it('should delete records with undefined', async () => {
		const result = await component.recordsDelete(undefined);
		expect(result).toEqual(undefined);
	});

	it('should call the toggleRecording function when start clicked', async () => {
		await component.onStartClicked({});
		expect(component.recording).toEqual(true);
	});

	it('should call the toggleRecording function when stop clicked', async () => {
		await component.onStopClicked({});
		expect(component.recording).toEqual(true);
	});

	it('should add the event listener', async () => {
		const result = await component.ngOnInit();
		expect(result).toEqual(undefined);
	});

	it('should call the ngOnchanges with undefined', async () => {
		const result = await component.ngOnChanges({ messageData: undefined });
		expect(result).toEqual(undefined);
	});

	it('should call the ngOnchanges with timeout10', async () => {
		let modalRef = new ModalGamingPromptStubComponent();
		spyOn(modalService, 'open').and.returnValue(modalRef);
		const result = await component.ngOnChanges({ messageData: { currentValue: 'timeout10' } });
		modalRef.componentInstance.emitService = of(1);
		expect(modalService.open).toHaveBeenCalledTimes(1);
	});

	it('should call the ngOnchanges with timeout20 ', async () => {
		let modalRef = new ModalGamingPromptStubComponent();
		spyOn(modalService, 'open').and.returnValue(modalRef);
		const result = await component.ngOnChanges({ messageData: { currentValue: 'timeout20' } });
		modalRef.componentInstance.emitService = of(1);
		expect(modalService.open).toHaveBeenCalledTimes(1);
	});

	it('should call the ngOnchanges with maximum timeout', async () => {
		let modalRef = new ModalGamingPromptStubComponent();
		spyOn(modalService, 'open').and.returnValue(modalRef);
		const result = await component.ngOnChanges({ messageData: { currentValue: 'maximum' } });
		modalRef.componentInstance.emitService = of(1);
		expect(modalService.open).toHaveBeenCalledTimes(1);
	});

	it('should call the toggleOnPageMinimized function when window minimized', async () => {
		await Object.defineProperty(document, 'hidden', { value: true, configurable: true });
		component.recording = true;
		await component.toggleOnPageMinimized();
		expect(component.recording).toEqual(false);
	});

	it('should call the toggleOnPageMinimized hidden=true and recording=false function when window minimized', async () => {
		await Object.defineProperty(document, 'hidden', { value: true, configurable: true });
		component.recording = false;
		const recording = component.recording;
		await component.toggleOnPageMinimized();
		expect(component.recording).toEqual(recording);
	});

	it('should call the toggleOnPageMinimized hidden=false function when window minimized', async () => {
		await Object.defineProperty(document, 'hidden', { value: false, configurable: true });
		const recording = component.recording;
		await component.toggleOnPageMinimized();
		expect(component.recording).toEqual(recording);
	});

	it('should turn on the toggle when page minimized', async () => {
		component.recording = true;
		await Object.defineProperties(document, { hidden: { value: true, configurable: true } });
		component.toggleOnPageMinimized();
		expect(component.recording).toEqual(false);
	});

	it('should onStartClicked with empty pointer', async () => {
		var event = new PointerEvent('pointerdown', {
			pointerId: 0,
			bubbles: true,
			cancelable: true,
			pointerType: 'touch',
			width: 100,
			height: 100,
			isPrimary: true,
		});
		component.onStartClicked(event);
		expect(component.recording).toEqual(false);
	});

	it('should onStopClicked with empty pointer', async () => {
		const dummyElement = document.createElement('button');
		document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
		component.recording = true;
		await component.onStopClicked(null);
		expect(component.recording).toEqual(false);
	});
});

export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name,
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}
