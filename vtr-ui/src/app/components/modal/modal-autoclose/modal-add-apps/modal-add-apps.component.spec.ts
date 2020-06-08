import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
	async,
	ComponentFixture,
	TestBed,
	fakeAsync,
	tick,
	discardPeriodicTasks,
} from '@angular/core/testing';
import { Pipe } from '@angular/core';
import { ModalAddAppsComponent } from './modal-add-apps.component';
import { By } from '@angular/platform-browser';

const gamingAutoCloseServiceMock = jasmine.createSpyObj(
	'GamingAutoCloseService',
	['isShellAvailable', 'gamingAutoClose', 'getAppsAutoCloseRunningList']
);
const sampleRunningAppList = {
	processList: [
		{
			processDescription: 'E046963F.LenovoCompanion',
			iconName: 'ms-appdata:///local/icon/31b3d9d7dea8e073.png',
		},
		{
			processDescription: 'Microsoft Store',
			iconName: 'ms-appdata:///local/icon/24381e8e2df0ab73.png',
		},
		{
			processDescription: 'Microsoft.Windows.ShellExperienceHost',
			iconName: 'ms-appdata:///local/icon/3862fc8e419fa507.png',
		},
		{
			processDescription: 'Shell Input Application',
			iconName: 'ms-appdata:///local/icon/ea2b14e5811d195d.png',
		},
		{
			processDescription: 'Skype for Business',
			iconName: 'ms-appdata:///local/icon/29fd475c909f7486.png',
		},
		{
			processDescription: 'Windows Calculator',
			iconName: 'ms-appdata:///local/icon/ddfff48c74049c74.png',
		},
		{
			processDescription: 'microsoft.windowscommunicationsapps',
			iconName: 'ms-appdata:///local/icon/7b2ca07c9a67cc86.png',
		},
		{
			processDescription: 'windows.immersivecontrolpanel',
			iconName: 'ms-appdata:///local/icon/4a4341b5d5250f32.png',
		},
	],
};

describe('ModalAddAppsComponent', () => {
	let component: ModalAddAppsComponent;
	let fixture: ComponentFixture<ModalAddAppsComponent>;
	const dummyElement = document.createElement('div');
	document.getElementById = jasmine
		.createSpy('HTML Element')
		.and.returnValue(dummyElement);

	gamingAutoCloseServiceMock.isShellAvailable.and.returnValue(true);

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				ModalAddAppsComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' }),
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{
					provide: GamingAutoCloseService,
					useValue: gamingAutoCloseServiceMock,
				},
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalAddAppsComponent);
		component = fixture.componentInstance;
		const close = document.createElement('div');
		close.id = 'close';
		fixture.debugElement.nativeElement.append(close);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show running app list when no apps loading is false ', fakeAsync(() => {
		gamingAutoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
			Promise.resolve(sampleRunningAppList)
		);
		fixture.whenStable().then(() => {
		component.refreshRunningList();
			tick(10);
			expect(component.runningList).toBe(sampleRunningAppList.processList);
			expect(component.loadingNoApps).toBe(false);
			expect(component.ariaLabel).toBe('gaming.autoClose.modalTurnAutoCloseNarrator.open');
		});
	}));

	it('should show no apps is running',
		fakeAsync(() => {
			gamingAutoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
				Promise.resolve({processList: []})
			);
			fixture.whenStable().then(() => {
				component.refreshRunningList();
				tick();
				expect(component.runningList).toEqual([]);
				expect(component.loadingNoApps).toBe(true);
				expect(component.ariaLabel).toBe('gaming.autoClose.modalTurnAutoCloseNarrator.running');
			});
		})
	);

	it('run tab key to check focus', fakeAsync(() => {
		const spy = spyOn(component, 'focusElement').and.callThrough();
		component.runningList = sampleRunningAppList.processList;
		component.runappKeyup({ which: 9 }, 7);
		tick(10);
		discardPeriodicTasks();
		expect(spy).toHaveBeenCalled();
	}));

	it('close modal', fakeAsync(() => {
		spyOn(component.closeAddAppsModal, 'emit').and.callThrough();
		const focus = fixture.debugElement.query(By.css('#main-wrapper'));
		const focusedElement = fixture.debugElement.query(By.css(':focus'));
		expect(focusedElement).toBe(focus);
		component.closeAddAppsModal.subscribe((res: any) => {
			expect(res).toBe(false);
		});
		component.closeModal(false);
	}));

	it('addAppData', fakeAsync(() => {
		spyOn(component.addAppToList, 'emit').and.callThrough();
		component.addAppToList.subscribe((res: any) => {
			expect(res.checked).toBe(true);
			expect(res.app).toBe(true);
		});
		tick(100);
		component.addAppData({target: {value: true}}, 1);
	}));

	it('checkFocus', fakeAsync(() => {
		const spy = spyOn(component, 'focusElement').and.callThrough();
		component.loadingNoApps = true;
		component.checkFocus({ which: 9 });
		tick(100);
		discardPeriodicTasks();
		expect(spy).toHaveBeenCalled();
	}));
});

export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name,
	};
	return Pipe(metadata)(class MockPipe {});
}

