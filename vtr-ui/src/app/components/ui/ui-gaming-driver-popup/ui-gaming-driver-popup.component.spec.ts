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
		component.systemUpdatePage();
		expect(router.navigate).toHaveBeenCalledWith(['device/system-updates']);
	}));

	it('Checking set time out for runappKeyup function', fakeAsync(() => {
		let event = {which:9};
		component.runappKeyup(event);
		tick(500)
		fixture.detectChanges()
		fixture.whenStable().then(() => {
			const gamingPopUpWindow = fixture.debugElement.query(By.css('gaming-driverPopup-close'))
			expect(gamingPopUpWindow).toBe(null)
		})
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
