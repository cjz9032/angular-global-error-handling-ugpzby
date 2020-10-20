import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExportLogComponent } from './modal-export-log.component';

describe('ModalExportLogComponent', () => {
	let component: ModalExportLogComponent;
	let fixture: ComponentFixture<ModalExportLogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ModalExportLogComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalExportLogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
