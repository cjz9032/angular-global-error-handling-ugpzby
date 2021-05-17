import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef } from '@lenovo/material/dialog';

import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';
import { DownloadFailedModalComponent } from './download-failed-modal.component';

describe('DownloadFailedModalComponent', () => {
	let component: DownloadFailedModalComponent;
	let fixture: ComponentFixture<DownloadFailedModalComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [DownloadFailedModalComponent, SvgInlinePipe],
				schemas: [NO_ERRORS_SCHEMA],
				imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
				providers: [MatDialogRef],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(DownloadFailedModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
