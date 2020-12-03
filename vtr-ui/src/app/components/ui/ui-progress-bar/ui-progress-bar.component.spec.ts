import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiProgressBarComponent } from './ui-progress-bar.component';
import { TranslateModule } from '@ngx-translate/core';

describe('UiProgressBarComponent', () => {
	let component: UiProgressBarComponent;
	let fixture: ComponentFixture<UiProgressBarComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiProgressBarComponent],
			imports: [TranslateModule.forRoot()],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiProgressBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
