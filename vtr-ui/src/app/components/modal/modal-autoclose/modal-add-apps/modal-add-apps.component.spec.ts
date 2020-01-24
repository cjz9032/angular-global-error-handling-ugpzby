import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Pipe } from '@angular/core';
import { ModalAddAppsComponent } from './modal-add-apps.component';

const gamingAutoCloseServiceMock = jasmine.createSpyObj('GamingAutoCloseService', [
	'isShellAvailable',
	'gamingAutoClose',
	'getAppsAutoCloseRunningList'
]);
const sampleRunningAppList = {
	processList: [
		{ processDescription: 'E046963F.LenovoCompanion', iconName: 'ms-appdata:///local/icon/31b3d9d7dea8e073.png' },
		{ processDescription: 'Microsoft Store', iconName: 'ms-appdata:///local/icon/24381e8e2df0ab73.png' },
		{
			processDescription: 'Microsoft.Windows.ShellExperienceHost',
			iconName: 'ms-appdata:///local/icon/3862fc8e419fa507.png'
		},
		{ processDescription: 'Shell Input Application', iconName: 'ms-appdata:///local/icon/ea2b14e5811d195d.png' },
		{ processDescription: 'Skype for Business', iconName: 'ms-appdata:///local/icon/29fd475c909f7486.png' },
		{ processDescription: 'Windows Calculator', iconName: 'ms-appdata:///local/icon/ddfff48c74049c74.png' },
		{
			processDescription: 'microsoft.windowscommunicationsapps',
			iconName: 'ms-appdata:///local/icon/7b2ca07c9a67cc86.png'
		},
		{
			processDescription: 'windows.immersivecontrolpanel',
			iconName: 'ms-appdata:///local/icon/4a4341b5d5250f32.png'
		}
	]
};


describe('ModalAddAppsComponent', () => {
	let component: ModalAddAppsComponent;
	let fixture: ComponentFixture<ModalAddAppsComponent>;
	const dummyElement = document.createElement('div');
	document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

	gamingAutoCloseServiceMock.isShellAvailable.and.returnValue(true);

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [
					ModalAddAppsComponent,
					mockPipe({ name: 'translate' }),
					mockPipe({ name: 'sanitize' })
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{ provide: HttpClient },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceMock }
				]
			}).compileComponents();

		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalAddAppsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show running app list', done => {
		const p = new Promise((resolve, reject) =>
		  setTimeout(() => resolve(''), 1000)
		);

		p.then(result => {
			fakeAsync(() => {
				gamingAutoCloseServiceMock.getAppsAutoCloseRunningList.and.returnValue(
					Promise.resolve(sampleRunningAppList)
				);
				component.refreshRunningList();
				fixture.detectChanges();
				tick(16);
				expect(sampleRunningAppList.processList).toBeDefined();
				expect(sampleRunningAppList.processList.length).toBeGreaterThan(0);
				fixture.destroy();
			});
		 done();
		});
	  });

	it('runappKeyup', fakeAsync(() => {
		const result = component.runappKeyup(true, 1);
		expect(result).toBe(undefined);
	})
	);

	it('closemodal', fakeAsync(() => {
		const result = component.closeModal(true);
		expect(result).toBe(undefined);
	})
	);

	it('addAppData', fakeAsync(() => {
		const result = component.addAppData({ target: { value: true } }, 1);
		expect(result).toBe(undefined);
	})
	);

});

export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(
		class MockPipe {
			// public transform(query: string, ...args: any[]): any {
			// 	return query;
			// }
		}
	);
}
