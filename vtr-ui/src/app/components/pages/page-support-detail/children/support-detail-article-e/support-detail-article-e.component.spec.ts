import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupportDetailArticleEComponent } from './support-detail-article-e.component';

describe('SupportDetailArticleEComponent', () => {
	let component: SupportDetailArticleEComponent;
	let fixture: ComponentFixture<SupportDetailArticleEComponent>;
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [SupportDetailArticleEComponent]
		})
			.compileComponents();
	});
	beforeEach(() => {
		fixture = TestBed.createComponent(SupportDetailArticleEComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
