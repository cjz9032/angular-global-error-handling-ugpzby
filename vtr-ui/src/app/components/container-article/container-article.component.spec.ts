import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContainerArticleComponent } from './container-article.component';

xdescribe('ContainerArticleComponent', () => {
	let component: ContainerArticleComponent;
	let fixture: ComponentFixture<ContainerArticleComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ContainerArticleComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContainerArticleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
