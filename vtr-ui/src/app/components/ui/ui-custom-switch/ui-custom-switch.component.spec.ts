import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DevService } from 'src/app/services/dev/dev.service';
import { UiCustomSwitchComponent } from './ui-custom-switch.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('UiCustomSwitchComponent', () => {
	let component: UiCustomSwitchComponent;
	let fixture: ComponentFixture<UiCustomSwitchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiCustomSwitchComponent],
			imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
			providers: [DevService, MetricService],
		}).compileComponents();
	}));

	describe(':', () => {
		function setup() {
			const fixture = TestBed.createComponent(UiCustomSwitchComponent);
			const component = fixture.debugElement.componentInstance;
			// const componentElement = fixture.debugElement.nativeElement;

			return { fixture, component };
		}

		it('should create ', () => {
			const { component } = setup();
			expect(component).toBeTruthy();
		});
	});
});
