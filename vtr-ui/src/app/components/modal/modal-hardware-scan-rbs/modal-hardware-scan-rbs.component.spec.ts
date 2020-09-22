import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHardwareScanRbsComponent } from './modal-hardware-scan-rbs.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { DevService } from 'src/app/services/dev/dev.service';
import { HardwareScanService } from 'src/app/services/hardware-scan/hardware-scan.service';

describe('ModalHardwareScanRbsComponent', () => {
	let hwScanService: HardwareScanService;
	let component: ModalHardwareScanRbsComponent;
	let fixture: ComponentFixture<ModalHardwareScanRbsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ModalHardwareScanRbsComponent ],
			imports: [ TranslateModule.forRoot(), HttpClientModule ],
			providers: [ NgbActiveModal, HttpClientModule, DevService ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalHardwareScanRbsComponent);
		component = fixture.componentInstance;
		hwScanService = TestBed.inject(HardwareScanService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call getItemsToRecoverBadSectors and getComponentTitle when call ngOnInit', () => {
		const spyGetItems = spyOn<any>(component, 'getItemsToRecoverBadSectors');
		const spyGetComponentTitle = spyOn<any>(component, 'getComponentTitle');
		component.ngOnInit();
		expect(spyGetItems).toHaveBeenCalled();
		expect(spyGetComponentTitle).toHaveBeenCalled();
	});

	it('should call getComponentTitle', () => {
		expect(component.getComponentTitle()).not.toBeNull();
	});

	it('should call onClickRun', () => {
		const spy = spyOn(component, 'onClickRun');
		component.onClickRun();
		expect(spy).toHaveBeenCalled();
	});

	it('should call isSelectedItem', () => {
		const spy = spyOn(component, 'isSelectedItem');
		component.isSelectedItem();
		expect(spy).toHaveBeenCalled();
	});
});
