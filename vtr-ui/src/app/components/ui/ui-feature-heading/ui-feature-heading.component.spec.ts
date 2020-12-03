import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiFeatureHeadingComponent } from './ui-feature-heading.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SvgInlinePipe } from 'src/app/pipe/svg-inline/svg-inline.pipe';

describe('UiFeatureHeadingComponent', () => {
	let component: UiFeatureHeadingComponent;
	let fixture: ComponentFixture<UiFeatureHeadingComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiFeatureHeadingComponent, SvgInlinePipe],
			imports: [HttpClientTestingModule, TranslateModule.forRoot()],
			providers: [],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiFeatureHeadingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
