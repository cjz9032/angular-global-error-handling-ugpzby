import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DevService } from '../../../../../services/dev/dev.service';
import { UiHardwareListComponent } from './ui-hardware-list.component';

describe('UiHardwareListComponent', () => {
	let component: UiHardwareListComponent;
	let fixture: ComponentFixture<UiHardwareListComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientModule, TranslateModule.forRoot()],
			providers: [DevService],
			declarations: [UiHardwareListComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiHardwareListComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call setTooltipInfo', () => {
		const newTooltip = 'This is a test tooltip text';
		const spy = spyOn(component, 'setTooltipInfo');
		component.setTooltipInfo(newTooltip, 0);
		expect(spy).toHaveBeenCalled();
	});

	it('should have component id', () => {
		const compId = component.componentId;
		expect(compId).not.toEqual('');
	});
});
