import { TranslateService, TranslateStore, TranslateLoader, TranslateCompiler, TranslateParser, MissingTranslationHandler } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { UiMacrokeyRecordedListComponent } from './ui-macrokey-recorded-list.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { MacrokeyService } from 'src/app/services/gaming/macrokey/macrokey.service';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';

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
	'setOnIntervalStatusCache'
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
			{ status: 0, key: 'F', interval: 126, pairName: 'pair-F-1' }
		]
	}
};
const translateServiceMock = { instant: (name) =>  name};
describe('UiMacrokeyRecordedListComponent', () => {
	let component: UiMacrokeyRecordedListComponent;
	let fixture: ComponentFixture<UiMacrokeyRecordedListComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [
					UiMacrokeyRecordedListComponent,
					mockPipe({ name: 'translate' }),
					mockPipe({ name: 'sanitize' })
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{provide: HttpClient, useValue: HttpClient},
					HttpClientModule,
					{ provide: TranslateService, useValue: translateServiceMock},
					{ provide: MacrokeyService, useValue: macrokeyServiceMock }
				]
			}).compileComponents();
			fixture = TestBed.createComponent(UiMacrokeyRecordedListComponent);
			component = fixture.componentInstance;
			component.number = { key: '0' };
			component.recordingStatus = false;
			component.recordsData = sampleInputData.macro;
			component.isNumberpad = true;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Repeat should be reset to 1', () => {
		component.deleteAllMacros(true);
		expect(component.repeatSelectedValue).toEqual(1);
	});

	it('Interval should be reset to 1', () => {
		component.deleteAllMacros(true);
		expect(component.delaySelectedValue).toEqual(1);
		expect(component.ignoreInterval).toEqual(false);
	});

	it('Record should be deleted', fakeAsync(() => {
		macrokeyServiceMock.setMacroKey.and.returnValue(Promise.resolve(true));
		component.recordDelete(sampleInputData.macro.inputs[0], 0);
		tick(20);
		expect(component.recordsData.inputs.length).toEqual(4);
	})
	);

	it(
		'Repeat should set to 1',
		fakeAsync(() => {
			macrokeyServiceMock.setRepeat.and.returnValue(Promise.resolve(true));
			component.onRepeatChanged({ value: 1 });
			tick(20);
			expect(component.recordsData.repeat).toEqual(1);
		})
	);

	it(
		'Repeat should set to 5',
		fakeAsync(() => {
			macrokeyServiceMock.setRepeat.and.returnValue(Promise.resolve(true));
			component.onRepeatChanged({ value: 5 });
			tick(20);
			expect(component.recordsData.repeat).toEqual(5);
		})
	);

	it(
		'Interval should set to 1',
		fakeAsync(() => {
			macrokeyServiceMock.setInterval.and.returnValue(Promise.resolve(true));
			component.onIntervalChanged({ value: 1 });
			tick(20);
			expect(component.recordsData.interval).toEqual(1);
			expect(component.ignoreInterval).toEqual(false);
		})
	);

	it(
		'Interval should set to 2',
		fakeAsync(() => {
			macrokeyServiceMock.setInterval.and.returnValue(Promise.resolve(true));
			component.onIntervalChanged({ value: 2 });
			tick(20);
			expect(component.recordsData.interval).toEqual(2);
			expect(component.ignoreInterval).toEqual(true);
		})
	);

	it(
		'Do check should detect changes',
		fakeAsync(() => {
			component.recordsData = {
				repeat: 3,
				interval: 2,
				inputs: [
					{ status: 1, key: 'S', interval: 0, pairName: 'pair-S-1' },
					{ status: 0, key: 'S', interval: 208, pairName: 'pair-S-1' }
				]
			};
			component.ngDoCheck();
			tick(20);
			expect(component.recordsList.length).toEqual(2);
			expect(component.repeatSelectedValue).toEqual(3);
			expect(component.delaySelectedValue).toEqual(2);
		})
	);
	it('Should clear records', fakeAsync(() => {
		component.clearRecordPopup = false;
		component.clearRecords();
		tick(10);
		fixture.detectChanges();
		expect(component.clearRecordPopup).toEqual(true);
	})
	);

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
