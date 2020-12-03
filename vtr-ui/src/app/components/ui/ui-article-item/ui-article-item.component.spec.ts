import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UIArticleItemComponent } from './ui-article-item.component';

xdescribe('UIArticleItemComponent', () => {
	let component: UIArticleItemComponent;
	let fixture: ComponentFixture<UIArticleItemComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UIArticleItemComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UIArticleItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
