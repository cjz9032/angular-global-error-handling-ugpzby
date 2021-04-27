import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupportDetailArticleDComponent } from './support-detail-article-d.component';

describe('SupportDetailArticleDComponent', () => {
	let component: SupportDetailArticleDComponent;
	let fixture: ComponentFixture<SupportDetailArticleDComponent>;
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [SupportDetailArticleDComponent]
		})
			.compileComponents();
	});
	beforeEach(() => {
		fixture = TestBed.createComponent(SupportDetailArticleDComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
