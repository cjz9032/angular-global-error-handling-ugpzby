import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UIArticleItemComponent } from './ui-article-item.component';

xdescribe('UIArticleItemComponent', () => {
	let component: UIArticleItemComponent;
	let fixture: ComponentFixture<UIArticleItemComponent>;

	beforeEach(async(() => {
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
