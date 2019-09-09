import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveProtectionSystemComponent } from './active-protection-system.component';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

xdescribe('ActiveProtectionSystemComponent', () => {
	let component: ActiveProtectionSystemComponent;
	let fixture: ComponentFixture<ActiveProtectionSystemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ActiveProtectionSystemComponent],
			imports: [TranslationModule],
			providers: [TranslateStore],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ActiveProtectionSystemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		spyOn(component, 'initAPS');
		expect(component).toBeTruthy();
	});
});
