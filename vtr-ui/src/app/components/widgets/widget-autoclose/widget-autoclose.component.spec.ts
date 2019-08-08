import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GamingAutoCloseService } from 'src/app/services/gaming/gaming-autoclose/gaming-autoclose.service';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Pipe } from '@angular/core';
import { WidgetAutocloseComponent } from './widget-autoclose.component';

const gamingAutoCloseServiceMock = jasmine.createSpyObj('GamingAutoCloseService', [
	'isShellAvailable',
	'gamingAutoClose',
	'getAppsAutoCloseList',
	'getAutoCloseListCache',
	'setAutoCloseListCache',
	'delAppsAutoCloseList'
]);

const sampleAutoCloseList = {
	processList: [
		{ processDescription: 'Google Chrome', iconName: 'ms-appdata:///local/icon/83a48b2b3d643451.png' },
		{
			processDescription: 'Microsoft.MicrosoftEdgeDevToolsPreview',
			iconName: 'ms-appdata:///local/icon/31b3d9d7dea8e073.png'
		},
		{ processDescription: 'Slack', iconName: 'ms-appdata:///local/icon/256509debf91d991.png' },
		{ processDescription: 'Visual Studio Code', iconName: 'ms-appdata:///local/icon/e817dc2039be4789.png' }
	]
};

describe('WidgetAutocloseComponent', () => {
	let component: WidgetAutocloseComponent;
	let fixture: ComponentFixture<WidgetAutocloseComponent>;
	gamingAutoCloseServiceMock.isShellAvailable.and.returnValue(true);

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [
					WidgetAutocloseComponent,
					mockPipe({ name: 'translate' }),
					mockPipe({ name: 'sanitize' })
				],
				schemas: [ NO_ERRORS_SCHEMA ],
				providers: [
					{ provide: HttpClient },
					{ provide: GamingAutoCloseService, useValue: gamingAutoCloseServiceMock }
				]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetAutocloseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it(
		'should show app list',
		fakeAsync(() => {
			gamingAutoCloseServiceMock.getAppsAutoCloseList.and.returnValue(Promise.resolve(sampleAutoCloseList));
			gamingAutoCloseServiceMock.setAutoCloseListCache
				.withArgs(sampleAutoCloseList.processList)
				.and.returnValue();
			component.refreshAutoCloseList();
			tick(20);
			expect(component.autoCloseAppList).toBeDefined();
			expect(component.autoCloseAppList.length).toBeGreaterThan(0);
		})
	);

	it(
		'should remove a app',
		fakeAsync(() => {
			component.autoCloseAppList = sampleAutoCloseList.processList;
			fixture.detectChanges();
			gamingAutoCloseServiceMock.delAppsAutoCloseList.and.returnValue(Promise.resolve(true));
			gamingAutoCloseServiceMock.setAutoCloseListCache
				.withArgs(sampleAutoCloseList.processList)
				.and.returnValue();
			component.removeApp('Google Chrome', 0);
			tick(20);
			expect(component.autoCloseAppList).toBeDefined();
			expect(component.autoCloseAppList.length).toEqual(3);
		})
	);

	it(
		'should not remove a app',
		fakeAsync(() => {
			component.autoCloseAppList = sampleAutoCloseList.processList;
			fixture.detectChanges();
			gamingAutoCloseServiceMock.delAppsAutoCloseList.and.returnValue(Promise.resolve(false));
			component.removeApp('Google Chrome', 0);
			tick(20);
			expect(component.autoCloseAppList).toBeDefined();
			expect(component.autoCloseAppList.length).toEqual(4);
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
