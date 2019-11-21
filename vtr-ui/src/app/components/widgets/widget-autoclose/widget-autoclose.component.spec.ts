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
				schemas: [NO_ERRORS_SCHEMA],
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


	it('openAutoCloseModal', () => {
		const resp = component.openAutoCloseModal();
		expect(resp).toBe();
	});

	it('removeApp', () => {
		const resp = component.removeApp('Microsoft.MicrosoftEdge', 1);
		expect(resp).toBe();
	});

	it('ngOnChanges', () => {
		let changeval: any;
		const resp = component.ngOnChanges(changeval);
		expect(resp).toBe();
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
