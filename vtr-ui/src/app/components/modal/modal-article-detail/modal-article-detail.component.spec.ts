import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalArticleDetailComponent } from './modal-article-detail.component';

xdescribe('ModalArticleDetailComponent', () => {
	let component: ModalArticleDetailComponent;
	let fixture: ComponentFixture<ModalArticleDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModalArticleDetailComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalArticleDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
