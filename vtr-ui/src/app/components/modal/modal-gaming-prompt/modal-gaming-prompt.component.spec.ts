import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalGamingPromptComponent } from './modal-gaming-prompt.component';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@lenovo/material/dialog';

describe('ModalGamingPromptComponent', () => {
	let component: ModalGamingPromptComponent;
	let fixture: ComponentFixture<ModalGamingPromptComponent>;
	let activeModalService: any;
	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ModalGamingPromptComponent],
				imports: [TranslationModule],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [MatDialogRef, HttpClient, TranslateStore],
			});
			activeModalService = TestBed.inject(MatDialogRef);
			fixture = TestBed.createComponent(ModalGamingPromptComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should click close button', () => {
		spyOn(activeModalService, 'close').and.callThrough();
		expect(activeModalService.close).toHaveBeenCalledTimes(0);
		component.closeModal();
		expect(activeModalService.close).toHaveBeenCalledTimes(1);
	});
	it('should click confirm button', () => {
		spyOn(activeModalService, 'close').and.callThrough();
		expect(activeModalService.close).toHaveBeenCalledTimes(0);
		component.confirmFn();
		expect(activeModalService.close).toHaveBeenCalledTimes(1);
	});

	it('should click cancle button', () => {
		spyOn(activeModalService, 'close').and.callThrough();
		expect(activeModalService.close).toHaveBeenCalledTimes(0);
		component.cancelFn();
		expect(activeModalService.close).toHaveBeenCalledTimes(1);
	});

	it('should click checkbox setNotAskAgain', () => {
		const isChecked = component.isChecked;
		component.setNotAskAgain();
		expect(component.isChecked).toEqual(!isChecked);
	});

	it('should focus on close button', () => {
		const elem: HTMLElement = document.querySelector('.gaming-advanced-prompt-close');
		elem.parentElement.removeChild(elem);
		const elem2: HTMLElement = document.querySelector('.gaming-advanced-prompt-close');
		component.focusCloseButton();
		expect(elem2).toBeNull();
	});
});
