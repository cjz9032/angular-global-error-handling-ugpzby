import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserDefinedKeyComponent } from './user-defined-key.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { CommonService } from 'src/app/services/common/common.service';

describe('UserDefinedKeyComponent', () => {
	let component: UserDefinedKeyComponent;
	let fixture: ComponentFixture<UserDefinedKeyComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UserDefinedKeyComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
			providers: [InputAccessoriesService, TranslateService, LoggerService, CommonService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserDefinedKeyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
