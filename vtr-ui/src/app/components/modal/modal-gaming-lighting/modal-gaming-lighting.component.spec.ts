import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalGamingLightingComponent } from './modal-gaming-lighting.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { MatDialogRef, MatDialog } from '@lenovo/material/dialog';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { HttpHandler } from '@angular/common/http';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TranslateStore } from '@ngx-translate/core';
import { GAMING_DATA } from './../../../../testing/gaming-data';

describe('ModalGamingLightingComponent', () => {
	let component: ModalGamingLightingComponent;
	let fixture: ComponentFixture<ModalGamingLightingComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					ModalGamingLightingComponent,
					GAMING_DATA.mockPipe({ name: 'translate' }),
					GAMING_DATA.mockPipe({ name: 'sanitize' }),
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					MatDialogRef,
					HttpHandler,
					VantageShellService,
					LoggerService,
					MatDialog,
					TranslateStore,
				],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalGamingLightingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should check closeModal', () => {
		fixture.detectChanges();
		component.closeModal();
		expect(component).toBeTruthy();
	});
});
