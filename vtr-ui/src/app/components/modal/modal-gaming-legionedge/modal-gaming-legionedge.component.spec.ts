import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalGamingLegionedgeComponent } from './modal-gaming-legionedge.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@lenovo/material/dialog';
import { GAMING_DATA } from './../../../../testing/gaming-data';

describe('ModalGamingLegionedgeComponent', () => {
	let component: ModalGamingLegionedgeComponent;
	let fixture: ComponentFixture<ModalGamingLegionedgeComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					ModalGamingLegionedgeComponent,
					GAMING_DATA.mockPipe({ name: 'translate' }),
					GAMING_DATA.mockPipe({ name: 'sanitize' }),
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [MatDialogRef, HttpClient],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalGamingLegionedgeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should check closeModal', () => {
		component.closeModal();
		expect(component).toBeTruthy();
	});
});
