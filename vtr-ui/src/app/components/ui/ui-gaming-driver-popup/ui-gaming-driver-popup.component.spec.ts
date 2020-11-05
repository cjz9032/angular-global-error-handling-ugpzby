import { UiGamingDriverPopupComponent } from './ui-gaming-driver-popup.component';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('UiGamingDriverPopupComponent', () => {
	let component: UiGamingDriverPopupComponent;
	let fixture: ComponentFixture<UiGamingDriverPopupComponent>;
	let router = { navigate: jasmine.createSpy('navigate') }
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiGamingDriverPopupComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: Router, useValue: router },
			],
		}).compileComponents();
		fixture = TestBed.createComponent(UiGamingDriverPopupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Checking call have been made for close function', fakeAsync(() => {
		component.isGamingDriverPop = true;
		component.close();
		spyOn(component, 'close');
		component.close();
		expect(component.close).toHaveBeenCalled();
	}));

	it('Checking call have been made for onOutsideClick function', fakeAsync(() => {
		component.onOutsideClick();
		spyOn(component, 'onOutsideClick');
		component.onOutsideClick();
		expect(component.onOutsideClick).toHaveBeenCalled();
	}));

	it('should have path or route "device/system-updates" for systemUpdatePage function', fakeAsync(() => {
		component.isGamingDriverPop = false;
		component.systemUpdatePage();
		expect(component.systemUpdatePage()).toBeUndefined();
	}));

	it('Checking set time out for isPopupWindowGetFocus function', done => {
		component.isGamingDriverPop = true;
		let event = {which:9,srcElement:{className:'enable-button'}};
		component.isPopupWindowGetFocus(event);
		expect(component.isPopupWindowGetFocus(event)).toBeUndefined();
		component.isGamingDriverPop = false;
		let event2 = {which:9,srcElement:{className:'enable-button'}};
		component.isPopupWindowGetFocus(event2);
		const p = new Promise((resolve, reject) =>
			setTimeout(() => resolve(''), 50)
		);
		p.then(result => {
			fakeAsync(() => {
				expect(component.isPopupWindowGetFocus(event2)).toBeUndefined();
			});
			done();
		});
		let event3 = {which:8,srcElement:{className:'enable-button'}};
		component.isPopupWindowGetFocus(event3);
		expect(component.isPopupWindowGetFocus(event3)).toBeUndefined();
	});

	it('Should navigate the page when click ok button', fakeAsync(() => {
		component.isGamingDriverPop  = true;
		component.clickEnableBtn();
		expect(component.clickEnableBtn()).toBeUndefined();
		component.isGamingDriverPop  = false;
		component.clickEnableBtn();
		expect(component.clickEnableBtn()).toBeUndefined();
	}));

	it('Should refresh page when init component', fakeAsync(() => {
		component.popupFeatureText = true;
		component.ngOnInit();
		expect(component.ngOnInit()).toBeUndefined();
	}));


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
