import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFailedModalComponent } from './download-failed-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('DownloadFailedModalComponent', () => {
	let component: DownloadFailedModalComponent;
	let fixture: ComponentFixture<DownloadFailedModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DownloadFailedModalComponent, SvgInlinePipe],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
			providers: [NgbActiveModal],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DownloadFailedModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
