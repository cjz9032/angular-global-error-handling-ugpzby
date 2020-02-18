// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { UiMacrokeyPopupComponent } from './ui-macrokey-popup.component';
// import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';

// describe('UiMacrokeyPopupComponent', () => {
// 	let component: UiMacrokeyPopupComponent;
// 	let fixture: ComponentFixture<UiMacrokeyPopupComponent>;

// 	beforeEach(async(() => {
// 		TestBed.configureTestingModule({
// 			declarations: [UiMacrokeyPopupComponent,
// 				mockPipe({ name: 'translate' }),
// 				mockPipe({ name: 'sanitize' })],
// 			schemas: [NO_ERRORS_SCHEMA]
// 		})
// 			.compileComponents();
// 	}));

// 	beforeEach(() => {
// 		fixture = TestBed.createComponent(UiMacrokeyPopupComponent);
// 		component = fixture.componentInstance;
// 		component.modalContent = {
// 			headerTitle: 'This is the header',
// 			bodyText: 'this is the test body',
// 			btnConfirm: 'Confirm'
// 		};
// 		let html_x = fixture.debugElement.nativeElement;
// 		html_x.classList.add("vtr-app");
// 		fixture.detectChanges();
// 	});

// 	it('should create', () => {
// 		expect(component).toBeTruthy();
// 	});

// 	it('should focus on element', async () => {
// 		let result: void;
// 		try {
// 			result = await component.submitAction();
// 		} catch (e) {
// 			console.log(e);
// 		}
// 		expect(result).toEqual(undefined);

// 	});

// 	it('should call key down fun', async () => {
// 		let result: void;
// 		try {
// 			result = await component.keydownFn({which: 9});
// 		} catch (e) {
// 			console.log(e);
// 		}
// 		expect(result).toEqual(undefined);

// 	});
// });
// export function mockPipe(options: Pipe): Pipe {
// 	const metadata: Pipe = {
// 		name: options.name
// 	};
// 	return Pipe(metadata)(
// 		class MockPipe {
// 			public transform(query: string, ...args: any[]): any {
// 				return query;
// 			}
// 		}
// 	);
// }
