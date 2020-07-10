import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSwitchOnoffComponent } from './ui-switch-onoff.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/modules/translation.module';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UiSwitchOnoffComponent', () => {
	let component: UiSwitchOnoffComponent;
	let fixture: ComponentFixture<UiSwitchOnoffComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiSwitchOnoffComponent],
			imports: [RouterTestingModule, TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				}
			}), HttpClientTestingModule],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSwitchOnoffComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('should call sendChangeEvent', () => {
		const event = { target: { switchValue: 4 } }
		component.sendChangeEvent(event)
	});
	it('should call stopPropagation', () => {
		const event = new Event('click');
		component.stopPropagation(event)
	});
	it('should call onChange', () => {
		const event = { target: { switchValue: 4, disabled: true } }
		component.onChange(event)
	});
});
