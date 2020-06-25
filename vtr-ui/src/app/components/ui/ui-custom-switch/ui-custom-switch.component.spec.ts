import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCustomSwitchComponent } from './ui-custom-switch.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('UiCustomSwitchComponent', () => {
	let component: UiCustomSwitchComponent;
	let fixture: ComponentFixture<UiCustomSwitchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiCustomSwitchComponent],
			imports: [HttpClientTestingModule, TranslateModule.forRoot()],
			providers: []
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCustomSwitchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
