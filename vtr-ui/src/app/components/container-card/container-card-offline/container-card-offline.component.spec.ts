import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCardOfflineComponent } from './container-card-offline.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStore } from '@ngx-translate/core';
import { DevService } from 'src/app/services/dev/dev.service';

describe('ContainerCardOfflineComponent', () => {
	let component: ContainerCardOfflineComponent;
	let fixture: ComponentFixture<ContainerCardOfflineComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ContainerCardOfflineComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore, DevService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContainerCardOfflineComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
