import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@lenovo/material/dialog';
import { of } from 'rxjs';

import { MacrokeyService } from 'src/app/services/gaming/macrokey/macrokey.service';

import { UiMacrokeyRecordedListComponent } from './ui-macrokey-recorded-list.component';
import { GAMING_DATA } from './../../../../testing/gaming-data';

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
const macrokeyServiceMock = jasmine.createSpyObj('MacrokeyService', [
	'isMacroKeyAvailable',
	'clearKey',
	'updateMacrokeyInitialKeyDataCache',
	'updateMacrokeyInitialKeyIntervalDataCache',
	'updateMacrokeyInitialKeyRepeatDataCache',
	'setMacroKey',
	'setRepeat',
	'setInterval',
	'setOnRepeatStatusCache',
	'setOnIntervalStatusCache',
]);

const sampleInputData = {
	key: '0',
	macro: {
		repeat: 1,
		interval: 1,
		inputs: [
			{ status: 1, key: 'S', interval: 0, pairName: 'pair-S-1' },
			{ status: 0, key: 'S', interval: 208, pairName: 'pair-S-1' },
			{ status: 1, key: 'D', interval: 174, pairName: 'pair-D-1' },
			{ status: 0, key: 'D', interval: 186, pairName: 'pair-D-1' },
			{ status: 1, key: 'F', interval: 144, pairName: 'pair-F-1' },
			{ status: 0, key: 'F', interval: 126, pairName: 'pair-F-1' },
		],
	},
};
const translateServiceMock = { instant: (name) => name };
describe('UiMacrokeyRecordedListComponent', () => {
	let component: UiMacrokeyRecordedListComponent;
	let fixture: ComponentFixture<UiMacrokeyRecordedListComponent>;
	let modalService: any;
	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					UiMacrokeyRecordedListComponent,
					ModalGamingPromptStubComponent,
					GAMING_DATA.mockPipe({ name: 'translate' }),
					GAMING_DATA.mockPipe({ name: 'sanitize' }),
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient, useValue: HttpClient },
					HttpClientModule,
					{ provide: TranslateService, useValue: translateServiceMock },
					{ provide: MacrokeyService, useValue: macrokeyServiceMock },
				],
			}).compileComponents();
			fixture = TestBed.createComponent(UiMacrokeyRecordedListComponent);
			modalService = TestBed.inject(MatDialog);
			component = fixture.componentInstance;
			component.selectedNumber = { key: '0' };
			component.recordingStatus = false;
			component.recordsData = sampleInputData.macro;
			component.isNumberpad = true;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('when Parameter is false fuction will return', () => {
		component.selectedNumber.key = 'M1';
		component.deleteAllMacros(true);
		expect(component.ignoreInterval).toBeFalse();
		component.selectedNumber.key = 'K';
		component.deleteAllMacros(true);
		expect(component.deleteAllMacros(false)).toBeUndefined();
		component.deleteAllMacros(false);
		expect(component.deleteAllMacros(false)).toBeUndefined();
	});
	it('Record should be deleted', fakeAsync(() => {
		macrokeyServiceMock.setMacroKey.and.returnValue(Promise.resolve(true));
		component.recordDelete(sampleInputData.macro.inputs[0], 0);
		tick(20);
		expect(component.recordsData.inputs.length).toEqual(4);
	}));
	it('Repeat should set to 1', fakeAsync(() => {
		macrokeyServiceMock.setRepeat.and.returnValue(Promise.resolve(true));
		component.onRepeatChanged({ value: 1 });
		tick(20);
		expect(component.recordsData.repeat).toEqual(1);
	}));
	it('Repeat should set to 5', fakeAsync(() => {
		macrokeyServiceMock.setRepeat.and.returnValue(Promise.resolve(true));
		component.onRepeatChanged({ value: 5 });
		tick(20);
		expect(component.recordsData.repeat).toEqual(5);
	}));
	it('Repeat should set to undefined', fakeAsync(() => {
		macrokeyServiceMock.setRepeat.and.returnValue(Promise.resolve(false));
		component.onRepeatChanged({ value: 5 });
		expect(component.onRepeatChanged({ value: 5 })).toBeUndefined();
	}));
	it('Interval should set to 1', fakeAsync(() => {
		macrokeyServiceMock.setInterval.and.returnValue(Promise.resolve(true));
		component.onIntervalChanged({ value: 1 });
		tick(20);
		expect(component.recordsData.interval).toEqual(1);
		expect(component.ignoreInterval).toEqual(false);
	}));
	it('Interval should set to 2', fakeAsync(() => {
		macrokeyServiceMock.setInterval.and.returnValue(Promise.resolve(true));
		component.onIntervalChanged({ value: 2 });
		tick(20);
		expect(component.recordsData.interval).toEqual(2);
		expect(component.ignoreInterval).toEqual(true);
		component.onIntervalChanged({});
		expect(component.tooltipsDelay).toEqual('');
	}));
	it('Interval should set to undefined', fakeAsync(() => {
		macrokeyServiceMock.setInterval.and.returnValue(Promise.resolve(false));
		component.onIntervalChanged({ value: 1 });
		expect(component.onIntervalChanged({ value: 1 })).toBeUndefined();
	}));

	it('Should clear records', fakeAsync(() => {
		const modalRef = new ModalGamingPromptStubComponent();
		spyOn(modalService, 'open').and.returnValue(modalRef);
		component.clearRecords();
		expect(component.clearRecords()).toBeUndefined();
	}));
	it('Should get pair name', fakeAsync(() => {
		component.pairCounter = [1, 2, 3, 4];
		component.getPairName(2, 1);
		expect(component.pairCounter[1]).toEqual(2);
	}));
	it('Should update page info when change some val', fakeAsync(() => {
		const changes = {
			recordsData: {
				currentValue: {
					inputs: [
						{ interval: 0, key: 'W', pairName: 'pair-W-1', status: 1 },
						{ interval: 10, key: 'W', pairName: 'pair-W-1', status: 0 },
						{ interval: 9, key: 'D', pairName: 'pair-D-6', status: 1 },
					],
					interval: 1,
					repeat: 1,
				},
			},
		};
		component.ngOnChanges(changes);
		expect(component.ignoreInterval).toBeFalse();
		changes.recordsData.currentValue.interval = 2;
		component.ngOnChanges(changes);
		expect(component.ignoreInterval).toBeTrue();
		component.ngOnChanges(undefined);
		expect(component.ngOnChanges(undefined)).toBeUndefined();
		component.ngOnChanges({ recordsData: undefined });
		expect(component.ngOnChanges(undefined)).toBeUndefined();
	}));
});
