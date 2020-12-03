import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalGamingLightingComponent } from './modal-gaming-lighting.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { HttpHandler } from '@angular/common/http';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TranslateStore } from '@ngx-translate/core';

describe('ModalGamingLightingComponent', () => {
	let component: ModalGamingLightingComponent;
	let fixture: ComponentFixture<ModalGamingLightingComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				ModalGamingLightingComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' }),
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				NgbActiveModal,
				HttpHandler,
				VantageShellService,
				LoggerService,
				NgbModal,
				TranslateStore,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalGamingLightingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('onFocus calling modal focus', () => {
		fixture.detectChanges();
		const modalres = document.createElement('div');
		modalres.setAttribute('class', 'gaming-help-modal');
		fixture.debugElement.nativeElement.append(modalres);
		component.onFocus();
		expect(modalres).toBeTruthy();
	});

	it('should check closeModal', () => {
		fixture.detectChanges();
		component.closeModal();
		expect(component).toBeTruthy();
	});
});

export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name,
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}
