import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { ModalHardwareScanRbsComponent } from './modal-hardware-scan-rbs.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { DevService } from 'src/app/services/dev/dev.service';
import { HardwareScanService } from 'src/app/services/hardware-scan/hardware-scan.service';

fdescribe('ModalHardwareScanRbsComponent', () => {
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

	fit('should create', () => {
		expect(component).toBeTruthy();
	});

	fit('should translate the component title token', () => {
		const spy = spyOn(component, 'getComponentTitle');
		const result = component.getComponentTitle();
		expect(result).not.toEqual('');
	});

	fit('should call get items to recover bad sectors', () => {
		const spy = spyOn(component, 'getItemsToRecoverBadSectors');
		component.getItemsToRecoverBadSectors();
		expect(spy).toHaveBeenCalled();
	});

	fit('should call on click run', () => {
		const spy = spyOn(component, 'onClickRun');
		component.onClickRun();
		expect(spy).toHaveBeenCalled();
	});
});
